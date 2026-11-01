from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import FallacyArticle, QuizQuestion, BookDebateTopic
from .serializers import BookDebateTopicSerializer
from accounts.models import UserProfile
from debates.views import get_current_user



@api_view(['GET'])
@permission_classes([AllowAny])
def fallacies_list(request):
    lang = request.GET.get('lang', 'en')
    articles = FallacyArticle.objects.all()
    res = []
    for a in articles:
        if lang == 'ar':
            res.append({
                'id': a.id,
                'name': a.name_ar or a.name,
                'slug': a.slug,
                'category': a.category_ar or a.category,
                'summary': a.summary_ar or a.summary,
                'description': a.description_ar or a.description,
                'example_bad': a.example_bad_ar or a.example_bad,
                'example_good': a.example_good_ar or a.example_good,
                'how_to_counter': a.how_to_counter_ar or a.how_to_counter
            })
        else:
            res.append({
                'id': a.id,
                'name': a.name,
                'slug': a.slug,
                'category': a.category,
                'summary': a.summary,
                'description': a.description,
                'example_bad': a.example_bad,
                'example_good': a.example_good,
                'how_to_counter': a.how_to_counter
            })
    return Response(res)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def quizzes_list_submit(request):
    user = get_current_user(request)
    
    if request.method == 'GET':
        lang = request.GET.get('lang', 'en')
        quizzes = QuizQuestion.objects.all()
        res = []
        for q in quizzes:
            if lang == 'ar':
                res.append({
                    'id': q.id,
                    'question': q.question_ar or q.question,
                    'option_a': q.option_a_ar or q.option_a,
                    'option_b': q.option_b_ar or q.option_b,
                    'option_c': q.option_c_ar or q.option_c,
                    'option_d': q.option_d_ar or q.option_d,
                    'xp_reward': q.xp_reward
                })
            else:
                res.append({
                    'id': q.id,
                    'question': q.question,
                    'option_a': q.option_a,
                    'option_b': q.option_b,
                    'option_c': q.option_c,
                    'option_d': q.option_d,
                    'xp_reward': q.xp_reward
                })
        return Response(res)

    elif request.method == 'POST':
        lang = request.data.get('lang', 'en')
        quiz_id = request.data.get('quiz_id')
        selected_option = request.data.get('selected_option', '').upper()

        try:
            quiz = QuizQuestion.objects.get(pk=quiz_id)
        except QuizQuestion.DoesNotExist:
            return Response({'error': 'Quiz question not found'}, status=404)

        is_correct = (selected_option == quiz.correct_option)
        xp_earned = quiz.xp_reward if is_correct else 0

        if is_correct and user:
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.xp += xp_earned
            profile.calculate_level()
            profile.save()

        explanation = quiz.explanation_ar if lang == 'ar' and quiz.explanation_ar else quiz.explanation

        return Response({
            'correct': is_correct,
            'correct_option': quiz.correct_option,
            'explanation': explanation,
            'xp_earned': xp_earned
        })


@api_view(['GET'])
@permission_classes([AllowAny])
def book_club_list(request):
    if not BookDebateTopic.objects.exists():
        topics = [
            BookDebateTopic(
                book_title="1984", author="George Orwell", theme="Surveillance & Freedom",
                debate_topic="Is total state surveillance morally defensible if it maintains absolute peace?",
                description="Explore the tension between collective security and individual liberty in Orwell's dystopia."
            ),
            BookDebateTopic(
                book_title="Brave New World", author="Aldous Huxley", theme="Happiness vs. Freedom",
                debate_topic="Is engineered emotional happiness preferable to painful human freedom?",
                description="Debate whether a society free from pain but also free from genuine emotion is worth living in."
            ),
            BookDebateTopic(
                book_title="Crime and Punishment", author="Fyodor Dostoevsky", theme="Morality & Law",
                debate_topic="Can an extraordinary individual ever be morally justified in breaking universal ethical laws?",
                description="Discuss Raskolnikov's theory of the 'extraordinary man' and its ethical implications."
            ),
            BookDebateTopic(
                book_title="Frankenstein", author="Mary Shelley", theme="Science & Ethics",
                debate_topic="Should scientific innovation be strictly constrained by ethical boundaries?",
                description="Argue about the responsibilities of creators toward their creations and the limits of science."
            ),
            BookDebateTopic(
                book_title="The Republic", author="Plato", theme="Governance & Justice",
                debate_topic="Is democracy inherently vulnerable to tyranny compared to philosopher-king governance?",
                description="Analyze Plato's critique of democracy and his vision for an ideal, just state."
            ),
            BookDebateTopic(
                book_title="Fahrenheit 451", author="Ray Bradbury", theme="Censorship & Society",
                debate_topic="Is censorship primarily driven by government coercion or consumer demand for comfort?",
                description="Debate whether the destruction of knowledge is a top-down mandate or a societal choice."
            ),
        ]
        BookDebateTopic.objects.bulk_create(topics)
    
    topics = BookDebateTopic.objects.all()
    serializer = BookDebateTopicSerializer(topics, many=True)
    return Response(serializer.data)
