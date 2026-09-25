import { cookies } from "next/headers";

import {
  parsePreference,
  PREFERENCE_COOKIE,
  PREFERENCE_MAX_AGE_SECONDS,
} from "@/features/preferences/preference";
import { getCurrentUser } from "@/lib/auth/session";
import { findPreferenceByUserId, upsertPreference } from "@/lib/auth/store";
import type { UserPreference } from "@/types/shared";

export type { UserPreference };

async function writePreferenceCookie(preference: UserPreference) {
  const cookieStore = await cookies();
  cookieStore.set(PREFERENCE_COOKIE, JSON.stringify(preference), {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: PREFERENCE_MAX_AGE_SECONDS,
  });
}

/** The active preference from the cookie, or defaults. Safe to call in server components. */
export async function getPreference(): Promise<UserPreference> {
  const cookieStore = await cookies();
  return parsePreference(cookieStore.get(PREFERENCE_COOKIE)?.value);
}

/** Merges the patch, writes the cookie, and also stores it for the logged-in user. */
export async function savePreference(patch: Partial<UserPreference>): Promise<UserPreference> {
  const preference = { ...(await getPreference()), ...patch };
  await writePreferenceCookie(preference);

  const user = await getCurrentUser();
  if (user) {
    await upsertPreference(user.id, preference);
  }
  return preference;
}

/** After login, restores the preference the user saved earlier (if any) into the cookie. */
export async function restorePreference(userId: string) {
  const stored = await findPreferenceByUserId(userId);
  if (stored) {
    await writePreferenceCookie({ theme: stored.theme, defaultFilter: stored.defaultFilter });
  }
}
