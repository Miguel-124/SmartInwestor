import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { PrivateLayout } from "../layouts/PrivateLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { PortfoliosPage } from "../features/portfolios/pages/PortfoliosPage";
import { MetricsPage } from "../features/metrics/pages/MetricsPage";
import { AnalysisPage } from "../features/analysis/pages/AnalysisPage";
import { ProfileSettingsPage } from "../features/profile/pages/ProfileSettingsPage";
import { ProfileAboutPage } from "../features/profile/pages/ProfileAboutPage";
import { ProfileHelpPage } from "../features/profile/pages/ProfileHelpPage";
import { RequireAuth } from "./RequireAuth";
import { PrivacyPolicyPage } from "../features/legal/pages/PrivacyPolicyPage";
import { TermsPage } from "../features/legal/pages/TermsPage";
import { PublicNotFoundPage } from "../shared/pages/PublicNotFoundPage";
import { PrivateNotFoundPage } from "../shared/pages/PrivateNotFoundPage";
import { ChartsPage } from "../features/charts/pages/ChartsPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/onboarding", element: <OnboardingPage /> },
      { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/profile/about", element: <ProfileAboutPage /> },
      { path: "/profile/help", element: <ProfileHelpPage /> },
      { path: "*", element: <PublicNotFoundPage /> },
    ],
  },
  {
    element: (
      <RequireAuth>
        <PrivateLayout />
      </RequireAuth>
    ),
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/portfolios", element: <PortfoliosPage /> },
      { path: "/metrics", element: <MetricsPage /> },
      { path: "/analysis", element: <AnalysisPage /> },
      { path: "/profile/settings", element: <ProfileSettingsPage /> },
      { path: "*", element: <PrivateNotFoundPage /> },
      { path: "/charts", element: <ChartsPage /> },
    ],
  },
]);
