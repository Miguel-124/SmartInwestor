import { authHandlers } from "./authHandlers";
import { dashboardHandlers } from "./dashboardHandlers";

export const handlers = [...authHandlers, ...dashboardHandlers];
