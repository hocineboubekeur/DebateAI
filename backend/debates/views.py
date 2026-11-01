from rest_framework import status, permissions
from django.utils.translation import gettext as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.utils import timezone
from .models import DebateSession, DebateTurn
from .serializers import DebateSessionSerializer, DebateTurnSerializer
from scoring.ai_engine import AIEngine
from scoring.models import JudgeEvaluation
from accounts.models import UserProfile
from coaching.models import DebateDNA
from achievements.models import Achievement, UserAchievement
import random
from .models import PERSONA_CHOICES
from django.db.models import Q

def get_current_user(request):
    if request.user and request.user.is_authenticated:
        return request.user
    guest_user, _ = User.objects.get_or_create(username='GuestUser', defaults={'email': 'guest@debateai.com'})
    if not hasattr(guest_user, 'profile'):
        UserProfile.objects.create(user=guest_user)
    return guest_user

def evaluate_and_unlock_achievements(user, debate, eval_data, turns):
    """Automatically unlocks achievements based on debate performance."""
    profile = user.profile
    unlocked_codes = []

    def unlock(code):
        try:
            ach = Achievement.objects.get(code=code)
            user_ach, created = UserAchievement.objects.get_or_create(user=user, achievement=ach)
            if created:
                profile.xp += ach.xp_reward
                profile.dp += ach.dp_reward
                unlocked_codes.append(ach.title)
        except Achievement.DoesNotExist:
            pass

    completed_count = DebateSession.objects.filter(user=user, status='COMPLETED').count()
    winner = eval_data.get('winner', 'USER')
    user_score = eval_data.get('user_score', 80)
    logic_score = eval_data.get('logic_breakdown', {}).get('user', user_score)

    # 1. FIRST_DEBATE
    if completed_count >= 1:
        unlock('FIRST_DEBATE')

    # 2. WINNER
    if winner == 'USER':
        unlock('WINNER')

    # 3. LOGIC_MASTER
    if logic_score >= 90:
        unlock('LOGIC_MASTER')

    # 4. DEVILS_SURVIVOR
    if debate.persona == 'DEVILS_ADVOCATE' and len(turns) >= 6:
        unlock('DEVILS_SURVIVOR')

    # 5. SOCRATIC_WIN
    if debate.style == 'SOCRATIC' and winner == 'USER':
        unlock('SOCRATIC_WIN')

    # 6. SPEED_DEBATER
    if debate.style == 'RAPID_FIRE' and winner == 'USER':
        unlock('SPEED_DEBATER')

    # 7. FALLACY_SPOTTER
    user_turns = [t for t in turns if t.speaker == 'USER']
    total_fallacies = sum(len(t.fallacies_detected or []) for t in user_turns)
    if total_fallacies == 0 and winner == 'USER' and len(user_turns) >= 2:
        unlock('FALLACY_SPOTTER')

    # 8. SECRET_PHOENIX
    if user_turns and user_turns[0].logic_score < 60 and winner == 'USER':
        unlock('SECRET_PHOENIX')

    # 9. DARK_LORD (Secret)
    if debate.persona == 'DEVILS_ADVOCATE' and debate.difficulty in ['MASTER', 'GRANDMASTER'] and winner == 'USER':
        unlock('DARK_LORD')

    # 10. THE_UNSTOPPABLE (Secret)
    recent_wins = DebateSession.objects.filter(user=user, status='COMPLETED').order_by('-completed_at')[:3]
    if len(recent_wins) >= 3 and all(d.winner == 'USER' for d in recent_wins):
        unlock('THE_UNSTOPPABLE')

    profile.calculate_level()
    profile.save()
    return unlocked_codes


@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def debates_list_create(request):
    user = get_current_user(request)
    
    if request.method == 'GET':
        debates = DebateSession.objects.filter(user=user).order_by('-created_at')
        return Response(DebateSessionSerializer(debates, many=True).data)

    elif request.method == 'POST':
        topic = request.data.get('topic', 'Should AI be regulated internationally?')
        user_side = request.data.get('user_side', 'FOR')
        persona = request.data.get('persona', 'PHILOSOPHER')
        style = request.data.get('style', 'CASUAL')
        difficulty = request.data.get('difficulty', 'BALANCED')
        lang = request.data.get('lang', 'en')

        is_mystery = request.data.get('is_mystery', False)
        roleplay_context = request.data.get('roleplay_context', {})

        if is_mystery:
            persona = random.choice([choice[0] for choice in PERSONA_CHOICES])

        debate = DebateSession.objects.create(
            user=user,
            topic=topic,
            user_side=user_side,
            persona=persona,
            style=style,
            difficulty=difficulty,
            status='IN_PROGRESS',
            is_mystery=is_mystery,
            roleplay_context=roleplay_context
        )

        # AI persona opening argument
        opening_text = f"Hello, I am taking the stance {('AGAINST' if user_side == 'FOR' else 'FOR')} on '{topic}'. Let us begin our debate."
        if roleplay_context:
            opening_text = f"Scenario: {roleplay_context.get('title', '')}. I am {roleplay_context.get('ai_role', 'the AI')}, and you are {roleplay_context.get('user_role', 'the user')}. " + opening_text

        ai_opening = AIEngine.generate_debater_turn(debate, opening_text, lang=lang)
        
        DebateTurn.objects.create(
            debate=debate,
            round_number=1,
            speaker='AI',
            text=ai_opening['text'],
            logic_score=ai_opening['logic_score'],
            persuasion_score=ai_opening['persuasion_score']
        )

        return Response(DebateSessionSerializer(debate).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def debate_detail(request, pk):
    user = get_current_user(request)
    try:
        debate = DebateSession.objects.get(pk=pk, user=user)
        return Response(DebateSessionSerializer(debate).data)
    except DebateSession.DoesNotExist:
        return Response({'error': 'Debate not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def submit_turn(request, pk):
    try:
        debate = DebateSession.objects.get(pk=pk)
    except DebateSession.DoesNotExist:
        return Response({'error': _('Debate not found')}, status=status.HTTP_404_NOT_FOUND)

    if debate.status == 'COMPLETED':
        return Response({'error': _('This debate has already been completed.')}, status=status.HTTP_400_BAD_REQUEST)

    user_text = request.data.get('text', '').strip()
    lang = request.data.get('lang', 'en')
    if not user_text:
        return Response({'error': _('Argument text is required')}, status=status.HTTP_400_BAD_REQUEST)

    if len(user_text) > 5000:
        return Response({'error': _('Argument text is too long (max 5000 characters).')}, status=status.HTTP_400_BAD_REQUEST)

    existing_turns = list(debate.turns.all())
    current_round = (len(existing_turns) // 2) + 1

    # Detect fallacies and score user turn
    fallacies = AIEngine.detect_quick_fallacies(user_text, debate.topic)
    user_turn = DebateTurn.objects.create(
        debate=debate,
        round_number=current_round,
        speaker='USER',
        text=user_text,
        fallacies_detected=fallacies,
        logic_score=max(30, 95 - len(fallacies) * 15),
        persuasion_score=80
    )

    # Generate AI counter argument
    ai_turn_data = AIEngine.generate_debater_turn(debate, user_text, previous_turns=existing_turns + [user_turn], lang=lang)
    
    ai_turn = DebateTurn.objects.create(
        debate=debate,
        round_number=current_round,
        speaker='AI',
        text=ai_turn_data['text'],
        logic_score=ai_turn_data['logic_score'],
        persuasion_score=ai_turn_data['persuasion_score']
    )

    return Response({
        'user_turn': DebateTurnSerializer(user_turn).data,
        'ai_turn': DebateTurnSerializer(ai_turn).data,
        'debate': DebateSessionSerializer(debate).data
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def finish_debate(request, pk):
    user = get_current_user(request)
    try:
        debate = DebateSession.objects.get(pk=pk, user=user)
    except DebateSession.DoesNotExist:
        return Response({'error': _('Debate not found')}, status=status.HTTP_404_NOT_FOUND)

    if debate.status == 'COMPLETED':
        return Response({'error': _('This debate has already been completed.')}, status=status.HTTP_400_BAD_REQUEST)

    turns = list(debate.turns.all())
    if not turns:
        return Response({'error': _('No turns found for debate')}, status=status.HTTP_400_BAD_REQUEST)

    # Run AI Judge Evaluation
    eval_data = AIEngine.evaluate_debate(debate, turns)

    winner = eval_data.get('winner', 'USER')
    winner_upper = winner.upper() if winner else 'USER'
    user_score = int(eval_data.get('user_score', 80))

    debate.status = 'COMPLETED'
    debate.winner = winner
    debate.score_overall = user_score
    user_cats = eval_data.get('user_categories', {})
    debate.score_logic = int(user_cats.get('logic', user_score))
    debate.score_evidence = int(user_cats.get('evidence', user_score))
    debate.score_rebuttal = int(user_cats.get('rebuttal', user_score))
    debate.score_consistency = int(user_cats.get('consistency', user_score))
    debate.score_clarity = int(user_cats.get('clarity', user_score))
    debate.score_questions = int(user_cats.get('question_handling', user_score))
    debate.score_persuasion = int(user_cats.get('persuasion', user_score))
    
    debate.confidence = eval_data.get('confidence', 75)
    debate.margin_of_victory = eval_data.get('margin_of_victory', 0.0)
    debate.completed_at = timezone.now()
    debate.save()

    evaluation, _ = JudgeEvaluation.objects.get_or_create(
        debate=debate,
        defaults={
            'is_draw': eval_data.get('is_draw', False),
            'confidence_score': eval_data.get('confidence', 75),
            'margin_of_victory': eval_data.get('margin_of_victory', 0.0),
            'judge_summary': eval_data.get('judge_summary', ''),
            'user_score': user_score,
            'ai_score': eval_data.get('ai_score', 75),
            'detailed_categories': {
                'user': user_cats,
                'ai': eval_data.get('ai_categories', {})
            },
            'logic_breakdown': eval_data.get('logic_breakdown', {}),
            'evidence_breakdown': eval_data.get('evidence_breakdown', {}),
            'rebuttal_breakdown': eval_data.get('rebuttal_breakdown', {}),
            'fallacies_found': eval_data.get('fallacies_found', []),
            'key_turning_points': eval_data.get('key_turning_points', []),
            'top_recommendations': eval_data.get('top_recommendations', [])
        }
    )

    # Reward user XP & DP
    profile, _ = UserProfile.objects.get_or_create(user=debate.user)
    if winner_upper == 'USER':
        dp_gain, xp_gain = 150, 100
    elif winner_upper in ('DRAW', 'TIE'):
        dp_gain, xp_gain = 100, 70
    else:
        dp_gain, xp_gain = 50, 40
    
    profile.dp += dp_gain
    profile.xp += xp_gain
    profile.calculate_level()
    profile.save()

    # Update Debate DNA
    dna, _ = DebateDNA.objects.get_or_create(user=debate.user)
    dna.logic = min(99, max(30, (dna.logic + debate.score_logic) // 2))
    dna.evidence = min(99, max(30, (dna.evidence + debate.score_evidence) // 2))
    dna.persuasion = min(99, max(30, (dna.persuasion + debate.score_overall) // 2))
    dna.rebuttal = min(99, max(30, (dna.rebuttal + debate.score_rebuttal) // 2))
    dna.save()

    # AUTO-UNLOCK ACHIEVEMENTS
    unlocked_achievements = evaluate_and_unlock_achievements(debate.user, debate, eval_data, turns)

    return Response({
        'debate': DebateSessionSerializer(debate).data,
        'dp_earned': dp_gain,
        'xp_earned': xp_gain,
        'new_total_dp': profile.dp,
        'new_total_xp': profile.xp,
        'new_level': profile.level,
        'unlocked_achievements': unlocked_achievements
    })


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reflect_on_debate(request, pk):
    user = get_current_user(request)
    try:
        debate = DebateSession.objects.get(pk=pk, user=user)
    except DebateSession.DoesNotExist:
        return Response({'error': 'Debate not found'}, status=status.HTTP_404_NOT_FOUND)
    
    reflection = request.data.get('reflection_text', '')
    if not reflection:
        return Response({'error': 'reflection_text is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    debate.reflection_text = reflection
    try:
        prompt = f"Analyze the following reflection for debate '{debate.topic}': '{reflection}'. Identify knowledge gaps and provide feedback in JSON with keys 'ai_reflection_feedback' and 'knowledge_gaps' (list)."
        result_text = AIEngine.call_gemini_api(prompt)
        import json
        if result_text.startswith('```json'):
            result_text = result_text[7:-3]
        elif result_text.startswith('```'):
            result_text = result_text[3:-3]
        data = json.loads(result_text)
        debate.ai_reflection_feedback = data.get('ai_reflection_feedback', '')
        debate.knowledge_gaps = data.get('knowledge_gaps', [])
    except Exception as e:
        debate.ai_reflection_feedback = "Error analyzing reflection."
        
    debate.save()
    
    profile = user.profile
    profile.xp += 30
    profile.calculate_level()
    profile.save()
    
    return Response(DebateSessionSerializer(debate).data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def perspective_challenge(request, pk):
    user = get_current_user(request)
    try:
        debate = DebateSession.objects.get(pk=pk, user=user)
    except DebateSession.DoesNotExist:
        return Response({'error': 'Debate not found'}, status=status.HTTP_404_NOT_FOUND)
    
    perspective = request.data.get('opposite_perspective_text', '')
    if not perspective:
        return Response({'error': 'opposite_perspective_text is required'}, status=status.HTTP_400_BAD_REQUEST)
        
    debate.opposite_perspective_text = perspective
    try:
        prompt = f"Evaluate this steelman argument for the opposite perspective of '{debate.user_side}' on '{debate.topic}': '{perspective}'. Return a JSON with key 'score' from 0 to 100."
        result_text = AIEngine.call_gemini_api(prompt)
        import json
        if result_text.startswith('```json'):
            result_text = result_text[7:-3]
        elif result_text.startswith('```'):
            result_text = result_text[3:-3]
        data = json.loads(result_text)
        score = int(data.get('score', 0))
    except Exception:
        score = 0
        
    debate.perspective_score = score
    debate.save()
    
    profile = user.profile
    dp_earned = 0
    xp_earned = 0
    if score >= 50:
        dp_earned = 50
        xp_earned = 50
        profile.dp += dp_earned
        profile.xp += xp_earned
        profile.calculate_level()
        profile.save()
        
    return Response({
        'debate': DebateSessionSerializer(debate).data,
        'perspective_score': score,
        'dp_earned': dp_earned,
        'xp_earned': xp_earned
    })

@api_view(['PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def manage_debate(request, pk):
    user = get_current_user(request)
    try:
        debate = DebateSession.objects.get(pk=pk, user=user)
    except DebateSession.DoesNotExist:
        return Response({'error': 'Debate not found'}, status=status.HTTP_404_NOT_FOUND)
        
    if request.method == 'PATCH':
        if 'custom_title' in request.data:
            debate.custom_title = request.data['custom_title']
        if 'tags' in request.data:
            debate.tags = request.data['tags']
        debate.save()
        return Response(DebateSessionSerializer(debate).data)
    elif request.method == 'DELETE':
        debate.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def export_debate(request, pk):
    user = get_current_user(request)
    try:
        debate = DebateSession.objects.get(pk=pk, user=user)
    except DebateSession.DoesNotExist:
        return Response({'error': 'Debate not found'}, status=status.HTTP_404_NOT_FOUND)
        
    transcript = f"Debate Topic: {debate.topic}\n"
    transcript += f"Style: {debate.style}, Persona: {debate.persona}, Difficulty: {debate.difficulty}\n\n"
    for turn in debate.turns.all().order_by('round_number', 'id'):
        transcript += f"Round {turn.round_number} - {turn.speaker}:\n{turn.text}\n\n"
        
    try:
        summary = debate.evaluation.judge_summary
    except Exception:
        summary = "No evaluation available."
        
    return Response({
        'transcript': transcript,
        'summary': summary
    })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_debates(request):
    user = get_current_user(request)
    if not user:
        return Response([])

    q = request.query_params.get('q', '')
    persona = request.query_params.get('persona', '')
    min_score = request.query_params.get('min_score', '')

    debates = DebateSession.objects.filter(user=user)
    
    if q:
        debates = debates.filter(
            Q(topic__icontains=q) |
            Q(custom_title__icontains=q) |
            Q(tags__icontains=q) |
            Q(turns__text__icontains=q) |
            Q(evaluation__judge_summary__icontains=q)
        )
        
    if persona:
        debates = debates.filter(persona=persona)
        
    if min_score:
        try:
            score = int(min_score)
            debates = debates.filter(score_overall__gte=score)
        except ValueError:
            pass
            
    debates = debates.distinct().order_by('-created_at')
    
    return Response(DebateSessionSerializer(debates, many=True).data)
