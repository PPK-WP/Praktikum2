import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { StoredUser } from "@/types/auth";
import type { UserPreference } from "@/types/shared";

// Lightweight JSON storage until the team picks a database (see PROJEK_WORKFLOW §30).

export interface StoredPreference extends UserPreference {
  userId: string;
  updatedAt: string;
}

interface AuthDatabase {
  users: StoredUser[];
  userPreferences: StoredPreference[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(process.cwd(), "data", "auth.json");
const TEMP_FILE = path.join(process.cwd(), "data", "auth.json.tmp");

let writeQueue: Promise<unknown> = Promise.resolve();

async function readDatabase(): Promise<AuthDatabase> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<AuthDatabase>;
    return { users: parsed.users ?? [], userPreferences: parsed.userPreferences ?? [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { users: [], userPreferences: [] };
    }
    throw error;
  }
}

async function writeDatabase(database: AuthDatabase) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(TEMP_FILE, JSON.stringify(database, null, 2));
  await rename(TEMP_FILE, DATA_FILE);
}

/** Runs read-modify-write updates one at a time so concurrent requests do not overwrite each other. */
function mutate<T>(update: (database: AuthDatabase) => T | Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
    const database = await readDatabase();
    const result = await update(database);
    await writeDatabase(database);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}

export async function findUserByEmail(email: string) {
  const { users } = await readDatabase();
  return users.find((user) => user.email === email) ?? null;
}

export async function findUserById(id: string) {
  const { users } = await readDatabase();
  return users.find((user) => user.id === id) ?? null;
}

/** Returns null when the email is already registered. */
export function insertUser(user: StoredUser) {
  return mutate((database) => {
    if (database.users.some((existing) => existing.email === user.email)) {
      return null;
    }
    database.users.push(user);
    return user;
  });
}

export async function findPreferenceByUserId(userId: string) {
  const { userPreferences } = await readDatabase();
  return userPreferences.find((preference) => preference.userId === userId) ?? null;
}

export function upsertPreference(userId: string, preference: UserPreference) {
  return mutate((database) => {
    const record: StoredPreference = { ...preference, userId, updatedAt: new Date().toISOString() };
    const index = database.userPreferences.findIndex((item) => item.userId === userId);
    if (index === -1) {
      database.userPreferences.push(record);
    } else {
      database.userPreferences[index] = record;
    }
    return record;
  });
}
