# portfolios/serializers.py
import logging
from rest_framework import serializers
from .models import Portfolio

logger = logging.getLogger(__name__)

class PortfolioListSerializer(serializers.ModelSerializer):
    is_main = serializers.ReadOnlyField()
    class Meta:
        model = Portfolio
        fields = ["id", "name", "created_at", "is_main"]


class PortfolioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ["id", "name"]  # owner ustawimy w perform_create w ViewSecie
        extra_kwargs = {
            "name": {"required": True, "allow_blank": False, "max_length": 100}
        }
        
    def validate_name(self, value):
        value = value.strip()
        if value.lower() == Portfolio.MAIN_PORTFOLIO_NAME.lower():
            raise serializers.ValidationError("Nazwa „Main” jest zarezerwowana dla portfela systemowego.")
        user = self.context["request"].user
        if Portfolio.objects.filter(owner=user, name__iexact=value).exists():
            raise serializers.ValidationError("Masz już portfel o takiej nazwie.")
        return value


class PortfolioDetailSerializer(serializers.ModelSerializer):
    positions = serializers.SerializerMethodField()
    positions_count = serializers.SerializerMethodField()
    is_main = serializers.ReadOnlyField()
    total_cost = serializers.SerializerMethodField()
    total_current_value = serializers.SerializerMethodField()
    total_pl_amount = serializers.SerializerMethodField()
    total_pl_percent = serializers.SerializerMethodField()
    total_value_7d_ago = serializers.SerializerMethodField()
    total_pl_7d_amount = serializers.SerializerMethodField()
    total_pl_7d_percent = serializers.SerializerMethodField()
    total_value_from_date = serializers.SerializerMethodField()
    total_pl_from_amount = serializers.SerializerMethodField()
    total_pl_from_percent = serializers.SerializerMethodField()

    class Meta:
        model = Portfolio
        fields = [
            "id", "name", "created_at", "is_main", "positions_count", "positions",
            "total_cost", "total_current_value", "total_pl_amount", "total_pl_percent",
            "total_value_7d_ago", "total_pl_7d_amount", "total_pl_7d_percent",
            "total_value_from_date", "total_pl_from_amount", "total_pl_from_percent",
        ]

    def get_positions_count(self, obj):
        """
        Liczba UNIKALNYCH symboli w tym portfelu.
        Zadziała po dodaniu appki `transactions` z M2M Transaction→Portfolio.
        """
        try:
            from transactions.models import Transaction
            return (
                Transaction.objects
                .filter(portfolios=obj)
                .values("symbol")
                .distinct()
                .count()
            )
        except Exception:
            # zanim zrobimy appkę `transactions`, nie wywalaj API
            return 0

    def _get_positions_with_pl(self, obj):
        """Pozycje + ceny bieżące, 7d i opcjonalnie od daty. Zwraca (out, totals_dict).
        Agregacja w Pythonie: BUY dodaje ilość i koszt, SELL odejmuje.
        Pokazujemy tylko pozycje z quantity > 0."""
        try:
            from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
            from collections import defaultdict
            from transactions.models import Transaction
            from prices.services.coingecko import get_prices_by_symbol, get_price_days_ago, get_price_at_date

            request = self.context.get("request")
            from_date_str = request.query_params.get("from_date") if request else None

            qs = (
                Transaction.objects
                .filter(portfolios=obj, owner=obj.owner)
                .only("symbol", "side", "quantity", "price", "fee")
            )
            # Agregacja w Pythonie: symbol -> (quantity, total_cost)
            by_symbol = defaultdict(lambda: (Decimal("0"), Decimal("0")))
            for tx in qs:
                qty = tx.quantity or Decimal("0")
                cost = (tx.quantity or Decimal("0")) * (tx.price or Decimal("0")) + (tx.fee or Decimal("0"))
                if tx.side == Transaction.BUY:
                    by_symbol[tx.symbol] = (by_symbol[tx.symbol][0] + qty, by_symbol[tx.symbol][1] + cost)
                else:
                    by_symbol[tx.symbol] = (by_symbol[tx.symbol][0] - qty, by_symbol[tx.symbol][1] - (tx.quantity or 0) * (tx.price or 0) + (tx.fee or 0))

            rows = [
                {"symbol": sym, "quantity": qty, "total_cost": tot}
                for sym, (qty, tot) in sorted(by_symbol.items())
                if qty > Decimal("0")
            ]
            if not rows:
                empty_totals = {
                    "total_cost": Decimal("0"), "total_current_value": Decimal("0"),
                    "total_value_7d": Decimal("0"), "total_value_from": None,
                }
                return [], empty_totals

            symbols = [r["symbol"] for r in rows]
            try:
                prices_map = get_prices_by_symbol(symbols, vs="usd")
            except Exception:
                prices_map = {}

            total_cost_sum = Decimal("0")
            total_current_value_sum = Decimal("0")
            total_value_7d_sum = Decimal("0")
            total_value_from_sum = Decimal("0")
            has_from = False
            out = []
            for row in rows:
                qty = row["quantity"] or Decimal("0")
                total_cost = row["total_cost"] or Decimal("0")
                try:
                    avg = (total_cost / qty) if qty != 0 else Decimal("0")
                except (InvalidOperation, ZeroDivisionError):
                    avg = Decimal("0")
                avg_q = avg.quantize(Decimal("0.00000001"), rounding=ROUND_HALF_UP)
                qty_q = qty.quantize(Decimal("0.00000001"), rounding=ROUND_HALF_UP)
                cost_q = total_cost.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

                sym = row["symbol"].upper()
                current_price = prices_map.get(sym)
                current_value = None
                pl_amount = None
                pl_percent = None
                value_7d_ago = None
                pl_7d_amount = None
                pl_7d_percent = None
                value_from_date = None
                pl_from_amount = None
                pl_from_percent = None

                total_cost_sum += total_cost
                if current_price is not None and qty:
                    current_value = float(qty) * current_price
                    cost_f = float(total_cost)
                    pl_amount = round(current_value - cost_f, 2)
                    pl_percent = round((pl_amount / cost_f * 100), 2) if cost_f else None
                    total_current_value_sum += Decimal(str(current_value))

                    price_7d = get_price_days_ago(row["symbol"], "usd", 7)
                    if price_7d is not None:
                        value_7d_ago = round(float(qty) * price_7d, 2)
                        pl_7d_amount = round(current_value - value_7d_ago, 2)
                        pl_7d_percent = round((pl_7d_amount / value_7d_ago * 100), 2) if value_7d_ago else None
                        total_value_7d_sum += Decimal(str(value_7d_ago))

                    if from_date_str:
                        price_from = get_price_at_date(row["symbol"], "usd", from_date_str)
                        if price_from is not None:
                            value_from_date = round(float(qty) * price_from, 2)
                            pl_from_amount = round(current_value - value_from_date, 2)
                            pl_from_percent = round((pl_from_amount / value_from_date * 100), 2) if value_from_date else None
                            total_value_from_sum += Decimal(str(value_from_date))
                            has_from = True

                out.append({
                    "symbol": row["symbol"],
                    "quantity": str(qty_q),
                    "total_cost": str(cost_q),
                    "avg_price": str(avg_q),
                    "current_price": round(current_price, 8) if current_price is not None else None,
                    "current_value": round(current_value, 2) if current_value is not None else None,
                    "pl_amount": pl_amount,
                    "pl_percent": pl_percent,
                    "value_7d_ago": value_7d_ago,
                    "pl_7d_amount": pl_7d_amount,
                    "pl_7d_percent": pl_7d_percent,
                    "value_from_date": value_from_date,
                    "pl_from_amount": pl_from_amount,
                    "pl_from_percent": pl_from_percent,
                })
            totals = {
                "total_cost": total_cost_sum.quantize(Decimal("0.01")),
                "total_current_value": total_current_value_sum.quantize(Decimal("0.01")),
                "total_value_7d": total_value_7d_sum.quantize(Decimal("0.01")),
                "total_value_from": total_value_from_sum.quantize(Decimal("0.01")) if has_from else None,
            }
            return out, totals
        except Exception as e:
            from decimal import Decimal
            logger.exception("_get_positions_with_pl failed for portfolio id=%s: %s", getattr(obj, "id", None), e)
            return [], {
                "total_cost": Decimal("0"), "total_current_value": Decimal("0"),
                "total_value_7d": Decimal("0"), "total_value_from": None,
            }


    def _get_pl_cache(self, obj):
        if not hasattr(self, "_pl_cache"):
            self._pl_cache = self._get_positions_with_pl(obj)
        return self._pl_cache

    def get_positions(self, obj):
        out, _ = self._get_pl_cache(obj)
        return out

    def get_total_cost(self, obj):
        _, t = self._get_pl_cache(obj)
        return str(t["total_cost"])

    def get_total_current_value(self, obj):
        _, t = self._get_pl_cache(obj)
        return str(t["total_current_value"])

    def get_total_pl_amount(self, obj):
        _, t = self._get_pl_cache(obj)
        tc, tcv = t["total_cost"], t["total_current_value"]
        if tc and tcv is not None:
            return str(round(float(tcv - tc), 2))
        return None

    def get_total_pl_percent(self, obj):
        _, t = self._get_pl_cache(obj)
        tc, tcv = t["total_cost"], t["total_current_value"]
        if tc and tc != 0 and tcv is not None:
            return round(float((tcv - tc) / tc * 100), 2)
        return None

    def get_total_value_7d_ago(self, obj):
        _, t = self._get_pl_cache(obj)
        v = t["total_value_7d"]
        return str(v) if v and v != 0 else None

    def get_total_pl_7d_amount(self, obj):
        _, t = self._get_pl_cache(obj)
        tcv, tv7 = t["total_current_value"], t["total_value_7d"]
        if tcv is not None and tv7 and tv7 != 0:
            return str(round(float(tcv - tv7), 2))
        return None

    def get_total_pl_7d_percent(self, obj):
        _, t = self._get_pl_cache(obj)
        tcv, tv7 = t["total_current_value"], t["total_value_7d"]
        if tv7 and tv7 != 0 and tcv is not None:
            return round(float((tcv - tv7) / tv7 * 100), 2)
        return None

    def get_total_value_from_date(self, obj):
        _, t = self._get_pl_cache(obj)
        v = t.get("total_value_from")
        return str(v) if v else None

    def get_total_pl_from_amount(self, obj):
        _, t = self._get_pl_cache(obj)
        tcv, tvf = t["total_current_value"], t.get("total_value_from")
        if tcv is not None and tvf and tvf != 0:
            return str(round(float(tcv - tvf), 2))
        return None

    def get_total_pl_from_percent(self, obj):
        _, t = self._get_pl_cache(obj)
        tcv, tvf = t["total_current_value"], t.get("total_value_from")
        if tvf and tvf != 0 and tcv is not None:
            return round(float((tcv - tvf) / tvf * 100), 2)
        return None