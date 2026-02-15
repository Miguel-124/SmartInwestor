from django.conf import settings
from django.db import models
from django.db.models import Index

from portfolios.models import Portfolio

class Transaction(models.Model):
    BUY = "BUY"
    SELL = "SELL"
    SIDE_CHOICES = [(BUY, "Buy"), (SELL, "Sell")]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    symbol = models.CharField(max_length=20)
    side = models.CharField(max_length=4, choices=SIDE_CHOICES, default=BUY)
    quantity = models.DecimalField(max_digits=20, decimal_places=8)
    price = models.DecimalField(max_digits=20, decimal_places=8)
    fee = models.DecimalField(max_digits=20, decimal_places=8, default=0)
    executed_at = models.DateTimeField()
    note = models.CharField(max_length=255, blank=True, null=True)
    asset_type = models.CharField(
        max_length=10,
        choices=[("stock", "Stock"), ("crypto", "Crypto")],
        default="stock",
    )

    # Kluczowe: M2M do portfeli
    portfolios = models.ManyToManyField(
        Portfolio,
        through="TransactionPortfolio",
        related_name="transactions",
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            Index(fields=["owner", "symbol"]),
            Index(fields=["owner", "executed_at"]),
        ]
        ordering = ["-executed_at", "-id"]

    def __str__(self):
        return f"{self.symbol} {self.side} {self.quantity} @ {self.price} ({self.owner_id})"


class TransactionPortfolio(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("transaction", "portfolio"),)
        indexes = [
            Index(fields=["portfolio"]),
            Index(fields=["transaction"]),
        ]

    def __str__(self):
        return f"TX {self.transaction_id} → {self.portfolio_id}"