from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    RISK_AGGRESSIVE = "aggressive"   # ok. ±80%
    RISK_MODERATE = "moderate"       # ok. ±20%
    RISK_SAFE = "safe"               # ok. ±4%
    RISK_CHOICES = [
        (RISK_AGGRESSIVE, "Agresywny (±80%)"),
        (RISK_MODERATE, "Umiarkowany (±20%)"),
        (RISK_SAFE, "Bezpieczny (±4%)"),
    ]

    email = models.EmailField(unique=True)
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    avatar_url = models.URLField(blank=True, null=True)
    risk_profile = models.CharField(
        max_length=20,
        choices=RISK_CHOICES,
        blank=True,
        null=True,
        help_text="Profil ryzyka z ankiety: agresywny/umiarkowany/bezpieczny",
    )
    survey_completed_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text="Kiedy użytkownik ukończył ankietę (null = nie ukończona)",
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # bo username nadal jest wymagany w formularzach

    def __str__(self):
        return self.email

    @property
    def is_google_linked(self) -> bool:
        return bool(self.google_id)

    @property
    def has_completed_survey(self) -> bool:
        return self.survey_completed_at is not None