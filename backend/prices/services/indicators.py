"""
Wskaźniki analizy technicznej: EMA, RSI, sygnały przecięcia EMA.
"""
from typing import List, Optional


def ema(prices: List[float], period: int) -> List[Optional[float]]:
    """
    EMA (Exponential Moving Average).
    Wzór: EMA_t = α * price_t + (1 - α) * EMA_{t-1}, α = 2 / (N + 1).
    Pierwsze (period - 1) wartości to None (brak wystarczającej historii).
    """
    if not prices or period < 1:
        return []
    alpha = 2.0 / (period + 1)
    out: List[Optional[float]] = [None] * (period - 1)
    s = sum(prices[:period])
    out.append(s / period)  # pierwsza EMA = SMA z pierwszych N punktów
    for i in range(period, len(prices)):
        val = alpha * prices[i] + (1 - alpha) * (out[-1] or 0)
        out.append(round(val, 8))
    return out


def rsi(prices: List[float], period: int = 14) -> List[Optional[float]]:
    """
    RSI (Relative Strength Index).
    Wykupienie > 70, wyprzedanie < 30.
    Pierwsze (period) wartości to None.
    """
    if not prices or period < 1 or len(prices) <= period:
        return [None] * len(prices) if prices else []
    out: List[Optional[float]] = [None] * period
    for i in range(period, len(prices)):
        gains, losses = 0.0, 0.0
        for j in range(i - period + 1, i + 1):
            ch = prices[j] - prices[j - 1]
            if ch > 0:
                gains += ch
            else:
                losses -= ch
        avg_gain = gains / period
        avg_loss = losses / period
        if avg_loss == 0:
            rsi_val = 100.0
        else:
            rs = avg_gain / avg_loss
            rsi_val = 100.0 - (100.0 / (1 + rs))
        out.append(round(rsi_val, 2))
    return out


def crossover_signals(
    ema_fast: List[Optional[float]],
    ema_slow: List[Optional[float]],
) -> List[Optional[str]]:
    """
    Sygnały kupna/sprzedaży przy przecięciu EMA:
    - 'buy' gdy EMA szybka przecina EMA wolną od dołu,
    - 'sell' gdy od góry.
    Długość listy = min(len(ema_fast), len(ema_slow)); brak sygnału = None.
    """
    n = min(len(ema_fast), len(ema_slow))
    out: List[Optional[str]] = [None] * n
    for i in range(1, n):
        fa, fb = ema_fast[i - 1], ema_fast[i]
        sa, sb = ema_slow[i - 1], ema_slow[i]
        if fa is None or fb is None or sa is None or sb is None:
            continue
        if fa <= sa and fb > sb:
            out[i] = "buy"
        elif fa >= sa and fb < sb:
            out[i] = "sell"
    return out
