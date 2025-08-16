# backend/prices/services/coingecko.py
import requests
from functools import lru_cache

BASE = "https://api.coingecko.com/api/v3"

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

@lru_cache(maxsize=1024)
def resolve_coin_id(symbol: str) -> str | None:
    sym = symbol.strip().upper()
    if sym in DEFAULT_MAP:
        return DEFAULT_MAP[sym]
    try:
        r = requests.get(f"{BASE}/search", params={"query": sym}, timeout=10)
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
    r = requests.get(
        f"{BASE}/simple/price",
        params={"ids": ",".join(ids), "vs_currencies": ",".join(vs)},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()

def get_market_chart(symbol: str, vs: str, days: int = 30) -> dict:
    cid = resolve_coin_id(symbol)
    if not cid:
        return {}
    r = requests.get(
        f"{BASE}/coins/{cid}/market_chart",
        params={"vs_currency": vs, "days": days},
        timeout=15,
    )
    r.raise_for_status()
    return r.json()