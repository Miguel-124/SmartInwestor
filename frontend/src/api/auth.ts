import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../models/User";
import { v4 as uuidv4 } from "uuid";

const USERS_KEY = "USERS_LIST";
const SESSION_KEY = "USER_SESSION";
const TTL = 30 * 60 * 1000;

interface Session {
  user: User;
  timestamp: number;
}

async function getStoredUsers(): Promise<User[]> {
  const json = await AsyncStorage.getItem(USERS_KEY);
  return json ? JSON.parse(json) : [];
}

async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

async function saveSession(user: User) {
  const session: Session = { user, timestamp: Date.now() };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function registerUser(data: Omit<User, "id">) {
  const users = await getStoredUsers();
  if (users.find((u) => u.email === data.email)) {
    throw new Error("Użytkownik o takim emailu już istnieje");
  }
  const newUser: User = { id: uuidv4(), ...data };
  users.push(newUser);
  await saveUsers(users);
  await saveSession(newUser);
  return newUser;
}

export async function loginUser(email: string, password: string) {
  const users = await getStoredUsers();
  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) throw new Error("Błędny email lub hasło");
  await saveSession(found);
  return found;
}

export async function logoutUser() {
  await clearSession();
}

export async function getCurrentSession(): Promise<Session | null> {
  const json = await AsyncStorage.getItem(SESSION_KEY);
  if (!json) return null;
  const session: Session = JSON.parse(json);

  if (Date.now() - session.timestamp > TTL) {
    await clearSession();
    return null;
  }
  return session;
}
