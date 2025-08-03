# portfolio/models.py
from django.db import models
from django.conf import settings

class Portfolio(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='portfolios'
    )
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.owner.email})"

class Position(models.Model):
    portfolio = models.ForeignKey(
        Portfolio,
        related_name='positions',
        on_delete=models.CASCADE
    )
    symbol = models.CharField(max_length=20)
    quantity = models.DecimalField(max_digits=20, decimal_places=8)
    cost_basis = models.DecimalField(max_digits=20, decimal_places=8)

    def __str__(self):
        return f"{self.symbol}: {self.quantity}"