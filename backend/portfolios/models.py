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

    MAIN_PORTFOLIO_NAME = "Main"

    @property
    def is_main(self) -> bool:
        """Portfel Main zawiera wszystkie transakcje i nie da się go usunąć."""
        return self.name.strip().lower() == self.MAIN_PORTFOLIO_NAME.lower()

    @classmethod
    def ensure_main_for(cls, user):
        """Zwraca portfel Main, tworząc go jeśli trzeba. Main ma każdą transakcję."""
        obj = cls.objects.filter(owner=user, name__iexact=cls.MAIN_PORTFOLIO_NAME).first()
        if obj:
            return obj
        old_all = cls.objects.filter(owner=user, name__iexact="ALL").first()
        if old_all:
            old_all.name = cls.MAIN_PORTFOLIO_NAME
            old_all.save()
            return old_all
        return cls.objects.create(owner=user, name=cls.MAIN_PORTFOLIO_NAME)