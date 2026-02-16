# backend/prices/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.cache import cache
from .services.coingecko import get_simple_price, get_market_chart
from .services.indicators import ema, rsi, crossover_signals

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


class IndicatorsView(APIView):
    """
    Wskaźniki techniczne: EMA, RSI, sygnały przecięcia EMA.
    GET /api/prices/indicators?symbol=BTC&vs=usd&days=30&ema_fast=12&ema_slow=26&rsi_period=14
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        symbol = (request.query_params.get("symbol") or "BTC").upper()
        vs = (request.query_params.get("vs") or "usd").lower()
        try:
            days = int(request.query_params.get("days", "30"))
            # Dla 1–2 dni API zwraca ~24 punkty (co godzinę) – używamy krótszych okresów
            default_fast, default_slow, default_rsi = (5, 10, 7) if days <= 2 else (12, 26, 14)
            ema_fast_n = int(request.query_params.get("ema_fast", str(default_fast)))
            ema_slow_n = int(request.query_params.get("ema_slow", str(default_slow)))
            rsi_period = int(request.query_params.get("rsi_period", str(default_rsi)))
        except (TypeError, ValueError):
            days = 30
            ema_fast_n, ema_slow_n, rsi_period = 12, 26, 14

        cache_key = f"ind:{symbol}:{vs}:{days}:{ema_fast_n}:{ema_slow_n}:{rsi_period}"
        data = cache.get(cache_key)
        if data is not None:
            return Response(data)

        try:
            raw = get_market_chart(symbol, vs, days)
        except Exception as e:
            return Response(
                {"error": "chart_fetch_failed", "detail": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        prices_raw = raw.get("prices") or []
        if len(prices_raw) < max(ema_slow_n, rsi_period) + 5:
            return Response(
                {"error": "not_enough_data", "detail": "Za mało punktów cenowych do obliczenia wskaźników."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        prices_raw.sort(key=lambda x: x[0])
        times = [p[0] for p in prices_raw]
        prices = [float(p[1]) for p in prices_raw]

        ema_fast = ema(prices, ema_fast_n)
        ema_slow = ema(prices, ema_slow_n)
        rsi_vals = rsi(prices, rsi_period)
        signals = crossover_signals(ema_fast, ema_slow)

        payload = {
            "symbol": symbol,
            "vs": vs,
            "days": days,
            "ema_fast_period": ema_fast_n,
            "ema_slow_period": ema_slow_n,
            "rsi_period": rsi_period,
            "times": times,
            "prices": prices,
            "ema_fast": ema_fast,
            "ema_slow": ema_slow,
            "rsi": rsi_vals,
            "signals": signals,
        }
        cache.set(cache_key, payload, 300)
        return Response(payload)


class SentimentView(APIView):
    """
    Analiza sentymentu na podstawie nagłówków z internetu (Google News RSS).
    GET /api/prices/sentiment?symbol=BTC
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        symbol = (request.query_params.get("symbol") or "BTC").upper()
        cache_key = f"sent:{symbol}"
        data = cache.get(cache_key)
        if data is not None:
            return Response(data)
        from .services.sentiment import get_sentiment_for_symbol
        data = get_sentiment_for_symbol(symbol)
        cache.set(cache_key, data, 900)  # 15 min
        return Response(data)