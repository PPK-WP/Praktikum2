import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getCurrentUser, toPublicUser } from "@/lib/auth/session";
import { findUserByEmail, insertUser } from "@/lib/auth/store";
import {
  hasErrors,
  normalizeEmail,
  validateLogin,
  validateRegister,
} from "@/lib/auth/validation";
import type { AuthSession, LoginPayload, RegisterPayload, User } from "@/types/auth";

export type AuthResult =
  | { ok: true; user: User }
  | { ok: false; status: number; message: string; errors?: Record<string, string> };

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  const errors = validateRegister(payload);
  if (hasErrors(errors)) {
    return { ok: false, status: 422, message: "Data pendaftaran belum valid.", errors };
  }

  const user = await insertUser({
    name: payload.name.trim(),
    email: normalizeEmail(payload.email),
    passwordHash: await hashPassword(payload.password),
  });

  if (!user) {
    return {
      ok: false,
      status: 409,
      message: "Email sudah terdaftar.",
      errors: { email: "Email sudah terdaftar." },
    };
  }

  return { ok: true, user: toPublicUser(user) };
}

export async function login(payload: LoginPayload): Promise<AuthResult> {
  const errors = validateLogin(payload);
  if (hasErrors(errors)) {
    return { ok: false, status: 422, message: "Data login belum valid.", errors };
  }

  const user = await findUserByEmail(normalizeEmail(payload.email));
  if (!user || !(await verifyPassword(payload.password, user.passwordHash))) {
    return { ok: false, status: 401, message: "Email atau password salah." };
  }

  return { ok: true, user: toPublicUser(user) };
}

export async function getSession(): Promise<AuthSession> {
  const user = await getCurrentUser();
  return { user, isAuthenticated: user !== null };
}
