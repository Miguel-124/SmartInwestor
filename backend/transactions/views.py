from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer

    def get_queryset(self):
        """
        Zwracamy transakcje tylko zalogowanego usera.
        Można filtrować po:
          - ?portfolio=<id>  (transakcje w danym portfelu)
          - ?symbol=BTC
          - ?side=BUY/SELL
        """
        qs = Transaction.objects.filter(owner=self.request.user)

        portfolio_id = self.request.query_params.get("portfolio")
        if portfolio_id:
            qs = qs.filter(portfolios__id=portfolio_id)

        symbol = self.request.query_params.get("symbol")
        if symbol:
            qs = qs.filter(symbol__iexact=symbol.strip())

        side = self.request.query_params.get("side")
        if side in (Transaction.BUY, Transaction.SELL):
            qs = qs.filter(side=side)

        return qs

    @action(detail=False, methods=["get"])
    def symbols(self, request):
        """
        GET /transactions/symbols/ → lista unikalnych symboli użytkownika (do dropdownów itd.)
        """
        symbols = (self.get_queryset()
                   .values_list("symbol", flat=True)
                   .distinct()
                   .order_by("symbol"))
        return Response(list(symbols))