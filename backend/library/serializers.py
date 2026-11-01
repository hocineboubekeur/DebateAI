from rest_framework import serializers
from .models import BookDebateTopic

class BookDebateTopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookDebateTopic
        fields = '__all__'
