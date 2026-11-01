from django.urls import path
from . import views

urlpatterns = [
    path('dna/', views.debate_dna_view, name='debate_dna'),
    path('report/', views.coach_report_view, name='coach_report'),
    path('clubs/', views.clubs_tournaments_view, name='clubs_tournaments'),
    path('tournaments/', views.clubs_tournaments_view, name='tournaments'),
    path('missions/', views.get_user_missions, name='get_user_missions'),
    path('missions/<int:pk>/claim/', views.claim_mission_reward, name='claim_mission_reward'),
    path('sandbox/generate/', views.sandbox_generate, name='sandbox_generate'),
    path('sandbox/evaluate/', views.sandbox_evaluate, name='sandbox_evaluate'),
    path('timeline/', views.get_user_timeline, name='timeline'),
    path('capsule/', views.get_monthly_capsule, name='capsule'),
]
