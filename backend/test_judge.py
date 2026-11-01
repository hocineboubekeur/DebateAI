import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from debates.models import DebateSession, DebateTurn
from django.contrib.auth.models import User
from scoring.ai_engine import AIEngine

user, _ = User.objects.get_or_create(username='judge_test')
debate = DebateSession.objects.create(user=user, topic='AI is good', persona='SOCRATES', style='SOCRATIC', user_side='FOR')
user_turn = DebateTurn.objects.create(debate=debate, round_number=1, speaker='USER', text='It is good')
ai_turn = DebateTurn.objects.create(debate=debate, round_number=1, speaker='AI', text='Why?')

print("Calling AI Judge...")
res = AIEngine.evaluate_debate(debate, [user_turn, ai_turn])
print("Result:", res)
