from django.contrib import admin
from .models import Transaction, TransactionPortfolio

class TransactionPortfolioInline(admin.TabularInline):
    model = TransactionPortfolio
    extra = 0
    autocomplete_fields = ("portfolio",)
    show_change_link = True

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "owner_email", "symbol", "side", "quantity", "price", "fee", "executed_at", "created_at")
    list_filter = ("side", "executed_at", "created_at")
    search_fields = ("symbol", "owner__email")
    date_hierarchy = "executed_at"
    ordering = ("-executed_at", "-id")
    inlines = [TransactionPortfolioInline]

    def owner_email(self, obj):
        return getattr(obj.owner, "email", "")
    owner_email.short_description = "Owner email"

@admin.register(TransactionPortfolio)
class TransactionPortfolioAdmin(admin.ModelAdmin):
    list_display = ("id", "transaction", "portfolio")
    search_fields = ("transaction__symbol", "portfolio__name", "portfolio__owner__email")
    autocomplete_fields = ("transaction", "portfolio")