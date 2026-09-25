# Expense Tracker

Aplikasi pencatat pemasukan dan pengeluaran untuk mahasiswa. Dibangun dengan Next.js 16 dan PostgreSQL.

## Menjalankan

Cara tercepat (butuh Docker Desktop):

```bash
cp .env.example .env    # PowerShell: Copy-Item .env.example .env
# isi AUTH_SECRET di .env
docker compose up -d --build
```

Lalu buka http://localhost:3000.

Untuk `npm run dev` atau setup Windows tanpa Docker, lihat [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md).

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server development |
| `npm run db:migrate` | Membuat / memperbarui tabel database |
| `npm run build` lalu `npm start` | Server production |
| `npm run lint` | Cek kode |

## Dokumen

- [docs/PROJEK_WORKFLOW.md](docs/PROJEK_WORKFLOW.md): SRS dan alur kerja tim
- [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md): setup PostgreSQL (Docker dan Windows)
- [docs/AUTH_CONTRACT.md](docs/AUTH_CONTRACT.md): cara memakai login, session, dan preferensi
