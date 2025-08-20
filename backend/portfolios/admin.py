# portfolios/admin.py
from django.contrib import admin
from .models import Portfolio

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "owner_email", "created_at", "is_all_display")
    search_fields = ("name", "owner__email", "owner__first_name", "owner__last_name")
    list_filter = ("created_at",)
    date_hierarchy = "created_at"
    ordering = ("owner", "name")
    readonly_fields = ("created_at",)

    fieldsets = (
        (None, {"fields": ("owner", "name")}),
        ("Metadane", {"fields": ("created_at",)}),
    )
    

    def owner_email(self, obj):
        return getattr(obj.owner, "email", "")
    owner_email.short_description = "Owner email"

    def is_all_display(self, obj):
        return obj.is_all
    is_all_display.boolean = True
    is_all_display.short_description = "ALL?"