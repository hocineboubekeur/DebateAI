from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import VocabularyEntry
from .serializers import VocabularyEntrySerializer
from scoring.ai_engine import AIEngine
import json

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def vocabulary_list_create(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return Response([])
        due = request.query_params.get('due', 'false').lower() == 'true'
        entries = VocabularyEntry.objects.filter(user=request.user)
        if due:
            entries = entries.filter(next_review_date__lte=timezone.now())
        return Response(VocabularyEntrySerializer(entries, many=True).data)
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = VocabularyEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def vocabulary_detail(request, pk):
    try:
        entry = VocabularyEntry.objects.get(pk=pk, user=request.user)
    except VocabularyEntry.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PATCH':
        mastery = request.data.get('mastery_level')
        if mastery is not None:
            entry.mastery_level = mastery
        next_review = request.data.get('next_review_date')
        if next_review is not None:
            entry.next_review_date = next_review
        entry.save()
        return Response(VocabularyEntrySerializer(entry).data)
    elif request.method == 'DELETE':
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def vocabulary_ai_expand(request):
    word = request.data.get('word')
    lang = request.data.get('lang', 'en')
    if not word:
        return Response({'error': 'Word is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    prompt = f"Generate JSON for word '{word}' in language '{lang}': {{'definition': '...', 'phonetic': '...', 'context_sentence': '...', 'synonyms': ['...', '...']}}"
    try:
        result_text = AIEngine.call_gemini_api(prompt)
        if result_text.startswith('```json'):
            result_text = result_text[7:-3]
        elif result_text.startswith('```'):
            result_text = result_text[3:-3]
        data = json.loads(result_text)
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
