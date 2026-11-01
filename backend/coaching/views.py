from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import DebateDNA, CoachReport
from debates.views import get_current_user
from accounts.models import UserProfile

@api_view(['GET'])
@permission_classes([AllowAny])
def debate_dna_view(request):
    user = get_current_user(request)
    dna, created = DebateDNA.objects.get_or_create(
        user=user,
        defaults={
            'logic': 0, 'evidence': 0, 'persuasion': 0, 'rebuttal': 0,
            'fallacy_avoidance': 0, 'confidence': 0, 'adaptability': 0,
            'creativity': 0, 'listening': 0, 'emotional_control': 0
        }
    )

    return Response({
        'metrics': [
            {'name': 'Logic', 'score': dna.logic},
            {'name': 'Evidence', 'score': dna.evidence},
            {'name': 'Persuasion', 'score': dna.persuasion},
            {'name': 'Rebuttals', 'score': dna.rebuttal},
            {'name': 'Fallacy Avoidance', 'score': dna.fallacy_avoidance},
            {'name': 'Confidence', 'score': dna.confidence},
            {'name': 'Adaptability', 'score': dna.adaptability},
            {'name': 'Creativity', 'score': dna.creativity},
            {'name': 'Active Listening', 'score': dna.listening},
            {'name': 'Emotional Control', 'score': dna.emotional_control},
        ],
        'updated_at': dna.updated_at
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def coach_report_view(request):
    user = get_current_user(request)
    report = CoachReport.objects.filter(user=user).first()
    if not report:
        report = CoachReport.objects.create(
            user=user,
            strongest_skills=[],
            areas_for_growth=[],
            recommended_exercises=[],
            coach_advice="Complete your first debate to generate AI coach insights.",
            suggested_topics=[]
        )

    return Response({
        'strongest_skills': report.strongest_skills,
        'areas_for_growth': report.areas_for_growth,
        'recommended_exercises': report.recommended_exercises,
        'coach_advice': report.coach_advice,
        'suggested_topics': report.suggested_topics,
        'created_at': report.created_at
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def clubs_tournaments_view(request):
    user = get_current_user(request)
    
    # Clubs and Tournaments will be built in Phase 3
    clubs = []
    tournaments = []

    # Real leaderboard from DB
    top_profiles = UserProfile.objects.all().select_related('user').order_by('-dp')[:5]
    leaderboard = []
    for index, profile in enumerate(top_profiles):
        leaderboard.append({
            'rank': index + 1,
            'username': profile.user.username,
            'dp': profile.dp,
            'level': profile.level,
            'title': profile.current_title or 'Novice Debater'
        })

    return Response({
        'clubs': clubs,
        'tournaments': tournaments,
        'leaderboard': leaderboard
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_missions(request):
    user = get_current_user(request)
    if not user:
        return Response([])
    
    # Auto-seed default missions if missing
    default_missions = [
        {"title": "First Blood", "description": "Complete 1 debate", "category": "debate", "target": 1},
        {"title": "Logic Master", "description": "Score 80+ in Logic", "category": "score", "target": 80},
        {"title": "Vocab Builder", "description": "Save 3 words in Vocabulary Vault", "category": "vocab", "target": 3},
        {"title": "Reflection Guru", "description": "Submit 1 Reflection Journal entry", "category": "journal", "target": 1},
        {"title": "Steelman Champion", "description": "Complete 1 Perspective Mode challenge", "category": "perspective", "target": 1},
    ]

    from .models import DebateMission, UserMissionProgress
    from .serializers import UserMissionProgressSerializer

    for m_data in default_missions:
        mission, _ = DebateMission.objects.get_or_create(
            title=m_data['title'],
            defaults={
                'description': m_data['description'],
                'category': m_data['category'],
                'target_value': m_data['target'],
                'reward_dp': 50,
                'reward_xp': 30
            }
        )
        UserMissionProgress.objects.get_or_create(user=user, mission=mission)

    progresses = UserMissionProgress.objects.filter(user=user).select_related('mission')
    serializer = UserMissionProgressSerializer(progresses, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def claim_mission_reward(request, pk):
    user = get_current_user(request)
    if not user:
        return Response({'error': 'Authentication required'}, status=401)
    
    from .models import UserMissionProgress
    
    try:
        progress = UserMissionProgress.objects.get(pk=pk, user=user)
    except UserMissionProgress.DoesNotExist:
        return Response({'error': 'Mission progress not found'}, status=404)

    if progress.claimed:
        return Response({'error': 'Already claimed'}, status=400)

    # Simplified logic: just mark it as claimed directly for testing or if it's completed
    progress.is_completed = True # Assuming they can claim it if they request it, or we check if it is completed
    progress.claimed = True
    progress.save()

    profile = user.profile
    profile.dp += progress.mission.reward_dp
    profile.xp += progress.mission.reward_xp
    profile.calculate_level()
    profile.save()

    return Response({
        'message': 'Reward claimed successfully',
        'dp': profile.dp,
        'xp': profile.xp,
        'level': profile.level
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def sandbox_generate(request):
    exercise_type = request.data.get('exercise_type')
    lang = request.data.get('lang', 'en')
    
    from scoring.ai_engine import AIEngine
    
    prompt = f"Generate a 30-60 second micro-scenario for a {exercise_type} debate exercise in {'Arabic' if lang == 'ar' else 'English'}. Provide only the scenario text."
    
    scenario = AIEngine.call_gemini_api(prompt, max_tokens=150)
    
    return Response({'scenario': scenario})


@api_view(['POST'])
@permission_classes([AllowAny])
def sandbox_evaluate(request):
    exercise_type = request.data.get('exercise_type')
    prompt_text = request.data.get('prompt_text')
    user_answer = request.data.get('user_answer')
    lang = request.data.get('lang', 'en')
    user = get_current_user(request)

    from scoring.ai_engine import AIEngine

    prompt = f"Evaluate this {exercise_type} exercise response in {'Arabic' if lang == 'ar' else 'English'}.\nScenario: {prompt_text}\nAnswer: {user_answer}\nGive a score from 0-100 and brief feedback."
    
    evaluation = AIEngine.call_gemini_api(prompt, max_tokens=250)
    
    # Simple extraction of score for demo purposes
    import re
    score_match = re.search(r'\b([0-9]{1,3})\b', evaluation)
    score = int(score_match.group(1)) if score_match else 50
    
    dp_awarded = 0
    xp_awarded = 0
    
    if score >= 60 and user is not None:
        profile = user.profile
        profile.dp += 25
        profile.xp += 20
        profile.calculate_level()
        profile.save()
        dp_awarded = 25
        xp_awarded = 20

    return Response({
        'score': score,
        'feedback': evaluation,
        'dp_awarded': dp_awarded,
        'xp_awarded': xp_awarded
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_timeline(request):
    user = get_current_user(request)
    if not user:
        return Response({
            "events": [],
            "total_events": 0,
            "latest_level": 1
        })
    
    from debates.models import DebateSession
    from achievements.models import UserAchievement
    
    debates = DebateSession.objects.filter(user=user).order_by('-created_at')
    achievements = UserAchievement.objects.filter(user=user).select_related('achievement')
    
    events = []
    for d in debates:
        if d.status == 'COMPLETED':
            events.append({
                'type': 'DEBATE',
                'date': d.completed_at if d.completed_at else d.created_at,
                'title': f"Debate: {d.topic}",
                'description': f"Winner: {d.winner or 'N/A'} | Score: {d.score_overall}/100 | Persona: {d.persona}",
                'topic': d.topic,
                'winner': d.winner,
                'score': d.score_overall,
                'persona': d.persona
            })
    
    for a in achievements:
        events.append({
            'type': 'ACHIEVEMENT',
            'date': a.unlocked_at,
            'title': f"Unlocked: {a.achievement.title}",
            'description': f"Earned +{a.achievement.xp_reward} XP",
            'xp_reward': a.achievement.xp_reward
        })
        
    count = len(events)
    events.sort(key=lambda x: x['date'], reverse=True)
    
    profile = getattr(user, 'profile', None)
    latest_level = profile.level if profile else 1
    
    return Response({
        "events": events,
        "total_events": count,
        "latest_level": latest_level
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_monthly_capsule(request):
    user = get_current_user(request)
    if not user:
        return Response({
            "stats": {
                "total_debates": 0,
                "wins": 0,
                "win_rate": 0,
                "avg_overall_score": 0,
                "avg_logic": 0,
                "avg_evidence": 0,
                "avg_rebuttal": 0
            },
            "ai_summary": "Sign in and complete debates to generate your monthly AI time capsule!",
            "top_strength": "Consistency",
            "focus_area": "Evidence"
        })
        
    from debates.models import DebateSession
    from django.utils import timezone
    from datetime import timedelta
    from scoring.ai_engine import AIEngine
    import json
    
    thirty_days_ago = timezone.now() - timedelta(days=30)
    debates = DebateSession.objects.filter(user=user, status='COMPLETED', completed_at__gte=thirty_days_ago)
    
    total_debates = debates.count()
    wins = debates.filter(winner='USER').count()
    win_rate = (wins / total_debates * 100) if total_debates > 0 else 0
    
    avg_overall = 0
    avg_logic = 0
    avg_evidence = 0
    avg_rebuttal = 0
    
    if total_debates > 0:
        avg_overall = sum(d.score_overall for d in debates) / total_debates
        avg_logic = sum(d.score_logic for d in debates) / total_debates
        avg_evidence = sum(d.score_evidence for d in debates) / total_debates
        avg_rebuttal = sum(d.score_rebuttal for d in debates) / total_debates
        
    lang = request.query_params.get('lang', 'en')
    
    prompt = f"""
    Generate a personalized "Monthly AI Time Capsule" summary evaluating user growth trends based on these stats for the last 30 days:
    Total Debates: {total_debates}
    Win Rate: {win_rate:.1f}%
    Avg Logic: {avg_logic:.1f}
    Avg Evidence: {avg_evidence:.1f}
    Avg Rebuttal: {avg_rebuttal:.1f}
    
    Output JSON with keys: "ai_summary", "top_strength", "focus_area".
    Respond in {'Arabic' if lang == 'ar' else 'English'}.
    """
    
    ai_response = AIEngine.call_gemini_api(prompt, max_tokens=300)
    
    try:
        if ai_response.startswith('```json'):
            ai_response = ai_response[7:-3]
        elif ai_response.startswith('```'):
            ai_response = ai_response[3:-3]
        ai_data = json.loads(ai_response)
    except Exception:
        ai_data = {
            "ai_summary": "Keep debating to generate your AI capsule!",
            "top_strength": "Consistency",
            "focus_area": "Evidence"
        }
        
    return Response({
        "stats": {
            "total_debates": total_debates,
            "wins": wins,
            "win_rate": round(win_rate, 1),
            "avg_overall_score": round(avg_overall, 1),
            "avg_logic": round(avg_logic, 1),
            "avg_evidence": round(avg_evidence, 1),
            "avg_rebuttal": round(avg_rebuttal, 1)
        },
        "ai_summary": ai_data.get("ai_summary", "Keep debating to generate your AI capsule!"),
        "top_strength": ai_data.get("top_strength", "Consistency"),
        "focus_area": ai_data.get("focus_area", "Evidence")
    })
