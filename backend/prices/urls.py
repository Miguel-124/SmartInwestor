# backend/prices/urls.py
from django.urls import path
from .views import QuoteView, ChartView, IndicatorsView, SentimentView

urlpatterns = [
    path("prices/quote", QuoteView.as_view(), name="prices-quote"),
    path("prices/chart", ChartView.as_view(), name="prices-chart"),
    path("prices/indicators", IndicatorsView.as_view(), name="prices-indicators"),
    path("prices/sentiment", SentimentView.as_view(), name="prices-sentiment"),
]