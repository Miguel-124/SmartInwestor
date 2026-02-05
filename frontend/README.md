# SmartInwestor Frontend

## Overview

Frontend aplikacji platformy inwestycyjnej SmartInwestor (Vite + React + TypeScript).

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (zalecane)

### Installation

```bash
npm install
```

### Running the Application (dev)

```bash
npm run dev
```

### Build & Preview

```bash
npm run build
npm run preview
```

### Tests

```bash
npm run test
npm run test:ui
npm run e2e
```

## API & Mocking (MSW)

- W trybie deweloperskim mocki (MSW) są włączone domyślnie.
- Możesz jawnie sterować MSW przez zmienną środowiskową:

```
VITE_USE_MSW=true|false
```

- Bazowy URL API (jeśli potrzebny) możesz ustawić przez:

```
VITE_API_BASE_URL=https://api.example.com
```

## Project Structure

```
src/
├── app/
│   ├── RequireAuth.tsx
│   ├── providers.tsx
│   ├── routes.tsx
│   └── theme/
│       ├── createAppTheme.ts
│       ├── ThemeModeProvider.tsx
│       └── tokens.ts
├── assets/
├── features/
│   ├── analysis/
│   ├── auth/
│   ├── dashboard/
│   ├── charts/
│   ├── onboarding/
│   ├── portfolios/
│   └── profile/
├── layouts/
│   ├── PrivateLayout.tsx
│   └── PublicLayout.tsx
├── mocks/
│   ├── browser.ts
│   ├── server.ts
│   ├── fixtures/
│   └── handlers/
├── shared/
│   ├── UI/
│   │   ├── AppFooter.tsx
│   │   ├── AppPrivateHeader.tsx
│   │   ├── AppPublicHeader.tsx
│   │   └── Logo.tsx
│   ├── api/
│   │   └── httpClient.ts
│   └── auth/
│       └── tokenStorage.ts
├── test/
│   ├── renderWithProviders.tsx
│   └── setup.ts
├── App.tsx
└── main.tsx
```

## Technologies

- React 19
- TypeScript
- Vite
- MUI
- React Query
- React Router
- MSW
- Vitest + Playwright

## Contributing

See CONTRIBUTING.md for guidelines.

## License

MIT
