import { query } from "@/lib/db";
import type { StoredUser } from "@/types/auth";
import type { UserPreference } from "@/types/shared";

// Data access for the users and user_preferences tables (db/migrations/001_init.sql).

export interface StoredPreference extends UserPreference {
  userId: string;
  updatedAt: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

interface PreferenceRow {
  user_id: string;
  theme: UserPreference["theme"];
  default_filter: UserPreference["defaultFilter"];
  updated_at: Date;
}

const USER_COLUMNS = "id, name, email, password_hash, created_at";
const PREFERENCE_COLUMNS = "user_id, theme, default_filter, updated_at";

function toStoredUser(row: UserRow): StoredUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: "student",
    passwordHash: row.password_hash,
    createdAt: row.created_at.toISOString(),
  };
}

function toStoredPreference(row: PreferenceRow): StoredPreference {
  return {
    userId: row.user_id,
    theme: row.theme,
    defaultFilter: row.default_filter,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function findUserByEmail(email: string) {
  const [row] = await query<UserRow>(`SELECT ${USER_COLUMNS} FROM users WHERE email = $1`, [email]);
  return row ? toStoredUser(row) : null;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function findUserById(id: string) {
  // A non-UUID id (e.g. from an old cookie) would make PostgreSQL raise an error, so skip the query.
  if (!UUID_PATTERN.test(id)) {
    return null;
  }
  const [row] = await query<UserRow>(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [id]);
  return row ? toStoredUser(row) : null;
}

/** Returns null when the email is already registered. */
export async function insertUser(user: Omit<StoredUser, "id" | "createdAt" | "role">) {
  const [row] = await query<UserRow>(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING
     RETURNING ${USER_COLUMNS}`,
    [user.name, user.email, user.passwordHash],
  );
  return row ? toStoredUser(row) : null;
}

export async function findPreferenceByUserId(userId: string) {
  const [row] = await query<PreferenceRow>(
    `SELECT ${PREFERENCE_COLUMNS} FROM user_preferences WHERE user_id = $1`,
    [userId],
  );
  return row ? toStoredPreference(row) : null;
}

export async function upsertPreference(userId: string, preference: UserPreference) {
  const [row] = await query<PreferenceRow>(
    `INSERT INTO user_preferences (user_id, theme, default_filter)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id)
     DO UPDATE SET theme = EXCLUDED.theme, default_filter = EXCLUDED.default_filter, updated_at = now()
     RETURNING ${PREFERENCE_COLUMNS}`,
    [userId, preference.theme, preference.defaultFilter],
  );
  return toStoredPreference(row);
}
