import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { PrivateLayout } from "../layouts/PrivateLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { PortfoliosPage } from "../features/portfolios/pages/PortfoliosPage";
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
import { PublicHomePage } from "../shared/pages/PublicHomePage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <PublicHomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/onboarding", element: <OnboardingPage /> },
      { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "/terms", element: <TermsPage /> },
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
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/portfolios", element: <PortfoliosPage /> },
      { path: "/analysis", element: <AnalysisPage /> },
      { path: "/profile/settings", element: <ProfileSettingsPage /> },
      { path: "*", element: <PrivateNotFoundPage /> },
      { path: "/charts", element: <ChartsPage /> },
      { path: "/profile/about", element: <ProfileAboutPage /> },
      { path: "/profile/help", element: <ProfileHelpPage /> },
      { path: "/profile/privacy", element: <PrivacyPolicyPage /> },
      { path: "/profile/terms", element: <TermsPage /> },
    ],
  },
]);
