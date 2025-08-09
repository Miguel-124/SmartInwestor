from rest_framework import serializers
from django.utils import timezone
from portfolios.models import Portfolio
from .models import Transaction, TransactionPortfolio

class TransactionSerializer(serializers.ModelSerializer):
    # Przekazujemy/zwrotnie pokazujemy listę ID portfeli
    portfolio_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        write_only=True,
        required=False,
        help_text="Lista ID portfeli, do których ma należeć transakcja. ALL zostanie dodany automatycznie."
    )
    portfolios = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id", "symbol", "side", "quantity", "price", "fee", "executed_at", "note",
            "portfolio_ids", "portfolios", "created_at"
        ]
        read_only_fields = ("created_at",)

    def validate(self, attrs):
        # Podstawowe sanity
        if attrs.get("quantity") is not None and attrs["quantity"] <= 0:
            raise serializers.ValidationError({"quantity": "Musi być > 0."})
        if attrs.get("price") is not None and attrs["price"] < 0:
            raise serializers.ValidationError({"price": "Nie może być ujemna."})
        if attrs.get("fee") is not None and attrs["fee"] < 0:
            raise serializers.ValidationError({"fee": "Nie może być ujemna."})

        # Przyszłościowo można zabronić executed_at w przyszłości:
        if attrs.get("executed_at") and attrs["executed_at"] > timezone.now():
            # do decyzji – zostawiam jako soft warning; jeśli chcesz, odkomentuj:
            # raise serializers.ValidationError({"executed_at": "Nie może być w przyszłości."})
            pass
        return attrs

    def _get_or_create_all_portfolio(self, user):
        p = Portfolio.objects.filter(owner=user, name__iexact="ALL").first()
        if not p:
            p = Portfolio.objects.create(owner=user, name="ALL")
        return p

    def _validate_and_prepare_portfolios(self, user, portfolio_ids):
        """
        Zwraca finalną listę portfeli (zawsze zawiera ALL).
        Waliduje, że wszystkie należą do usera.
        """
        portfolios = []
        if portfolio_ids:
            portfolios = list(Portfolio.objects.filter(id__in=portfolio_ids, owner=user))
            if len(portfolios) != len(set(portfolio_ids)):
                raise serializers.ValidationError({"portfolio_ids": "Nie znaleziono jednego z portfeli albo nie należy do Ciebie."})

        all_portfolio = self._get_or_create_all_portfolio(user)
        if all_portfolio not in portfolios:
            portfolios.append(all_portfolio)
        return portfolios

    def get_portfolios(self, obj):
        # Zwracamy {id, name} – wygodne na froncie
        return [{"id": p.id, "name": p.name} for p in obj.portfolios.all().order_by("name")]

    def create(self, validated_data):
        request = self.context["request"]
        user = request.user

        portfolio_ids = validated_data.pop("portfolio_ids", None)
        portfolios = self._validate_and_prepare_portfolios(user, portfolio_ids)

        tx = Transaction.objects.create(owner=user, **validated_data)
        # Ustawiamy M2M przez through, ale prościej: add(*portfolios)
        tx.portfolios.add(*portfolios)
        return tx

    def update(self, instance, validated_data):
        request = self.context["request"]
        user = request.user

        portfolio_ids = validated_data.pop("portfolio_ids", None)

        # Aktualizacja pól transakcji
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        # Jeśli klient podał portfolio_ids w PATCH/PUT → nadpisujemy zestaw portfeli (z zachowaniem ALL)
        if portfolio_ids is not None:
            portfolios = self._validate_and_prepare_portfolios(user, portfolio_ids)
            instance.portfolios.set(portfolios)

        return instance