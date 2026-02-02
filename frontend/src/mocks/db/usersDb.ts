import { meFixture } from "../fixtures/me";

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  birthDate?: string;
  riskProfile?: "conservative" | "balanced" | "aggressive";
  acceptRisk?: boolean;
};

let currentUser: UserProfile = { ...meFixture };

export function getUser() {
  return currentUser;
}

export function updateUser(data: Partial<UserProfile>) {
  currentUser = { ...currentUser, ...data };
  return currentUser;
}
