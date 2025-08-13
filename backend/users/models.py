from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    avatar_url = models.URLField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # bo username nadal jest wymagany w formularzach

    def __str__(self):
        return self.email
    
    @property
    def is_google_linked(self) -> bool:
        return bool(self.google_id)