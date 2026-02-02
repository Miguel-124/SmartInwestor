# SmartInwestor Frontend

## Overview

Frontend application for SmartInwestor investment platform.

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
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
├── assets/ (empty or contains images)
├── features/
│   ├── analysis/
│   ├── auth/
│   ├── dashboard/
│   ├── metrics/
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
│   │   ├── AppHeader.tsx
│   │   └── Logo.tsx
│   ├── api/
│   │   └── httpClient.ts
│   └── auth/
│       └── tokenStorage.ts
├── test/
│   ├── renderWithProviders.tsx
│   └── setup.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Technologies

- React
- TypeScript
- CSS/SCSS

## Contributing

See CONTRIBUTING.md for guidelines.

## License

MIT
