# backend/prices/services/yahoo_finance.py
"""Ceny akcji i ETF z Yahoo Finance (yfinance). Używane dla symboli, dla których CoinGecko nie zwraca danych."""
import time
from datetime import datetime, timedelta, timezone

try:
    import yfinance as yf
except ImportError:
    yf = None

# Cache: symbol -> (expires_at, price). TTL 90 s.
_stock_cache: dict[str, tuple[float, float]] = {}
_CACHE_TTL = 90

# Cache history: (symbol, key) -> (expires_at, price). key = "24h" | "7d" | "YYYY-MM-DD"
_history_cache: dict[tuple[str, str], tuple[float, float]] = {}
_HISTORY_CACHE_TTL = 120


def get_stock_price(symbol: str) -> float | None:
    """
    Pobiera bieżącą cenę akcji/ETF w USD z Yahoo Finance.
    Zwraca None jeśli brak yfinance, symbol nieznany lub błąd.
    """
    if not yf:
        return None
    sym = (symbol or "").strip().upper()
    if not sym:
        return None
    now = time.monotonic()
    if sym in _stock_cache:
        expires_at, price = _stock_cache[sym]
        if now < expires_at:
            return price
        del _stock_cache[sym]
    try:
        ticker = yf.Ticker(sym)
        info = ticker.info
        price = info.get("regularMarketPrice") or info.get("currentPrice") or info.get("previousClose")
        if price is not None:
            price = float(price)
            _stock_cache[sym] = (now + _CACHE_TTL, price)
            return price
        # Fallback: ostatnia cena z historii (info bywa pusty przy pierwszym żądaniu)
        hist = ticker.history(period="5d")
        if not hist.empty and "Close" in hist.columns:
            price = float(hist["Close"].iloc[-1])
            _stock_cache[sym] = (now + _CACHE_TTL, price)
            return price
    except Exception:
        pass
    return None


def get_prices_for_symbols(symbols: list[str]) -> dict[str, float]:
    """
    Dla listy symboli zwraca słownik {symbol: cena_w_usd}.
    Tylko symbole, dla których Yahoo zwrócił cenę.
    """
    if not yf or not symbols:
        return {}
    out = {}
    for s in symbols:
        key = s.upper().strip()
        if key in out:
            continue
        p = get_stock_price(s)
        if p is not None:
            out[key] = p
    return out


def _get_hist_close(symbol: str, period: str = "10d") -> list[tuple[datetime, float]]:
    """Pobiera historię Close; zwraca listę (datetime, close) posortowaną wg daty rosnąco."""
    if not yf:
        return []
    sym = (symbol or "").strip().upper()
    if not sym:
        return []
    try:
        ticker = yf.Ticker(sym)
        hist = ticker.history(period=period)
        if hist.empty or "Close" not in hist.columns:
            return []
        out = [(idx.to_pydatetime() if hasattr(idx, "to_pydatetime") else idx, float(hist.loc[idx, "Close"])) for idx in hist.index]
        out.sort(key=lambda x: x[0])
        return out
    except Exception:
        return []


def get_stock_price_24h_ago(symbol: str) -> float | None:
    """Cena sprzed ~24h (ostatnia sesja / previous close) dla akcji/ETF."""
    cache_key = (symbol.upper().strip(), "24h")
    now = time.monotonic()
    if cache_key in _history_cache:
        expires_at, price = _history_cache[cache_key]
        if now < expires_at:
            return price
        del _history_cache[cache_key]
    hist = _get_hist_close(symbol, period="5d")
    if len(hist) >= 2:
        price = hist[-2][1]  # previous close
        _history_cache[cache_key] = (now + _HISTORY_CACHE_TTL, price)
        return price
    return None


def get_stock_price_days_ago(symbol: str, days: int = 7) -> float | None:
    """Cena sprzed N dni (najstarszy punkt z dostępnej historii)."""
    cache_key = (symbol.upper().strip(), f"{days}d")
    now = time.monotonic()
    if cache_key in _history_cache:
        expires_at, price = _history_cache[cache_key]
        if now < expires_at:
            return price
        del _history_cache[cache_key]
    period = "1mo" if days > 10 else f"{days + 3}d"
    hist = _get_hist_close(symbol, period=period)
    if not hist:
        return None
    # Porównanie po timestampach, żeby uniknąć naive vs aware
    target_ts = (datetime.now(timezone.utc) - timedelta(days=days)).timestamp()
    def _ts(d):
        return d.timestamp() if hasattr(d, "timestamp") else d
    closest = min(hist, key=lambda x: abs(_ts(x[0]) - target_ts))
    price = closest[1]
    _history_cache[cache_key] = (now + _HISTORY_CACHE_TTL, price)
    return price


def get_stock_price_at_date(symbol: str, from_date) -> float | None:
    """Cena w dniu from_date (YYYY-MM-DD lub date)."""
    from datetime import date as date_type
    if isinstance(from_date, str):
        date_str = from_date[:10]
    elif hasattr(from_date, "strftime"):
        date_str = from_date.strftime("%Y-%m-%d")
    else:
        date_str = str(from_date)[:10]
    cache_key = (symbol.upper().strip(), date_str)
    now = time.monotonic()
    if cache_key in _history_cache:
        expires_at, price = _history_cache[cache_key]
        if now < expires_at:
            return price
        del _history_cache[cache_key]
    if not yf:
        return None
    try:
        start_d = date_str
        end_d = (datetime.strptime(date_str, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")
        ticker = yf.Ticker(symbol.upper().strip())
        hist = ticker.history(start=start_d, end=end_d)
        if not hist.empty and "Close" in hist.columns:
            price = float(hist["Close"].iloc[-1])
            _history_cache[cache_key] = (now + _HISTORY_CACHE_TTL, price)
            return price
        hist = ticker.history(period="1mo")
        if hist.empty or "Close" not in hist.columns:
            return None
        target_d = datetime.strptime(date_str, "%Y-%m-%d")
        hist_list = []
        for idx in hist.index:
            dt = idx.to_pydatetime() if hasattr(idx, "to_pydatetime") else idx
            if hasattr(dt, "timestamp"):
                ts = dt.timestamp()
            else:
                ts = dt
            hist_list.append((ts, float(hist.loc[idx, "Close"])))
        if not hist_list:
            return None
        target_ts = target_d.timestamp()
        closest = min(hist_list, key=lambda x: abs(x[0] - target_ts))
        price = closest[1]
        _history_cache[cache_key] = (now + _HISTORY_CACHE_TTL, price)
        return price
    except Exception:
        return None
