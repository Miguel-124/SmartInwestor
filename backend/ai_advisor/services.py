# backend/ai_advisor/services.py
import os
import re
import time
import logging
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from portfolios.models import Portfolio
from django.db.models import Sum

load_dotenv()

def _quota_message(exc: Exception) -> str:
    """Komunikat o limicie z ewentualnym czasem ponowienia z API (np. 'Please retry in 51.52s')."""
    msg = str(exc)
    m = re.search(r"[Rr]etry in (\d+(?:\.\d+)?)\s*s", msg)
    if m:
        sec = float(m.group(1))
        if sec <= 120:
            return (
                f"Limit zapytań (Google). Odczekaj {int(sec)} s i wyślij wiadomość ponownie. "
                "Limity: https://ai.google.dev/gemini-api/docs/rate-limits"
            )
    return (
        "Limit zapytań (Google). Odczekaj ok. 1 minutę i spróbuj ponownie. "
        "Klucz musi być z Google AI Studio (aistudio.google.com), nie z samego konta Google. "
        "Limity: https://ai.google.dev/gemini-api/docs/rate-limits"
    )

def get_model():
    """Model Google Gemini – klucz z .env: GOOGLE_API_KEY (opcjonalnie GOOGLE_GEMINI_MODEL)."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY nie został znaleziony w środowisku (.env)!")
    # Domyślnie gemini-2.0-flash-lite (dostępny w API v1beta). Inny model w .env: GOOGLE_GEMINI_MODEL
    model_name = os.getenv("GOOGLE_GEMINI_MODEL", "gemini-2.0-flash-lite")
    return ChatGoogleGenerativeAI(
        model=model_name,
        google_api_key=api_key,
        temperature=0,
    )

@tool
def get_user_portfolio_context(user_id: int) -> str:
    """Pobiera aktualny skład portfela użytkownika."""
    portfolios = Portfolio.objects.filter(owner_id=user_id)
    if not portfolios.exists():
        return "Użytkownik nie posiada jeszcze żadnych portfeli."
    
    context = "### STAN PORTFELA ###\n"
    for p in portfolios:
        assets = p.transactions.values('symbol').annotate(total_qty=Sum('quantity'))
        context += f"Portfel {p.name}: "
        context += ", ".join([f"{a['symbol']}: {a['total_qty']}" for a in assets if a['total_qty'] > 0])
        context += "\n"
    return context

def _is_quota_exceeded(exc: Exception) -> bool:
    msg = str(exc).upper()
    return "429" in msg or "RESOURCE_EXHAUSTED" in msg or "QUOTA" in msg


def _retry_seconds(exc: Exception) -> float | None:
    """Zwraca liczbę sekund do odczekania z błędu API (np. 'Please retry in 9s') lub None."""
    m = re.search(r"[Rr]etry in (\d+(?:\.\d+)?)\s*s", str(exc))
    if m:
        return min(float(m.group(1)), 40.0)  # max 40 s, żeby 2 retry + Gemini mieściły się w timeout
    return None


def _do_invoke(messages):
    """Jedno wywołanie agenta."""
    model = get_model()
    tools = [get_user_portfolio_context]
    agent = create_react_agent(model, tools)
    result = agent.invoke({"messages": messages})
    return result["messages"][-1].content


MOCK_RESPONSE = (
    "Złoto często traktuje się jako zabezpieczenie przed inflacją i zawirowaniami na rynku. "
    "Nie daje dywidend ani odsetek, ale historycznie bywało „safe haven”. "
    "W długim horyzoncie zwykle ustępuje zwrotami akcjom; sensownie jest traktować je jako element dywersyfikacji (np. 5–10% portfela), a nie podstawę inwestycji."
)

def run_smart_advisor(user, query: str):
    # Domyślnie mock (3 s) – żeby włączyć Gemini, ustaw w .env: USE_REAL_ADVISOR=true
    if os.getenv("USE_REAL_ADVISOR", "").lower() not in ("1", "true", "yes"):
        time.sleep(3)
        logger.info("AI advisor: mock, odpowiedź po 3 s")
        return MOCK_RESPONSE

    system_message = SystemMessage(content=(
        "Jesteś doradcą SmartInwestor. Analizuj portfel użytkownika rzetelnie."
    ))
    messages = [system_message, HumanMessage(content=query)]

    try:
        return _do_invoke(messages)
    except Exception as e:
        if not _is_quota_exceeded(e):
            return f"Błąd asystenta: {str(e)}"
        logger.info("AI advisor: 429 (limit), start automatycznych retry")
        # Do 2 automatycznych ponowień: czekaj (czas z API + 5 s bufor) i spróbuj ponownie
        for attempt in range(2):
            wait = _retry_seconds(e)
            if wait is None or wait <= 0:
                logger.warning("AI advisor: 429 bez czasu retry w błędzie, pomijam retry")
                break
            wait = min(wait + 3.0, 45.0)  # bufor 3 s, max 45 s na jedno oczekiwanie
            logger.info("AI advisor: limit 429, retry #%d za %.0f s...", attempt + 1, wait)
            time.sleep(wait)
            try:
                return _do_invoke(messages)
            except Exception as retry_e:
                if _is_quota_exceeded(retry_e):
                    e = retry_e
                    continue
                return f"Błąd asystenta: {str(retry_e)}"
        return _quota_message(e)