# portfolios/serializers.py
from rest_framework import serializers
from .models import Portfolio

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

    class Meta:
        model = Portfolio
        fields = ["id", "name", "created_at", "is_main", "positions_count", "positions"]

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

    def get_positions(self, obj):
        """
        Zwraca listę pozycji w formie:
        [
          {"symbol": "BTC", "quantity": "0.45000000", "total_cost": "15000.00", "avg_price": "33333.33"},
          ...
        ]
        gdzie:
        - quantity = suma ilości transakcji dla symbolu w tym portfelu
        - total_cost = suma (qty*price + fee) dla symbolu
        - avg_price = total_cost / quantity
        """
        try:
            from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
            from django.db.models import Sum, F, DecimalField, ExpressionWrapper
            from transactions.models import Transaction

            # suma kosztu: qty*price + fee (fee może być 0)
            cost_expr = ExpressionWrapper(
                F("quantity") * F("price") + F("fee"),
                output_field=DecimalField(max_digits=28, decimal_places=8),
            )

            qs = (
                Transaction.objects
                .filter(portfolios=obj)  # M2M: portfolios
                .values("symbol")
                .annotate(
                    quantity=Sum("quantity"),
                    total_cost=Sum(cost_expr),
                )
                .order_by("symbol")
            )

            out = []
            for row in qs:
                qty = row["quantity"] or Decimal("0")
                total_cost = row["total_cost"] or Decimal("0")
                try:
                    avg = (total_cost / qty) if qty != 0 else Decimal("0")
                except (InvalidOperation, ZeroDivisionError):
                    avg = Decimal("0")

                # Zaokrąglanie „ładne” do prezentacji; jeśli wolisz surowe Decimale, usuń quantize i str()
                avg_q = avg.quantize(Decimal("0.00000001"), rounding=ROUND_HALF_UP)
                qty_q = qty.quantize(Decimal("0.00000001"), rounding=ROUND_HALF_UP)
                cost_q = total_cost.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

                out.append({
                    "symbol": row["symbol"],
                    "quantity": str(qty_q),
                    "total_cost": str(cost_q),
                    "avg_price": str(avg_q),
                })
            return out

        except Exception:
            # zanim zrobimy appkę `transactions`, nie wywalaj API
            return []