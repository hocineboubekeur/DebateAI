from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import PublishedDebate, DebateLike, DebateComment
from debates.models import DebateSession
from debates.views import get_current_user
from debates.serializers import DebateSessionSerializer

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def community_feed_publish(request):
    if request.method == 'POST' and not request.user.is_authenticated:
        return Response({'error': 'Authentication required to publish'}, status=401)
    
    user = request.user if request.user.is_authenticated else None

    if request.method == 'GET':
        pubs = PublishedDebate.objects.select_related('author', 'debate', 'debate__user').prefetch_related('comments', 'comments__user').order_by('-published_at')
        res = []
        for p in pubs:
            comments = p.comments.all()
            res.append({
                'id': p.id,
                'title': p.title,
                'description': p.description,
                'author_username': p.author.username,
                'author_level': getattr(p.author, 'profile', None).level if hasattr(p.author, 'profile') else 1,
                'views': p.views,
                'likes_count': p.likes_count,
                'published_at': p.published_at,
                'comments': [
                    {'id': c.id, 'username': c.user.username, 'content': c.content, 'created_at': c.created_at}
                    for c in comments
                ],
                'debate': DebateSessionSerializer(p.debate).data
            })
        return Response(res)

    elif request.method == 'POST':
        debate_id = request.data.get('debate_id')
        title = request.data.get('title', 'Masterpiece Debate')
        description = request.data.get('description', '')

        if not debate_id:
            return Response({'error': 'debate_id is required'}, status=400)

        try:
            debate = DebateSession.objects.get(pk=debate_id, user=user)
        except DebateSession.DoesNotExist:
            return Response({'error': 'Debate not found or not owned by you'}, status=404)

        if debate.status != 'COMPLETED':
            return Response({'error': 'Only completed debates can be published'}, status=400)

        if len(title) > 100:
            return Response({'error': 'Title too long (max 100)'}, status=400)
        if len(description) > 1000:
            return Response({'error': 'Description too long (max 1000)'}, status=400)

        pub, created = PublishedDebate.objects.get_or_create(
            debate=debate,
            defaults={'author': user, 'title': title, 'description': description}
        )
        
        if not created:
            return Response({'error': 'This debate has already been published'}, status=400)
        debate.is_public = True
        debate.save()

        return Response({
            'message': 'Debate published successfully!',
            'publication_id': pub.id
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_like(request, pk):
    user = request.user
    try:
        pub = PublishedDebate.objects.get(pk=pk)
    except PublishedDebate.DoesNotExist:
        return Response({'error': 'Publication not found'}, status=404)

    like, created = DebateLike.objects.get_or_create(user=user, publication=pub)
    if not created:
        like.delete()
        pub.likes_count = max(0, pub.likes_count - 1)
        liked = False
    else:
        pub.likes_count += 1
        liked = True
    pub.save()

    return Response({'liked': liked, 'likes_count': pub.likes_count})


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def comments_view(request, pk):
    if request.method == 'POST' and not request.user.is_authenticated:
        return Response({'error': 'Authentication required to comment'}, status=401)
    
    user = request.user if request.user.is_authenticated else None
    try:
        pub = PublishedDebate.objects.get(pk=pk)
    except PublishedDebate.DoesNotExist:
        return Response({'error': 'Publication not found'}, status=404)

    if request.method == 'GET':
        comments = DebateComment.objects.filter(publication=pub).order_by('created_at')
        return Response([
            {'id': c.id, 'username': c.user.username, 'content': c.content, 'created_at': c.created_at}
            for c in comments
        ])

    elif request.method == 'POST':
        content = request.data.get('content', '').strip()
        if not content:
            return Response({'error': 'Comment content required'}, status=400)
        if len(content) > 1000:
            return Response({'error': 'Comment too long (max 1000)'}, status=400)
        
        comment = DebateComment.objects.create(user=user, publication=pub, content=content)
        return Response({
            'id': comment.id,
            'username': user.username,
            'content': comment.content,
            'created_at': comment.created_at
        })
