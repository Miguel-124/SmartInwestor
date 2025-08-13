# users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = ("id", "email", "first_name", "last_name", "is_google_linked", "google_id", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    search_fields = ("email", "first_name", "last_name", "google_id")
    ordering = ("email",)
    readonly_fields = ("last_login", "date_joined")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Informacje osobiste", {"fields": ("first_name", "last_name", "avatar_url")}),
        ("Integracje", {"fields": ("google_id",)}),
        ("Uprawnienia", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Daty", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "is_active", "is_staff", "is_superuser", "groups"),
        }),
    )