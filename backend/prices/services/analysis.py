"""
Analiza szeregów cenowych z użyciem pandas i numpy.
Opcjonalna – jeśli biblioteki niedostępne, funkcje zwracają None / pusty dict;
istniejące wskaźniki (EMA, RSI w indicators.py) pozostają bez zmian.
"""
from typing import Any, List, Optional

try:
    import numpy as np
    import pandas as pd
    _HAS_PANDAS_NUMPY = True
except ImportError:
    np = None  # type: ignore
    pd = None  # type: ignore
    _HAS_PANDAS_NUMPY = False


def compute_series_stats(
    times: List[float],
    prices: List[float],
    *,
    window_volatility: int = 7,
) -> Optional[dict[str, Any]]:
    """
    Oblicza statystyki szeregu cenowego (zmienność, zwroty) przy użyciu pandas/numpy.
    times: lista timestampów (np. z get_market_chart), prices: lista cen.
    Zwraca dict z kluczami m.in. volatility_annualized, return_1d, return_7d, return_total,
    rolling_volatility, lub None jeśli brak pandas/numpy albo za mało danych.
    """
    if not _HAS_PANDAS_NUMPY or not prices or len(prices) < 2:
        return None
    try:
        series = pd.Series(prices, index=pd.to_datetime(times, unit="ms", utc=True))
        series = series.sort_index()
        # Zwroty logarytmiczne (łatwe do volatility)
        log_returns = np.log(series / series.shift(1)).dropna()
        if len(log_returns) < 2:
            return None

        # Zwroty w okresach
        p0 = float(series.iloc[0])
        p_end = float(series.iloc[-1])
        return_total = (p_end - p0) / p0 if p0 else None
        return_1d = None
        return_7d = None
        if len(series) >= 2:
            # ostatni dzień: przybliżenie (ostatnie 2 punkty lub ostatnie ~24h)
            idx_1d = series.index[-1] - pd.Timedelta(days=1)
            past_1d = series[series.index <= idx_1d]
            if len(past_1d) > 0:
                p_1d = float(past_1d.iloc[-1])
                return_1d = (p_end - p_1d) / p_1d if p_1d else None
        if len(series) >= 8:
            idx_7d = series.index[-1] - pd.Timedelta(days=7)
            past_7d = series[series.index <= idx_7d]
            if len(past_7d) > 0:
                p_7d = float(past_7d.iloc[-1])
                return_7d = (p_end - p_7d) / p_7d if p_7d else None

        # Zmienność (roczna, z log returns)
        vol_daily = float(log_returns.std()) if len(log_returns) > 0 else None
        vol_annualized = (vol_daily * (365 ** 0.5)) if vol_daily is not None else None

        # Rolling volatility (ostatnie N punktów)
        rolling_vol = None
        if len(log_returns) >= window_volatility:
            w = min(window_volatility, len(log_returns))
            rolling_vol = float(log_returns.tail(w).std() * (365 ** 0.5))

        return {
            "return_total": round(return_total, 6) if return_total is not None else None,
            "return_1d": round(return_1d, 6) if return_1d is not None else None,
            "return_7d": round(return_7d, 6) if return_7d is not None else None,
            "volatility_annualized": round(vol_annualized, 6) if vol_annualized is not None else None,
            "volatility_daily": round(vol_daily, 8) if vol_daily is not None else None,
            "rolling_volatility_annualized": round(rolling_vol, 6) if rolling_vol is not None else None,
            "points": len(series),
        }
    except Exception:
        return None


def ema_series(prices: List[float], period: int):
    """
    EMA z pandas (opcjonalna alternatywa; wynik w formacie listy jak w indicators.ema).
    Zwraca listę [None, ..., float, ...] lub None jeśli brak pandas.
    """
    if not _HAS_PANDAS_NUMPY or not prices or period < 1:
        return None
    try:
        s = pd.Series(prices)
        ema_vals = s.ewm(span=period, adjust=False).mean()
        out: List[Optional[float]] = [None] * (period - 1)
        for i in range(period - 1, len(ema_vals)):
            out.append(round(float(ema_vals.iloc[i]), 8))
        return out
    except Exception:
        return None
