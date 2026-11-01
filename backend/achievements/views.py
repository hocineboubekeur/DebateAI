from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Achievement, UserAchievement, Title
from accounts.models import UserProfile
from debates.views import get_current_user



@api_view(['GET'])
@permission_classes([AllowAny])
def achievements_list(request):
    user = get_current_user(request)
    lang = request.GET.get('lang', 'en')
    all_achievements = Achievement.objects.all()

    unlocked_ids = set(UserAchievement.objects.filter(user=user).values_list('achievement_id', flat=True)) if user else set()

    res = []
    for a in all_achievements:
        is_unlocked = a.id in unlocked_ids
        
        # Base text
        title = a.title_ar if (lang == 'ar' and a.title_ar) else a.title
        desc = a.description_ar if (lang == 'ar' and a.description_ar) else a.description
        
        # Secret masking
        if a.is_secret and not is_unlocked:
            title = "إنجاز سري" if lang == 'ar' else "Secret Achievement"
            desc = "استمر في المناظرة لاكتشاف هذا الإنجاز السري!" if lang == 'ar' else "Keep debating to discover this secret achievement!"

        res.append({
            'id': a.id,
            'code': a.code,
            'title': title,
            'description': desc,
            'category': a.category,
            'icon': a.icon,
            'is_secret': a.is_secret,
            'xp_reward': a.xp_reward,
            'dp_reward': a.dp_reward,
            'unlocked': is_unlocked
        })

    return Response(res)
