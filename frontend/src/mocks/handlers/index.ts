import { authHandlers } from "./authHandlers";
import { dashboardHandlers } from "./dashboardHandlers";
import { userHandlers } from "./userHandlers";
import { portfoliosHandlers } from "./portfoliosHandlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...userHandlers,
  ...portfoliosHandlers,
];
