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
  baseCurrency?: "PLN" | "EUR" | "USD";
};

let currentUser: UserProfile = { ...meFixture };

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function getUser() {
  return currentUser;
}

export function updateUser(data: Partial<UserProfile>) {
  currentUser = { ...currentUser, ...data };
  return currentUser;
}

export function setUserFromRegister(data: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  currentUser = {
    ...currentUser,
    id: uid("u"),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  return currentUser;
}
