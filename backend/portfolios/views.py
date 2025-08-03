# portfolio/views.py
from rest_framework import viewsets, permissions
from .models import Portfolio, Position
from .serializers import PortfolioSerializer, PositionSerializer

class PortfolioViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PortfolioSerializer

    def get_queryset(self):
        # zwracamy tylko portfele zalogowanego użytkownika
        return Portfolio.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # automatycznie przypisujemy właściciela
        serializer.save(owner=self.request.user)

class PositionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PositionSerializer

    def get_queryset(self):
        # można ewentualnie filtrować po portfolio, np. ?portfolio=<id>
        return Position.objects.filter(portfolio__owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save()