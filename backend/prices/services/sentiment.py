"""
Analiza sentymentu na podstawie nagłówków z internetu (Google News RSS).
Używa VADER do oceny pozytywne/negatywne/neutralne.
"""
import logging
import xml.etree.ElementTree as ET
import requests
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

logger = logging.getLogger(__name__)

# RSS Google News (działa bez klucza API)
GOOGLE_NEWS_RSS = "https://news.google.com/rss/search"
MAX_HEADLINES = 20
REQUEST_TIMEOUT = 10


def _fetch_news_rss(query: str, lang: str = "pl") -> list[dict]:
    """Pobiera nagłówki z Google News RSS. Zwraca listę {title, link, source}."""
    params = {
        "q": query,
        "hl": lang,
        "gl": "PL" if lang == "pl" else "US",
        "ceid": "PL:pl" if lang == "pl" else "US:en",
    }
    try:
        r = requests.get(GOOGLE_NEWS_RSS, params=params, timeout=REQUEST_TIMEOUT)
        r.raise_for_status()
    except requests.RequestException as e:
        logger.warning("Sentiment RSS fetch failed: %s", e)
        return []

    items = []
    try:
        root = ET.fromstring(r.content)
        # RSS: item; Atom: entry. {*} = dowolny namespace (Python 3.8+)
        for item in list(root.findall(".//{*}item") or root.findall(".//{*}entry") or root.findall(".//item"))[:MAX_HEADLINES]:
            title_el = item.find(".//{*}title") or item.find("title")
            link_el = item.find(".//{*}link") or item.find("link")
            source_el = item.find(".//{*}source") or item.find("source")
            title = (title_el.text or "").strip() if title_el is not None else ""
            if not title:
                continue
            items.append({
                "title": title,
                "link": link_el.text if link_el is not None else None,
                "source": source_el.text if source_el is not None else None,
            })
    except ET.ParseError as e:
        logger.warning("Sentiment RSS parse error: %s", e)
        return []

    return items


def _analyze_sentiment(text: str) -> float:
    """Zwraca compound score od -1 (negatywny) do 1 (pozytywny)."""
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    return float(scores["compound"])


def get_sentiment_for_symbol(symbol: str) -> dict:
    """
    Pobiera nagłówki z internetu (Google News) dla symbolu i zwraca agregowany sentyment.
    Zwraca: symbol, status, sentiment_score (-1..1), sentiment_label, headlines, summary.
    """
    symbol = symbol.upper().strip()
    # Dla krypto dopisujemy "crypto", dla akcji "stock" – lepsze wyniki w wyszukiwarce
    query = f"{symbol} crypto" if _looks_crypto(symbol) else f"{symbol} stock"
    headlines = _fetch_news_rss(query)

    if not headlines:
        return {
            "symbol": symbol,
            "status": "no_data",
            "message": "Brak nagłówków z wyszukiwarki (RSS). Spróbuj inny symbol lub sprawdź połączenie.",
            "sentiment_score": None,
            "sentiment_label": None,
            "headlines": [],
            "summary": None,
        }

    analyzer = SentimentIntensityAnalyzer()
    scored = []
    for h in headlines:
        title = h.get("title") or ""
        compound = analyzer.polarity_scores(title)["compound"]
        label = "positive" if compound >= 0.05 else ("negative" if compound <= -0.05 else "neutral")
        scored.append({
            "title": title,
            "link": h.get("link"),
            "source": h.get("source"),
            "sentiment_score": round(compound, 4),
            "sentiment_label": label,
        })

    scores = [x["sentiment_score"] for x in scored]
    avg = sum(scores) / len(scores) if scores else 0.0
    if avg >= 0.05:
        overall_label = "positive"
    elif avg <= -0.05:
        overall_label = "negative"
    else:
        overall_label = "neutral"

    positive_count = sum(1 for x in scored if x["sentiment_label"] == "positive")
    negative_count = sum(1 for x in scored if x["sentiment_label"] == "negative")
    neutral_count = len(scored) - positive_count - negative_count

    return {
        "symbol": symbol,
        "status": "ok",
        "sentiment_score": round(avg, 4),
        "sentiment_label": overall_label,
        "headlines_count": len(scored),
        "positive_count": positive_count,
        "negative_count": negative_count,
        "neutral_count": neutral_count,
        "headlines": scored,
        "summary": (
            f"Na podstawie {len(scored)} nagłówków: sentyment {overall_label} (score {avg:.2f}). "
            f"Pozytywne: {positive_count}, negatywne: {negative_count}, neutralne: {neutral_count}."
        ),
    }


def _looks_crypto(symbol: str) -> bool:
    """Heurystyka: czy symbol wygląda na krypto (np. BTC, ETH)."""
    crypto_known = {"BTC", "ETH", "USDT", "BNB", "SOL", "XRP", "DOGE", "ADA", "AVAX", "DOT", "MATIC", "LINK", "UNI", "ATOM", "LTC", "ETC", "XLM", "ALGO", "VET", "FIL", "TRX", "APT", "ARB", "OP", "INJ", "NEAR", "IMX", "RUNE", "AAVE", "MKR", "CRV", "SAND", "MANA"}
    return symbol in crypto_known or len(symbol) <= 5
