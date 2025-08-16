# backend/prices/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.cache import cache
from .services.coingecko import get_simple_price, get_market_chart

class QuoteView(APIView):
    """
    GET /api/prices/quote?symbols=BTC,ETH&vs=usd,pln
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        symbols = request.query_params.get("symbols", "BTC")
        vs = request.query_params.get("vs", "usd")
        syms = [s.strip().upper() for s in symbols.split(",") if s.strip()]
        vs_list = [v.strip().lower() for v in vs.split(",") if v.strip()]

        cache_key = f"q:{','.join(sorted(syms))}:{','.join(sorted(vs_list))}"
        data = cache.get(cache_key)
        if data is None:
            try:
                data = get_simple_price(syms, vs_list)
            except Exception as e:
                return Response({"error": "price_fetch_failed", "detail": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
            cache.set(cache_key, data, 30)  # 30 sekund
        return Response({"symbols": syms, "vs": vs_list, "data": data})


class ChartView(APIView):
    """
    GET /api/prices/chart?symbol=BTC&vs=usd&days=30
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        symbol = (request.query_params.get("symbol") or "BTC").upper()
        vs = (request.query_params.get("vs") or "usd").lower()
        try:
            days = int(request.query_params.get("days", "30"))
        except ValueError:
            days = 30

        cache_key = f"ch:{symbol}:{vs}:{days}"
        data = cache.get(cache_key)
        if data is None:
            try:
                data = get_market_chart(symbol, vs, days)
            except Exception as e:
                return Response({"error": "chart_fetch_failed", "detail": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
            cache.set(cache_key, data, 300)  # 5 minut
        return Response({"symbol": symbol, "vs": vs, "days": days, "data": data})