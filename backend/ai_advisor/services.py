# backend/ai_advisor/services.py
import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent
from portfolios.models import Portfolio
from django.db.models import Sum

load_dotenv()

def get_model():
    """Bezpieczne pobieranie instancji modelu"""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        # Zamiast wywalać system, zwrócimy None lub rzucimy błąd dopiero przy wywołaniu
        raise ValueError("GOOGLE_API_KEY nie został znaleziony w środowisku!")
    
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=api_key,
        temperature=0
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

def run_smart_advisor(user, query: str):
    # Inicjalizujemy model i agenta DOPIERO TUTAJ, nie na poziomie modułu
    try:
        model = get_model()
        tools = [get_user_portfolio_context]
        
        system_message = SystemMessage(content=(
            "Jesteś doradcą SmartInwestor. Analizuj portfel użytkownika rzetelnie."
        ))

        agent = create_react_agent(model, tools, state_modifier=system_message)
        result = agent.invoke({"messages": [HumanMessage(content=query)]})
        return result["messages"][-1].content
    except Exception as e:
        return f"Błąd asystenta: {str(e)}"