from django.urls import path
from .views import GoogleLoginView, RegisterView, LoginView, MeView, SurveyView, LogoutView, SetPasswordView, ChangePasswordView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('auth/survey/', SurveyView.as_view(), name='survey'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/set-password/', SetPasswordView.as_view(), name='set-password'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
]