import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { LOGIN_PATH, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/constants";
import { signSessionToken, verifySessionToken } from "@/lib/auth/session-token";
import { findUserById } from "@/lib/auth/store";
import type { StoredUser, User } from "@/types/auth";

export function toPublicUser(user: StoredUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/** Starts a session for the user. Only callable from route handlers or server functions. */
export async function createSession(userId: string) {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const token = await signSessionToken({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });

  return { expiresAt };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * The user who owns the active session, or null. Checks both the cookie signature
 * and that the account still exists. Memoized per request.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return null;
  }

  const user = await findUserById(session.userId);
  return user ? toPublicUser(user) : null;
});

/** For protected pages: returns the logged-in user or redirects to the login page. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(LOGIN_PATH);
  }
  return user;
}
