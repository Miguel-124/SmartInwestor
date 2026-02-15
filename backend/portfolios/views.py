from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Portfolio
from .serializers import (
    PortfolioListSerializer,
    PortfolioCreateSerializer,
    PortfolioDetailSerializer,
)

class PortfolioViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Portfolio.objects.all()
    lookup_field = "id"

    def get_queryset(self):
        return Portfolio.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action in ("list",):
            return PortfolioListSerializer
        if self.action in ("create",):
            return PortfolioCreateSerializer
        return PortfolioDetailSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def destroy(self, request, *args, **kwargs):
        portfolio = self.get_object()
        if portfolio.is_main:
            return Response(
                {"detail": "Portfela Main nie można usunąć – zawiera wszystkie transakcje."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["get"])
    def positions(self, request, id=None):
        """
        GET /portfolios/{id}/positions/ – tylko lista pozycji (podsumowanie assetów).
        """
        portfolio = self.get_object()
        serializer = PortfolioDetailSerializer(portfolio, context={"request": request})
        return Response(serializer.data.get("positions", []))

    @action(detail=True, methods=["get"])
    def transactions(self, request, id=None):
        """
        GET /portfolios/{id}/transactions/ – transakcje w tym portfelu.
        """
        from transactions.serializers import TransactionSerializer
        portfolio = self.get_object()
        qs = portfolio.transactions.filter(owner=request.user).order_by("-executed_at", "-id")
        serializer = TransactionSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)