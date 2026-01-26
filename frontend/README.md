# SmartInwestor – Frontend (Expo Web + React Native + TS)

Nowoczesny interfejs dla inwestorów indywidualnych: przegląd portfela, wizualizacja wskaźników, podpowiedzi alokacyjne. MVP działa w **przeglądarce** (Expo Web) i jest gotowe do prezentacji na obronie.

## ⚙️ Stos technologiczny

- **React Native + TypeScript** (render na web przez `react-native-web`)
- **Expo** (dev-server, bundling)
- **React Navigation** (routing)
- **Recharts** (wykresy)
- **AsyncStorage** (web: IndexedDB) – lokalne logowanie/sesja (TTL ~30 min)

## 🚀 Uruchomienie (dev)

```bash
cd frontend
npm i
npm run dev      # alias: expo start --web

```
