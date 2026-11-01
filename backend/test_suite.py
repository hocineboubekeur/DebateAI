import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
import json

def run_tests():
    c = Client()
    user, _ = User.objects.get_or_create(username='testrunner', email='testrunner@test.com')
    c.force_login(user)

    print("--- 1. Testing GET /api/auth/me/ ---")
    res = c.get('/api/auth/me/')
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    print("Me response:", res.json())

    print("\n--- 2. Testing POST /api/debates/ (Start Debate) ---")
    res = c.post('/api/debates/', data=json.dumps({
        'topic': 'Should AI be granted legal rights?',
        'user_side': 'FOR',
        'persona': 'PHILOSOPHER',
        'style': 'SOCRATIC',
        'difficulty': 'BALANCED'
    }), content_type='application/json')
    assert res.status_code == 201, f"Expected 201, got {res.status_code}"
    debate = res.json()
    debate_id = debate['id']
    print(f"Created Debate #{debate_id}, opening turns:", len(debate['turns']))

    print(f"\n--- 3. Testing POST /api/debates/{debate_id}/turn/ ---")
    res = c.post(f'/api/debates/{debate_id}/turn/', data=json.dumps({
        'text': 'We must consider ethical duty: if an entity possesses self-awareness and suffering capacity, denying rights is a moral fallacy.'
    }), content_type='application/json')
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    turn_data = res.json()
    print("User Turn logic score:", turn_data['user_turn']['logic_score'])
    print("AI Counter-argument snippet:", turn_data['ai_turn']['text'][:100] + "...")

    print(f"\n--- 4. Testing POST /api/debates/{debate_id}/finish/ ---")
    res = c.post(f'/api/debates/{debate_id}/finish/')
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    finish_data = res.json()
    print("Winner declared:", finish_data['debate']['winner'])
    print("DP Earned:", finish_data['dp_earned'])

    print("\n--- 5. Testing GET /api/coaching/dna/ ---")
    res = c.get('/api/coaching/dna/')
    assert res.status_code == 200
    print("Debate DNA metrics count:", len(res.json()['metrics']))

    print("\n--- 6. Testing GET /api/library/fallacies/ ---")
    res = c.get('/api/library/fallacies/')
    assert res.status_code == 200
    print("Fallacies loaded:", len(res.json()))

    print("\n--- 7. Testing GET /api/achievements/ ---")
    res = c.get('/api/achievements/')
    assert res.status_code == 200
    print("Achievements count:", len(res.json()))

    print("\n[OK] ALL BACKEND REST API ENDPOINTS & GEMINI INTEGRATION TESTS PASSED!")

if __name__ == '__main__':
    run_tests()
