import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from debates.models import DebateSession
from scoring.ai_engine import AIEngine

try:
    user, _ = User.objects.get_or_create(username='testuser')
    debate = DebateSession.objects.create(
        user=user, 
        topic='Test', 
        user_side='FOR', 
        persona='TROLL', 
        style='CASUAL', 
        difficulty='BALANCED'
    )
    res = AIEngine.generate_debater_turn(debate, 'Hello', lang='en')
    print('SUCCESS:', res['text'][:50])
except Exception as e:
    import traceback
    traceback.print_exc()
