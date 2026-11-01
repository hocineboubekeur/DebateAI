from django.db import models
from django.contrib.auth.models import User

class Achievement(models.Model):
    code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100)
    title_ar = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField()
    description_ar = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, default='GENERAL')  # BEGINNER, WINNING, EVIDENCE, STREAKS, SECRET
    icon = models.CharField(max_length=50, default='Trophy')
    is_secret = models.BooleanField(default=False)
    xp_reward = models.IntegerField(default=50)
    dp_reward = models.IntegerField(default=100)

    def __str__(self):
        return f"{self.title} ({'Secret' if self.is_secret else 'Public'})"


class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'achievement')

    def __str__(self):
        return f"{self.user.username} unlocked {self.achievement.title}"


class Title(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=255)
    unlock_level = models.IntegerField(default=1)
    unlock_dp = models.IntegerField(default=0)

    def __str__(self):
        return self.name
