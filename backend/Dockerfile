# 1. Wybierz obraz bazowy Pythona
FROM python:3.10.12-slim-bullseye

# 2. Ustaw katalog roboczy wewnątrz kontenera
WORKDIR /app

# 3. Skopiuj plik z zależnościami i je zainstaluj
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Skopiuj resztę kodu aplikacji
COPY . .

# 5. Domyślna komenda przy uruchomieniu kontenera (niestety w Compose nadpisujemy ją)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]