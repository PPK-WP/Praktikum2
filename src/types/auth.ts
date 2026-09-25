import type { UserRole } from "@/types/shared";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface StoredUser extends User {
  passwordHash: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface SessionPayload {
  userId: string;
  expiresAt: number;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
