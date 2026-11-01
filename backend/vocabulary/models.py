from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from debates.models import DebateSession

class VocabularyEntry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    word = models.CharField(max_length=100)
    phonetic = models.CharField(max_length=100, blank=True)
    definition = models.TextField()
    context_sentence = models.TextField(blank=True)
    synonyms = models.JSONField(default=list)
    source_debate = models.ForeignKey(DebateSession, null=True, blank=True, on_delete=models.SET_NULL)
    mastery_level = models.IntegerField(default=1)
    next_review_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.word} - {self.user.username}"

class SpacedRepetitionLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    entry = models.ForeignKey(VocabularyEntry, on_delete=models.CASCADE)
    rating = models.IntegerField()
    reviewed_at = models.DateTimeField(auto_now_add=True)
