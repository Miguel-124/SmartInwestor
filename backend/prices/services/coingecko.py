# backend/prices/services/coingecko.py
import time
import requests
from functools import lru_cache

BASE = "https://api.coingecko.com/api/v3"

# Tylko krypto – znane tickery akcji/ETF nie pytamy CoinGecko (dostajemy 429 lub błędne id jak tsla6900)
DEFAULT_MAP = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "ADA": "cardano",
    "XRP": "ripple",
    "BNB": "binancecoin",
    "DOGE": "dogecoin",
    "DOT": "polkadot",
    "AVAX": "avalanche-2",
}
# Symbole akcji/ETF – nigdy nie wysyłamy do CoinGecko
STOCK_TICKERS = frozenset({
    "TSLA", "AAPL", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "JPM", "V", "JNJ",
    "WMT", "PG", "MA", "HD", "DIS", "PYPL", "BAC", "ADBE", "XOM", "NFLX", "CRM",
    "CSCO", "PEP", "KO", "INTC", "CMCSA", "ABT", "TMO", "AVGO", "COST", "NKE",
})

# Cache cen: klucz (tuple(sorted ids)), wartość (expires_at, data). TTL 90 s – mniej 429.
_price_cache: dict[tuple, tuple[float, dict]] = {}
_PRICE_CACHE_TTL = 90


@lru_cache(maxsize=512)
def resolve_coin_id(symbol: str) -> str | None:
    sym = symbol.strip().upper()
    if sym in STOCK_TICKERS:
        return None
    if sym in DEFAULT_MAP:
        return DEFAULT_MAP[sym]
    try:
        r = requests.get(f"{BASE}/search", params={"query": sym}, timeout=10)
        if r.status_code == 429:
            return None
        r.raise_for_status()
        data = r.json()
        for c in data.get("coins", []):
            if c.get("symbol", "").upper() == sym:
                return c.get("id")
    except Exception:
        pass
    return None


def get_simple_price(symbols: list[str], vs: list[str]) -> dict:
    ids = []
    for s in symbols:
        cid = resolve_coin_id(s)
        if cid:
            ids.append(cid)
    if not ids:
        return {}
    cache_key = (tuple(sorted(ids)), tuple(sorted(vs)))
    now = time.monotonic()
    if cache_key in _price_cache:
        expires_at, data = _price_cache[cache_key]
        if now < expires_at:
            return data
        del _price_cache[cache_key]
    try:
        r = requests.get(
            f"{BASE}/simple/price",
            params={"ids": ",".join(ids), "vs_currencies": ",".join(vs)},
            timeout=10,
        )
        if r.status_code == 429:
            return {}
        r.raise_for_status()
        data = r.json()
        _price_cache[cache_key] = (now + _PRICE_CACHE_TTL, data)
        return data
    except requests.RequestException:
        return {}


def get_prices_by_symbol(symbols: list[str], vs: str = "usd") -> dict[str, float]:
    """
    Zwraca słownik {symbol: cena_bieżąca} dla symboli obsługiwanych przez CoinGecko (krypto).
    Dla symboli nierozpoznanych brak wpisu.
    """
    if not symbols:
        return {}
    data = get_simple_price(list(set(s.upper().strip() for s in symbols)), [vs.lower()])
    out = {}
    for sym in symbols:
        sym = sym.upper().strip()
        cid = resolve_coin_id(sym)
        if cid and cid in data and vs.lower() in data[cid]:
            out[sym] = float(data[cid][vs.lower()])
    return out


def get_market_chart(symbol: str, vs: str, days: int = 30) -> dict:
    cid = resolve_coin_id(symbol)
    if not cid:
        return {}
    try:
        r = requests.get(
            f"{BASE}/coins/{cid}/market_chart",
            params={"vs_currency": vs, "days": days},
            timeout=15,
        )
        if r.status_code == 429:
            return {}
        r.raise_for_status()
        return r.json()
    except requests.RequestException:
        return {}


def get_price_days_ago(symbol: str, vs: str = "usd", days: int = 7) -> float | None:
    """Cena sprzed N dni (najstarszy punkt z wykresu). Dla days=7 zwraca cenę sprzed 7 dni."""
    try:
        data = get_market_chart(symbol, vs, days=max(days, 2))
        prices = data.get("prices") or []
        if not prices:
            return None
        prices_sorted = sorted(prices, key=lambda x: x[0])
        return float(prices_sorted[0][1])
    except Exception:
        return None


def get_price_at_date(symbol: str, vs: str, from_date) -> float | None:
    """Cena w dniu from_date (date). Pobiera wykres i wybiera punkt najbliższy północy UTC tego dnia."""
    from datetime import date, datetime
    if isinstance(from_date, str):
        from_date = datetime.strptime(from_date[:10], "%Y-%m-%d").date()
    days_span = (date.today() - from_date).days + 2
    if days_span < 2:
        return get_prices_by_symbol([symbol], vs).get(symbol.upper())
    try:
        data = get_market_chart(symbol, vs, days=min(days_span, 365))
        prices = data.get("prices") or []
        if not prices:
            return None
        ts_target = datetime.combine(from_date, datetime.min.time()).replace(tzinfo=None).timestamp() * 1000
        closest = min(prices, key=lambda x: abs(x[0] - ts_target))
        return float(closest[1])
    except Exception:
        return None