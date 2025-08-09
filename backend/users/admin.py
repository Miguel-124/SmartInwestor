# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Lista w tabeli
    list_display = ("id", "email", "first_name", "last_name", "is_staff", "is_active", "is_google_account")
    list_filter = ("is_staff", "is_active", "is_superuser", "is_google_account", "groups")
    search_fields = ("email", "first_name", "last_name", "google_id")
    ordering = ("email",)
    readonly_fields = ("last_login", "date_joined")

    # Szczegóły użytkownika (edycja)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Informacje osobiste", {"fields": ("first_name", "last_name", "avatar_url")}),
        ("Integracje", {"fields": ("google_id", "is_google_account")}),
        ("Uprawnienia", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Daty", {"fields": ("last_login", "date_joined")}),
    )

    # Formularz dodawania w adminie
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "is_active", "is_staff", "is_superuser", "groups"),
        }),
    )