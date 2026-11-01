from rest_framework import serializers
from .models import VocabularyEntry, SpacedRepetitionLog

class VocabularyEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = VocabularyEntry
        fields = '__all__'

class SpacedRepetitionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpacedRepetitionLog
        fields = '__all__'
