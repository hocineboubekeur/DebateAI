from django.urls import path
from . import views

urlpatterns = [
    path('', views.vocabulary_list_create),
    path('<int:pk>/', views.vocabulary_detail),
    path('ai-expand/', views.vocabulary_ai_expand),
]
