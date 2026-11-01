from django.urls import path
from . import views

urlpatterns = [
    path('', views.debates_list_create),
    path('<int:pk>/', views.debate_detail),
    path('<int:pk>/turn/', views.submit_turn),
    path('<int:pk>/finish/', views.finish_debate),
    path('<int:pk>/reflect/', views.reflect_on_debate),
    path('<int:pk>/perspective/', views.perspective_challenge),
    path('<int:pk>/manage/', views.manage_debate),
    path('<int:pk>/export/', views.export_debate),
    path('search/', views.search_debates),
]
