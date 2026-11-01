from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    dp = models.IntegerField(default=0, help_text="Debate Points for career progression")
    xp = models.IntegerField(default=0, help_text="XP for leveling")
    level = models.IntegerField(default=1)
    current_title = models.CharField(max_length=100, default="The Skeptic")
    avatar_url = models.CharField(max_length=255, blank=True, default="https://api.dicebear.com/7.x/bottts/svg?seed=Debater")
    streak_days = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    interests = models.JSONField(default=list)
    primary_goals = models.JSONField(default=list)
    onboarding_completed = models.BooleanField(default=False)

    def calculate_level(self):
        # 100 XP per level
        new_level = (self.xp // 100) + 1
        if new_level != self.level:
            self.level = new_level
            self.save(update_fields=['level'])
        return self.level

    def __str__(self):
        return f"{self.user.username} (Lvl {self.level} - {self.dp} DP)"
