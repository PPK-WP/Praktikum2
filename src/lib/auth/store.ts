import type { User as PrismaUser, UserPreference as PrismaUserPreference } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { StoredUser } from "@/types/auth";
import type { UserPreference } from "@/types/shared";

// Data access for the users and user_preferences tables.

export interface StoredPreference extends UserPreference {
  userId: string;
  updatedAt: string;
}

function toStoredUser(user: PrismaUser): StoredUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: "student",
    passwordHash: user.passwordHash,
    createdAt: user.createdAt.toISOString(),
  };
}

function toStoredPreference(pref: PrismaUserPreference): StoredPreference {
  return {
    userId: pref.userId,
    theme: pref.theme as UserPreference["theme"],
    defaultFilter: pref.defaultFilter as UserPreference["defaultFilter"],
    updatedAt: pref.updatedAt.toISOString(),
  };
}

export async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user ? toStoredUser(user) : null;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findUserById(id: string) {
  // A non-UUID id (e.g. from an old cookie) would make PostgreSQL raise an error, so skip the query.
  if (!UUID_PATTERN.test(id)) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user ? toStoredUser(user) : null;
}

/** Returns null when the email is already registered. */
export async function insertUser(user: Omit<StoredUser, "id" | "createdAt" | "role">) {
  try {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
      },
    });
    return toStoredUser(newUser);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return null;
    }
    throw error;
  }
}

export async function findPreferenceByUserId(userId: string) {
  const pref = await prisma.userPreference.findUnique({
    where: { userId },
  });
  return pref ? toStoredPreference(pref) : null;
}

export async function upsertPreference(userId: string, preference: UserPreference) {
  const pref = await prisma.userPreference.upsert({
    where: { userId },
    update: {
      theme: preference.theme,
      defaultFilter: preference.defaultFilter,
    },
    create: {
      userId,
      theme: preference.theme,
      defaultFilter: preference.defaultFilter,
    },
  });
  return toStoredPreference(pref);
}
