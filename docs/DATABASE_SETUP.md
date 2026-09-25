# Setup Database PostgreSQL

Aplikasi memakai **PostgreSQL** (skema dari PROJEK_WORKFLOW §20). Pilih salah satu cara di bawah.

| Cara | Cocok untuk | Yang perlu di-install |
| --- | --- | --- |
| A. Docker penuh | Menjalankan aplikasi + database sekaligus | Docker Desktop |
| B. Docker hanya database | Coding sehari-hari dengan `npm run dev` | Docker Desktop, Node.js 22 |
| C. Windows native | Tanpa Docker sama sekali | Node.js 22, PostgreSQL 17 |

Skema dibuat oleh `npm run db:migrate`, yang menjalankan file di `db/migrations/` satu kali saja.
Aman dijalankan berulang kali. Di Docker (cara A) perintah ini jalan otomatis saat container start.

## Isi file environment

Semua cara memakai nilai dari [.env.example](../.env.example):

- `.env.local` dibaca oleh `npm run dev`, `npm start`, dan `npm run db:migrate`.
- `.env` dibaca oleh `docker compose`.

`AUTH_SECRET` wajib diisi untuk `npm start` dan Docker. Buat nilai acak:

```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Max 256 }))
```

```bash
# Linux / macOS / Git Bash
openssl rand -base64 32
```

## A. Docker penuh (aplikasi + database)

```powershell
Copy-Item .env.example .env      # Linux/macOS: cp .env.example .env
# isi AUTH_SECRET di .env
docker compose up -d --build
```

Buka http://localhost:3000. Database bisa diakses dari luar Docker di `localhost:5433`.

```powershell
docker compose logs -f app       # lihat log aplikasi
docker compose down              # berhenti (data tetap ada)
docker compose down -v           # berhenti dan HAPUS semua data database
```

## B. Docker hanya database, aplikasi di laptop

```powershell
Copy-Item .env.example .env.local
docker compose up -d db
npm install
npm run db:migrate
npm run dev
```

`DATABASE_URL` bawaan di `.env.example` sudah mengarah ke `localhost:5433`, jadi tidak perlu diubah.

## C. Windows native (tanpa Docker)

1. Install Node.js 22 LTS dan PostgreSQL 17 (PowerShell sebagai Administrator):

   ```powershell
   winget install OpenJS.NodeJS.LTS
   winget install PostgreSQL.PostgreSQL.17
   ```

   Atau unduh installer dari nodejs.org dan postgresql.org/download/windows. Saat install
   PostgreSQL, **catat password user `postgres`** dan biarkan port **5432**.

2. Buat database (atau lewat pgAdmin: klik kanan *Databases* → *Create* → `expense_tracker`):

   ```powershell
   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE expense_tracker;"
   ```

3. Buat `.env.local` dan ubah `DATABASE_URL` ke port 5432 dengan password milikmu:

   ```powershell
   Copy-Item .env.example .env.local
   notepad .env.local
   ```

   ```env
   DATABASE_URL=postgres://postgres:PASSWORD_KAMU@localhost:5432/expense_tracker
   ```

   Jika password berisi karakter khusus, tulis dalam bentuk URL-encoded (`@` → `%40`, `#` → `%23`, `:` → `%3A`).

4. Jalankan:

   ```powershell
   npm install
   npm run db:migrate
   npm run dev
   ```

## Masalah yang sering muncul

| Pesan | Penyebab dan solusi |
| --- | --- |
| `DATABASE_URL belum diisi` | File `.env.local` belum dibuat atau `DATABASE_URL` kosong. |
| `ECONNREFUSED 127.0.0.1:5433` / `:5432` | Database belum jalan. Docker: `docker compose up -d db`. Windows: buka *Services* → nyalakan `postgresql-x64-17`. |
| `password authentication failed` | Password di `DATABASE_URL` salah, atau belum di-URL-encode. |
| `database "expense_tracker" does not exist` | Jalankan langkah C.2 untuk membuat database. |
| `port is already allocated` saat `docker compose up` | Port 5433/3000 dipakai program lain. Ubah `DB_PORT` / `APP_PORT` di `.env`. |
| `AUTH_SECRET must be set in production` | Isi `AUTH_SECRET` di `.env` (Docker) atau `.env.local` (`npm start`). |

## Menambah tabel atau kolom

Jangan ubah `001_init.sql` yang sudah dijalankan. Buat file baru dengan nomor berikutnya,
misalnya `db/migrations/002_add_category.sql`, lalu jalankan `npm run db:migrate`.
Sesuai PROJEK_WORKFLOW §20, perubahan tabel `transactions` harus disetujui P2, dan perubahan
`users` / `user_preferences` harus lewat P1.

Untuk query di kode server, pakai helper bersama:

```ts
import { query } from "@/lib/db";

const rows = await query<{ id: string }>("SELECT id FROM transactions WHERE user_id = $1", [user.id]);
```

Selalu kirim input pengguna lewat parameter `$1, $2, ...`, jangan digabung ke string SQL.
