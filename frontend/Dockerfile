# 1. Wybierz obraz z Node.js
FROM node:20-alpine

# 2. Ustaw katalog roboczy
WORKDIR /app

# 3. Skopiuj definicje paczek i zainstaluj zależności
COPY package*.json ./
RUN npm ci

# 4. Skopiuj cały kod
COPY . .

# 5. Domyślna komenda startowa
CMD ["npm", "run", "dev"]