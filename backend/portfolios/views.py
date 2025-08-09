from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Portfolio
from .serializers import (
    PortfolioListSerializer,
    PortfolioCreateSerializer,
    PortfolioDetailSerializer,
)

class PortfolioViewSet( viewsets.ModelViewSet ):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Portfolio.objects.all()  # zawężamy w get_queryset
    lookup_field = "id"  # opcjonalnie, domyślnie 'pk'

    def get_queryset(self):
        # Tylko portfele zalogowanego użytkownika
        return Portfolio.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action in ("list",):
            return PortfolioListSerializer
        if self.action in ("create",):
            return PortfolioCreateSerializer
        # retrieve, update, partial_update, destroy → detail serializer
        return PortfolioDetailSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["get"])
    def positions(self, request, id=None):
        """
        Alternatywny endpoint: GET /portfolios/{id}/positions/
        Zwraca tylko listę 'positions' (jak w detail).
        """
        portfolio = self.get_object()
        serializer = PortfolioDetailSerializer(portfolio, context={"request": request})
        return Response(serializer.data.get("positions", []))