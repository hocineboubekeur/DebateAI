from django.contrib import admin
from django.urls import path, include
from accounts import views as accounts_views
from debates import views as debates_views
from achievements import views as achievements_views
from library import views as library_views
from community import views as community_views
from coaching import views as coaching_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth & Profile
    path('api/auth/register/', accounts_views.register_view),
    path('api/auth/login/', accounts_views.login_view),
    path('api/auth/me/', accounts_views.me_view),

    # Debates Engine & Vault
    path('api/debates/', debates_views.debates_list_create),
    path('api/debates/<int:pk>/', debates_views.debate_detail),
    path('api/debates/<int:pk>/turn/', debates_views.submit_turn),
    path('api/debates/<int:pk>/finish/', debates_views.finish_debate),
    path('api/debates/', include('debates.urls')),
    path('api/vocabulary/', include('vocabulary.urls')),

    # Achievements & Progression
    path('api/achievements/', achievements_views.achievements_list),

    # Library & Quizzes
    path('api/library/', include('library.urls')),

    # Community Feed & Comments
    path('api/community/', community_views.community_feed_publish),
    path('api/community/<int:pk>/like/', community_views.toggle_like),
    path('api/community/<int:pk>/comments/', community_views.comments_view),

    # Debate DNA, AI Coach, Clubs & Tournaments
    path('api/coaching/', include('coaching.urls')),

    # REAL Admin API Endpoints Connected to Database
    path('api/admin/telemetry/', accounts_views.admin_telemetry_view),
    path('api/admin/users/', accounts_views.admin_users_view),
    path('api/admin/users/<int:pk>/action/', accounts_views.admin_user_action_view),
    path('api/admin/audit/', accounts_views.admin_audit_view),
]
