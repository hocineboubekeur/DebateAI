from django.urls import path
from .views import book_club_list, fallacies_list, quizzes_list_submit

urlpatterns = [
    path('book-club/', book_club_list, name='book-club-list'),
    path('fallacies/', fallacies_list, name='fallacies-list'),
    path('quizzes/', quizzes_list_submit, name='quizzes-list'),
]
