from rest_framework import serializers
from .models import DebateSession, DebateTurn
from scoring.models import JudgeEvaluation

class DebateTurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = DebateTurn
        fields = ['id', 'round_number', 'speaker', 'text', 'audio_url', 'fallacies_detected', 'logic_score', 'persuasion_score', 'created_at']


class JudgeEvaluationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JudgeEvaluation
        fields = [
            'id', 'winner_declaration', 'is_draw', 'confidence_score', 'margin_of_victory',
            'judge_summary', 'user_score', 'ai_score', 'detailed_categories', 'logic_breakdown',
            'evidence_breakdown', 'rebuttal_breakdown', 'fallacies_found', 'key_turning_points',
            'top_recommendations'
        ]


class DebateSessionSerializer(serializers.ModelSerializer):
    turns = DebateTurnSerializer(many=True, read_only=True)
    evaluation = JudgeEvaluationSerializer(read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = DebateSession
        fields = [
            'id', 'user_username', 'topic', 'user_side', 'persona', 'style', 'difficulty',
            'status', 'winner', 'confidence', 'margin_of_victory', 'score_logic',
            'score_evidence', 'score_rebuttal', 'score_consistency', 'score_clarity',
            'score_questions', 'score_persuasion', 'score_overall', 'created_at',
            'completed_at', 'is_public', 'turns', 'evaluation',
            'is_mystery', 'roleplay_context',
            'reflection_text', 'ai_reflection_feedback', 'knowledge_gaps', 
            'opposite_perspective_text', 'perspective_score', 'custom_title', 'tags'
        ]
