from django.urls import path
from .views import GoogleLoginView, RegisterView, LoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/google/', GoogleLoginView.as_view(), name='google-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    #TODO: Dodac do wylogowania api itp
]