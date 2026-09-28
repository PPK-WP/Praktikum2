// Runs `prisma migrate deploy`, first upgrading databases created by the old pg setup
// (db/migrations/001_init.sql + scripts/migrate.mjs). Those already have users, transactions
// and user_preferences but no _prisma_migrations, so Prisma refuses them (P3005).
//
// Upgrade: park the old tables in the "legacy_pg" schema, let Prisma create its own tables,
// copy the rows back, then drop "legacy_pg". Each step can be re-run if a previous start died halfway.
import { execFileSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const LEGACY_SCHEMA = "legacy_pg";
const LEGACY_TABLES = ["users", "transactions", "user_preferences", "schema_migrations"];

const prisma = new PrismaClient();

async function exists(regclass: string) {
  const [row] = await prisma.$queryRaw<{ found: boolean }[]>`SELECT to_regclass(${regclass}) IS NOT NULL AS found`;
  return row.found;
}

async function parkLegacyTables() {
  const isLegacy = (await exists("public.schema_migrations")) && !(await exists("public._prisma_migrations"));
  if (!isLegacy) return;

  console.log(`Database lama (pg) terdeteksi, tabelnya dipindah sementara ke schema "${LEGACY_SCHEMA}".`);
  await prisma.$transaction([
    prisma.$executeRawUnsafe(`CREATE SCHEMA "${LEGACY_SCHEMA}"`),
    ...LEGACY_TABLES.map((table) => prisma.$executeRawUnsafe(`ALTER TABLE public."${table}" SET SCHEMA "${LEGACY_SCHEMA}"`)),
  ]);
}

async function restoreLegacyRows() {
  if (!(await exists(`${LEGACY_SCHEMA}.users`))) return;

  // Old columns were VARCHAR + CHECK; Prisma uses enums, hence the casts.
  await prisma.$transaction([
    prisma.$executeRawUnsafe(`
      INSERT INTO public.users (id, name, email, password_hash, created_at)
      SELECT id, name, email, password_hash, created_at FROM "${LEGACY_SCHEMA}".users`),
    prisma.$executeRawUnsafe(`
      INSERT INTO public.transactions (id, user_id, type, amount, description, date, created_at, updated_at)
      SELECT id, user_id, type::"TransactionType", amount, description, date, created_at, updated_at
      FROM "${LEGACY_SCHEMA}".transactions`),
    prisma.$executeRawUnsafe(`
      INSERT INTO public.user_preferences (id, user_id, theme, default_filter, updated_at)
      SELECT id, user_id, theme::"Theme", default_filter::"DefaultFilter", updated_at
      FROM "${LEGACY_SCHEMA}".user_preferences`),
    prisma.$executeRawUnsafe(`DROP SCHEMA "${LEGACY_SCHEMA}" CASCADE`),
  ]);
  console.log("Data dari database lama berhasil dipindahkan ke tabel Prisma.");
}

async function main() {
  await parkLegacyTables();
  execFileSync("npx", ["prisma", "migrate", "deploy"], { stdio: "inherit" });
  await restoreLegacyRows();
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
