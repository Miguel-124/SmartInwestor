import { authHandlers } from "./authHandlers";
import { dashboardHandlers } from "./dashboardHandlers";
import { userHandlers } from "./userHandlers";
import { portfoliosHandlers } from "./portfoliosHandlers";
import { chartsHandlers } from "./chartsHandlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...userHandlers,
  ...portfoliosHandlers,
  ...chartsHandlers,
];
