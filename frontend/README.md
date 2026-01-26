# SmartInvestor — Frontend (Expo Web · React Native · TypeScript)

A modern interface for individual investors: clear portfolio overview, indicator visualizations, and allocation hints. This MVP runs **in the browser** via Expo Web and is ready for demo/defense.


## Tech Stack
- **React Native + TypeScript** (rendered on web via `react-native-web`)
- **Expo** (dev server & bundler)
- **React Navigation** (routing)
- **Recharts** (charts)
- **AsyncStorage** (IndexedDB on web) for simple local auth/session


## Getting Started (dev)
```bash
cd frontend
npm i
npm run dev   # alias for: expo start --web
