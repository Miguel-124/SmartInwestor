import { authHandlers } from "./authHandlers";
import { dashboardHandlers } from "./dashboardHandlers";
import { userHandlers } from "./userHandlers";
import { portfoliosHandlers } from "./portfoliosHandlers";
import { chartsHandlers } from "./chartsHandlers";
import { onboardingHandlers } from "./onboardingHandlers";
import { analysisHandlers } from "./analysisHandlers";
import { fxHandlers } from "./fxHandlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...userHandlers,
  ...portfoliosHandlers,
  ...chartsHandlers,
  ...onboardingHandlers,
  ...analysisHandlers,
  ...fxHandlers,
];
