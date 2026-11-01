from django.db import models
from debates.models import DebateSession

class JudgeEvaluation(models.Model):
    debate = models.OneToOneField(DebateSession, on_delete=models.CASCADE, related_name='evaluation')
    winner_declaration = models.CharField(max_length=20)  # USER, AI, TIE
    judge_summary = models.TextField()
    user_score = models.IntegerField(default=0)
    ai_score = models.IntegerField(default=0)
    
    # Overall evaluation metrics
    margin_of_victory = models.FloatField(default=0.0)
    confidence_score = models.IntegerField(default=75)
    is_draw = models.BooleanField(default=False)

    # Detailed 7-category breakdown for both participants
    detailed_categories = models.JSONField(default=dict)
    logic_breakdown = models.JSONField(default=dict)
    evidence_breakdown = models.JSONField(default=dict)
    rebuttal_breakdown = models.JSONField(default=dict)
    fallacies_found = models.JSONField(default=list)
    
    key_turning_points = models.JSONField(default=list)
    top_recommendations = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluation for Debate #{self.debate.id} - Winner: {self.winner_declaration}"
