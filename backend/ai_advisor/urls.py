from django.urls import path
from .views import ChatAdvisorView

urlpatterns = [
    path('chat/', ChatAdvisorView.as_view(), name='ai-chat'),
]