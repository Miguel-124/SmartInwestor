FROM node:20-alpine

WORKDIR /app

# Instalacja zależności systemowych
RUN apk add --no-cache bash

# Kopiowanie plików pakietów
COPY package*.json ./

# Instalacja zależności z flagą --legacy-peer-deps dla stabilności
RUN npm install --legacy-peer-deps

# FIX: Instalacja modułu ngrok, aby Expo nie pytało o to w Dockerze
RUN npm install -g @expo/ngrok

# Kopiowanie reszty kodu
COPY . .

# Port dla Metro Bundlera
EXPOSE 8081

# Uruchomienie expo w trybie LAN (najszybszy dla dewelopera)
CMD ["npx", "expo", "start", "--lan", "--tunnel"]