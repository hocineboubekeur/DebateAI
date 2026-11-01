from rest_framework import status, permissions
from django.utils.translation import gettext as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.db.models import Avg, Count
from .models import UserProfile
from .serializers import UserProfileSerializer, UserRegisterSerializer
from debates.models import DebateSession, DebateTurn
from scoring.models import JudgeEvaluation
from scoring.ai_engine import GEMINI_API_KEYS, GEMINI_MODELS

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_view(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        profile = user.profile
        return Response({
            'token': token.key,
            'user': UserProfileSerializer(profile).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': _('Username and password are required.')}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': _('Invalid credentials')}, status=status.HTTP_401_UNAUTHORIZED)

    token, _ = Token.objects.get_or_create(user=user)
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return Response({
        'token': token.key,
        'user': UserProfileSerializer(profile).data
    })


@api_view(['GET', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def me_view(request):
    user = request.user

    profile, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == 'PATCH':
        new_username = request.data.get('username')
        if new_username and new_username.strip():
            new_username = new_username.strip()
            if User.objects.filter(username=new_username).exclude(pk=user.pk).exists():
                return Response({'error': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)
            user.username = new_username
            user.save(update_fields=['username'])
        
        new_title = request.data.get('current_title')
        if new_title and new_title.strip():
            profile.current_title = new_title.strip()
            profile.save(update_fields=['current_title'])
        
        new_avatar = request.data.get('avatar_url')
        if new_avatar and new_avatar.strip():
            profile.avatar_url = new_avatar.strip()
            profile.save(update_fields=['avatar_url'])

        if 'interests' in request.data:
            profile.interests = request.data.get('interests', [])
            profile.save(update_fields=['interests'])
            
        if 'primary_goals' in request.data:
            profile.primary_goals = request.data.get('primary_goals', [])
            profile.save(update_fields=['primary_goals'])
            
        if 'onboarding_completed' in request.data:
            profile.onboarding_completed = bool(request.data.get('onboarding_completed', False))
            profile.save(update_fields=['onboarding_completed'])

    return Response(UserProfileSerializer(profile).data)


# REAL ADMIN ENDPOINTS - REQUIRE STAFF ACCESS

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_telemetry_view(request):
    """Calculates REAL database statistics from SQLite."""
    total_debates = DebateSession.objects.count()
    completed_debates = DebateSession.objects.filter(status='COMPLETED')
    completed_count = completed_debates.count()
    user_wins = completed_debates.filter(winner='USER').count()
    win_rate = round((user_wins / max(1, completed_count)) * 100, 1)

    total_users = User.objects.count()
    avg_score = completed_debates.aggregate(Avg('score_overall'))['score_overall__avg'] or 0

    models_info = [
        {'model': m, 'status': 'ACTIVE', 'key_count': len(GEMINI_API_KEYS)}
        for m in GEMINI_MODELS
    ]

    return Response({
        'total_debates': total_debates,
        'completed_count': completed_count,
        'user_wins': user_wins,
        'win_rate': f"{win_rate}%",
        'total_users': total_users,
        'avg_score': round(avg_score, 1),
        'active_api_keys': len(GEMINI_API_KEYS),
        'models_pool': models_info,
        'server_uptime': 'N/A'
    })


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_users_view(request):
    """Returns REAL list of registered debater users from database."""
    users = User.objects.all().select_related('profile').order_by('-id')
    res = []
    for u in users:
        profile, _ = UserProfile.objects.get_or_create(user=u)
        res.append({
            'id': u.id,
            'username': u.username,
            'email': u.email or 'N/A',
            'level': profile.level,
            'dp': profile.dp,
            'xp': profile.xp,
            'is_active': u.is_active,
            'is_staff': u.is_staff,
            'status': 'Active' if u.is_active else 'Banned',
            'joined_at': u.date_joined.strftime('%Y-%m-%d')
        })
    return Response(res)


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def admin_user_action_view(request, pk):
    """Executes REAL database action on a user (Ban/Unban, Grant DP/XP Bonus, Promote Admin)."""
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')
    profile, _ = UserProfile.objects.get_or_create(user=user)

    if action == 'toggle_ban':
        user.is_active = not user.is_active
        user.save(update_fields=['is_active'])
    elif action == 'grant_bonus':
        profile.dp += 500
        profile.xp += 250
        profile.calculate_level()
        profile.save()
    elif action == 'toggle_admin':
        user.is_staff = not user.is_staff
        user.save(update_fields=['is_staff'])

    return Response({
        'id': user.id,
        'username': user.username,
        'is_active': user.is_active,
        'is_staff': user.is_staff,
        'status': 'Active' if user.is_active else 'Banned',
        'dp': profile.dp,
        'xp': profile.xp,
        'level': profile.level
    })


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_audit_view(request):
    """Returns REAL debate session log from database."""
    debates = DebateSession.objects.all().select_related('user', 'evaluation').order_by('-created_at')[:50]
    res = []
    for d in debates:
        try:
            evaluation = d.evaluation
            judge_summary = evaluation.judge_summary
        except Exception:
            judge_summary = "Debate in progress or not scored yet."

        res.append({
            'id': d.id,
            'user': d.user.username,
            'topic': d.topic,
            'user_side': d.user_side,
            'persona': d.persona,
            'status': d.status,
            'winner': d.winner or 'PENDING',
            'score': d.score_overall,
            'created_at': d.created_at.strftime('%Y-%m-%d %H:%M'),
            'judge_summary': judge_summary
        })
    return Response(res)
