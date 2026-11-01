from django.db import models
from django.contrib.auth.models import User

class DebateDNA(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='dna')
    logic = models.IntegerField(default=50)
    evidence = models.IntegerField(default=50)
    persuasion = models.IntegerField(default=50)
    rebuttal = models.IntegerField(default=50)
    fallacy_avoidance = models.IntegerField(default=50)
    confidence = models.IntegerField(default=50)
    adaptability = models.IntegerField(default=50)
    creativity = models.IntegerField(default=50)
    listening = models.IntegerField(default=50)
    emotional_control = models.IntegerField(default=50)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Debate DNA for {self.user.username}"


class CoachReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='coach_reports')
    strongest_skills = models.JSONField(default=list)
    areas_for_growth = models.JSONField(default=list)
    recommended_exercises = models.JSONField(default=list)
    coach_advice = models.TextField()
    suggested_topics = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Coach Report for {self.user.username} ({self.created_at.strftime('%Y-%m-%d')})"


class DebateMission(models.Model):
    title = models.CharField(max_length=200)
    title_ar = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    description_ar = models.TextField(blank=True)
    category = models.CharField(max_length=50)
    target_value = models.IntegerField(default=1)
    reward_dp = models.IntegerField(default=50)
    reward_xp = models.IntegerField(default=30)

    def __str__(self):
        return self.title


class UserMissionProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mission = models.ForeignKey(DebateMission, on_delete=models.CASCADE)
    current_progress = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    claimed = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.mission.title}"
