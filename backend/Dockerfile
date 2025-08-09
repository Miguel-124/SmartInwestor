# 1. Wybierz obraz bazowy Pythona
FROM python:3.10.12-slim-bullseye

# 2. System deps (netcat do waita)
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# 3. Katalog roboczy
WORKDIR /app

# 4. Zależności Pythona
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Kod + entrypoint
COPY entrypoint.sh /app/entrypoint.sh
COPY . .
RUN chmod +x /app/entrypoint.sh

# 6. Domyślna komenda (compose i tak nadpisuje)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]