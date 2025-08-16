# backend/prices/urls.py
from django.urls import path
from .views import QuoteView, ChartView

urlpatterns = [
    path("prices/quote", QuoteView.as_view(), name="prices-quote"),
    path("prices/chart", ChartView.as_view(), name="prices-chart"),
]