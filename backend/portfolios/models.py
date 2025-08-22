# portfolios/models.py
from django.conf import settings
from django.db import models
from django.db.models import UniqueConstraint, Index
from django.db.models.functions import Lower

class Portfolio(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="portfolios"
    )
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Unikalna nazwa portfela per użytkownik (case-insensitive)
        constraints = [
            UniqueConstraint(
                Lower("name"), "owner",
                name="uq_portfolio_owner_lower_name"
            )
        ]
        indexes = [
            Index(fields=["owner", "name"]),
            Index(Lower("name"), name="idx_portfolio_lower_name"),
        ]
        ordering = ["owner_id", "name"]

    def __str__(self):
        return f"{self.name} ({self.owner.email})"

    @property
    def is_all(self) -> bool:
        # przyjęta konwencja nazwy systemowego portfela
        return self.name.strip().lower() == "all"
    
    @classmethod
    def ensure_all_for(cls, user):
        """Zwraca portfel ALL, tworząc go jeśli trzeba."""
        obj, _ = cls.objects.get_or_create(owner=user, name="ALL")
        return obj