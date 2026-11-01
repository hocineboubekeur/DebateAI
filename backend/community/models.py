from django.db import models
from django.contrib.auth.models import User
from debates.models import DebateSession

class PublishedDebate(models.Model):
    debate = models.OneToOneField(DebateSession, on_delete=models.CASCADE, related_name='publication')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='published_debates')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    views = models.IntegerField(default=0)
    likes_count = models.IntegerField(default=0)
    published_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Published: {self.title}"


class DebateLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    publication = models.ForeignKey(PublishedDebate, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'publication')


class DebateComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    publication = models.ForeignKey(PublishedDebate, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on #{self.publication.id}"


class Club(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, default="")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_clubs')
    members = models.ManyToManyField(User, related_name='clubs')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Tournament(models.Model):
    STATUS_CHOICES = [
        ('UPCOMING', 'Upcoming'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    format = models.CharField(max_length=100, default='Knockout')
    prize_pool = models.CharField(max_length=100, blank=True, default="")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='UPCOMING')
    participants = models.ManyToManyField(User, related_name='tournaments_entered', blank=True)
    
    def __str__(self):
        return self.name


class Leaderboard(models.Model):
    season_name = models.CharField(max_length=100, unique=True)
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.season_name


class LeaderboardEntry(models.Model):
    leaderboard = models.ForeignKey(Leaderboard, on_delete=models.CASCADE, related_name='entries')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)
    
    class Meta:
        unique_together = ('leaderboard', 'user')
        ordering = ['-score']
        
    def __str__(self):
        return f"{self.user.username} - {self.score} points"
