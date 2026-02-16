# 1. Wybierz obraz z Node.js
FROM node:20-alpine

# 2. Ustaw katalog roboczy
WORKDIR /app

# 3. Skopiuj definicje paczek i zainstaluj zależności
COPY package*.json ./
RUN npm install

# 4. Skopiuj cały kod
COPY . .

# 5. Przy starcie doinstaluj zależności (gdy volume nadpisuje kod), potem dev
CMD ["sh", "-c", "npm install && npm run dev"]