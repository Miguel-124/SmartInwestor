# Test runner settings: używa SQLite in-memory, żeby testy działały bez PostgreSQL (np. przy collation mismatch).
from .settings import *  # noqa: F401, F403

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}
