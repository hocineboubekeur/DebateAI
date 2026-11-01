import requests

def test_api():
    base_url = "http://127.0.0.1:8080/api"
    session = requests.Session()
    
    # 1. Register/Login
    print("Logging in...")
    username = "test_judge_api"
    res = session.post(f"{base_url}/auth/register/", json={
        "username": username,
        "email": f"{username}@test.com",
        "password": "password123"
    })
    if res.status_code != 201:
        res = session.post(f"{base_url}/auth/login/", json={
            "username": username,
            "password": "password123"
        })
    token = res.json().get('token')
    session.headers.update({"Authorization": f"Token {token}"})

    # 2. Create debate
    print("Creating debate...")
    res = session.post(f"{base_url}/debates/", json={
        "topic": "AI",
        "persona": "SOCRATES",
        "style": "SOCRATIC",
        "user_side": "FOR",
        "lang": "en"
    })
    print(res.status_code, res.text)
    debate_id = res.json().get('id')

    # 3. Submit turn
    print("Submitting turn...")
    res = session.post(f"{base_url}/debates/{debate_id}/turn/", json={
        "text": "AI is good because it helps humans."
    })
    print(res.status_code, res.text)
    
    # 4. Finish debate
    print("Finishing debate...")
    res = session.post(f"{base_url}/debates/{debate_id}/finish/")
    print(res.status_code)
    print(res.text)

test_api()
