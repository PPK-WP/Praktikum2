// Applies db/migrations/*.sql in filename order, once each. Cross-platform: `npm run db:migrate`.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import nextEnv from "@next/env";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL belum diisi. Salin .env.example ke .env.local lalu isi nilainya.");
  process.exit(1);
}

const migrationsDir = path.join(process.cwd(), "db", "migrations");
const client = new pg.Client({ connectionString });

try {
  await client.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const { rows } = await client.query("SELECT name FROM schema_migrations");
  const applied = new Set(rows.map((row) => row.name));
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`Migration ${file} gagal: ${error.message}`, { cause: error });
    }
    console.log(`✓ ${file}`);
    count += 1;
  }

  console.log(count ? `${count} migration dijalankan.` : "Database sudah versi terbaru.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
