import { Pool, type QueryResultRow } from "pg";

// Shared PostgreSQL pool (primary owner P1). Reused across hot reloads in development.

const globalForDb = globalThis as unknown as { pgPool?: Pool };

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.");
  }
  return new Pool({ connectionString, max: 10 });
}

function getPool() {
  globalForDb.pgPool ??= createPool();
  return globalForDb.pgPool;
}

/** Runs a parameterized query. Always pass user input through `params`, never string concatenation. */
export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}
