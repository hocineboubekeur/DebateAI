# DebateAI 🎙️🤖

An intelligent, interactive rhetoric and debate training platform powered by **Google Gemini** and built with **Django REST Framework** and **React 19 + Vite**.

DebateAI helps debaters, students, and professionals sharpen their argumentation, spot logical fallacies, and master rhetoric against adaptive AI debate personas with real-time judge feedback.

---

## 🌟 Key Features

- **Adaptive AI Debaters**: Debate against diverse AI personas (Devil's Advocate, Socratic Scholar, Troll, Formal Academic, and more) across multiple difficulty levels.
- **Automated AI Judge & Scoring**: Real-time evaluation of debate rounds across Logic, Evidence, Rhetoric, and Fallacy Spotting with actionable critique.
- **Rhetoric & Logical Fallacies Library**: Comprehensive interactive library of classical rhetoric devices and informal logical fallacies with quizzes and counter-argument guides.
- **Bilingual Experience (English & Arabic)**: Full support for both English and Arabic with native RTL/LTR switching, localized content, and Arabic debate models.
- **Debate DNA & Coaching**: Track your personal argumentation tendencies, strengths, weaknesses, and improvement trajectory over time.
- **Gamification & Achievements**: Unlock achievements, earn debate badges, and track your streaks.
- **Community Arena & Leaderboards**: Share debate replays, read community contributions, and compete on the leaderboard.

---

## 🏗️ Architecture

```
├── backend/
│   ├── config/              # Django settings, URLs, ASGI/WSGI
│   ├── accounts/            # User profile and auth management
│   ├── achievements/        # Gamification, badges, and milestones
│   ├── coaching/            # Debate DNA, coach reports, missions
│   ├── community/           # Community feed, comments, leaderboard
│   ├── debates/             # Debate sessions, turns, and personas
│   ├── library/             # Fallacy articles, debate topics, quizzes
│   ├── scoring/             # Gemini AI debate engine & judge evaluation
│   ├── vocabulary/          # Rhetoric terms and vocabulary vault
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (DebateArena, Dashboard, etc.)
│   │   ├── contexts/        # Auth & Language (EN/AR) contexts
│   │   ├── services/        # API service layer (Axios)
│   │   └── utils/           # Translations and helpers
│   ├── package.json         # Node.js dependencies
│   └── vite.config.js       # Vite configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.11+
- **Node.js**: 18+ (Node 20+ recommended) & npm
- **Google Gemini API Key**: [Get one on Google AI Studio](https://aistudio.google.com/)

---

### 1. Backend Setup (Django)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # On macOS/Linux:
   python -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file in the `backend/` directory (you can copy `.env.example`):
   ```ini
   SECRET_KEY=your-django-secret-key
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. **Apply database migrations**:
   ```bash
   python manage.py migrate
   ```

6. **Seed initial rhetoric data & achievements** *(optional but recommended)*:
   ```bash
   python manage.py seed_db
   ```

7. **Run the backend development server**:
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/`.

---

### 2. Frontend Setup (React + Vite)

1. **Navigate to the frontend directory** (in a new terminal):
   ```bash
   cd frontend
   ```

2. **Install npm dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173/`.

---

## 🧪 Testing

### Backend Unit & Integration Tests

From the `backend/` directory:
```bash
python test_suite.py
```

---

## 🔒 Security & Best Practices

- Never commit your `.env` file or raw `GEMINI_API_KEY` to source control.
- In production, set `DEBUG=False` and define explicit hosts in `ALLOWED_HOSTS`.
- Ensure CORS configurations in `config/settings.py` only whitelist trusted production origins.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) (or your preferred license).
