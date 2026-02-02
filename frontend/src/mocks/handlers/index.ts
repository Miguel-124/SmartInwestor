import { authHandlers } from "./authHandlers";
import { dashboardHandlers } from "./dashboardHandlers";
import { userHandlers } from "./userHandlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...userHandlers,
];
