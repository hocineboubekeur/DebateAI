from django.db import models
from django.contrib.auth.models import User

PERSONA_CHOICES = [
    ('LAWYER', 'The Lawyer'),
    ('SCIENTIST', 'The Scientist'),
    ('PHILOSOPHER', 'The Philosopher'),
    ('POLITICIAN', 'The Politician'),
    ('HISTORIAN', 'The Historian'),
    ('DEVILS_ADVOCATE', 'Devil\'s Advocate'),
    ('TROLL', 'Internet Troll'),
    ('RAGEBAITER', 'The Ragebaiter'),
    ('JUDGE', 'The Strict Judge'),
    ('SOCRATES', 'Socrates'),
    ('ARISTOTLE', 'Aristotle'),
    ('PLATO', 'Plato'),
    ('TURING', 'Alan Turing'),
    ('SAGAN', 'Carl Sagan'),
    ('EINSTEIN', 'Albert Einstein'),
    ('LINCOLN', 'Abraham Lincoln'),
    ('SUN_TZU', 'Sun Tzu'),
]

STYLE_CHOICES = [
    ('CASUAL', 'Casual Debate'),
    ('FORMAL', 'Formal Oxford'),
    ('SOCRATIC', 'Socratic Questioning'),
    ('RAPID_FIRE', 'Rapid Fire'),
    ('COURTROOM', 'Courtroom Cross-Exam'),
]

DIFFICULTY_CHOICES = [
    ('CASUAL', 'Casual (Friendly)'),
    ('BALANCED', 'Balanced (Competitive)'),
    ('MASTER', 'Master (Strict Logic)'),
    ('GRANDMASTER', 'Grandmaster (Uncompromising)'),
]

SIDE_CHOICES = [
    ('FOR', 'For / Proponent'),
    ('AGAINST', 'Against / Opponent'),
    ('SECRET', 'Secret / Hidden'),
    ('NEUTRAL', 'Neutral / Undecided'),
]

class DebateSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='debates')
    topic = models.CharField(max_length=255)
    user_side = models.CharField(max_length=10, choices=SIDE_CHOICES, default='FOR')
    persona = models.CharField(max_length=30, choices=PERSONA_CHOICES, default='PHILOSOPHER')
    style = models.CharField(max_length=30, choices=STYLE_CHOICES, default='CASUAL')
    difficulty = models.CharField(max_length=30, choices=DIFFICULTY_CHOICES, default='BALANCED')
    
    status = models.CharField(max_length=20, default='IN_PROGRESS')  # IN_PROGRESS, COMPLETED, ABANDONED
    winner = models.CharField(max_length=10, blank=True, null=True)  # USER, AI, TIE
    is_mystery = models.BooleanField(default=False)
    roleplay_context = models.JSONField(default=dict)
    
    # Overall scores (0-100)
    score_logic = models.IntegerField(default=0)
    score_evidence = models.IntegerField(default=0)
    score_rebuttal = models.IntegerField(default=0)
    score_consistency = models.IntegerField(default=0)
    score_clarity = models.IntegerField(default=0)
    score_questions = models.IntegerField(default=0)
    score_persuasion = models.IntegerField(default=0)
    score_overall = models.IntegerField(default=0)

    # Evaluation metadata
    confidence = models.IntegerField(default=75)
    margin_of_victory = models.FloatField(default=0.0)
    
    reflection_text = models.TextField(blank=True)
    ai_reflection_feedback = models.TextField(blank=True)
    knowledge_gaps = models.JSONField(default=list)
    opposite_perspective_text = models.TextField(blank=True)
    perspective_score = models.IntegerField(default=0)
    custom_title = models.CharField(max_length=200, blank=True)
    tags = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return f"Debate #{self.id}: {self.topic} ({self.persona})"


class DebateTurn(models.Model):
    debate = models.ForeignKey(DebateSession, on_delete=models.CASCADE, related_name='turns')
    round_number = models.IntegerField(default=1)
    speaker = models.CharField(max_length=10)  # USER or AI
    text = models.TextField()
    audio_url = models.CharField(max_length=500, blank=True, null=True)
    
    # Analysis metrics for this turn
    fallacies_detected = models.JSONField(default=list, blank=True)
    logic_score = models.IntegerField(default=70)
    persuasion_score = models.IntegerField(default=70)
    feedback_notes = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['round_number', 'id']

    def __str__(self):
        return f"Turn {self.round_number} ({self.speaker}) - Debate #{self.debate.id}"
