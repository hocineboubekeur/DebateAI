from rest_framework import serializers
from .models import DebateMission, UserMissionProgress

class DebateMissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DebateMission
        fields = '__all__'

class UserMissionProgressSerializer(serializers.ModelSerializer):
    mission = DebateMissionSerializer(read_only=True)

    class Meta:
        model = UserMissionProgress
        fields = '__all__'
