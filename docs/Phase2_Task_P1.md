# Fase 2 - Programmer 1 (Backend & Database Core)

## Role & Tugas

Kamu adalah Programmer 1. Tugasmu adalah membangun fondasi backend untuk fitur "Budget Bulanan". Pekerjaanmu sangat terisolasi di sisi server (Database & API) agar tidak konflik dengan programmer frontend.

## Software Requirements Specification (SRS) - Mandiri P1

- **SRS-201**: Sistem harus memiliki tabel database `budgets` untuk menyimpan data budget bulanan per user (terdiri dari field: id, user_id, month, amount, created_at, updated_at).
- **SRS-202**: Sistem harus memiliki _Service Layer_ yang mengabstraksi logika bisnis CRUD (Create, Read, Update, Delete) untuk data budget bulanan.
- **SRS-203**: Sistem harus menyediakan endpoint API JSON (RESTful) untuk manajemen budget yang diamankan dengan validasi _session_ login pengguna.
- **SRS-204**: Data budget bersifat terisolasi per-user (Authorization); seluruh operasi backend wajib mengecek dan mengikat data berdasarkan `user_id` milik _session_ yang sedang aktif.

## File Ownership (Hanya Boleh Edit File Ini)

1. `prisma/schema.prisma` (Tambah model Budget)
2. `src/types/budget.ts` (Buat baru: interface/type contract)
3. `src/services/budget.ts` (Buat baru: business logic)
4. `src/app/api/budgets/route.ts` (Buat baru: API handler GET & POST)
5. `src/app/api/budgets/[id]/route.ts` (Buat baru: API handler PUT & DELETE)

---

## Prompt untuk Programmer 1 (Copas ini ke AI P1)

Kamu adalah Programmer 1. Kita sedang berada di Fase 2 pengembangan Expense Tracker. Tugasmu adalah memenuhi SRS-201 hingga SRS-204 dengan membuat sistem Backend untuk fitur "Budget Bulanan".

Berikut spesifikasi pekerjaanmu:

1. Update `prisma/schema.prisma` dengan menambahkan model `Budget`. Kolomnya: id (UUID), user_id (relasi ke User), month (String format YYYY-MM), amount (Decimal/Float), created_at, updated_at (Tugas SRS-201). Jalankan `npx prisma db push` setelahnya.
2. Buat `src/types/budget.ts` yang berisi interface `Budget` dan `BudgetInput` agar menjadi kontrak tipe data untuk programmer lain.
3. Buat `src/services/budget.ts` berisi fungsi CRUD (getBudget, createBudget, updateBudget, deleteBudget). Pastikan setiap operasi memvalidasi kepemilikan data berdasarkan `user_id` agar data terisolasi (Tugas SRS-202 & SRS-204).
4. Buat route API di `src/app/api/budgets/route.ts` (GET & POST) dan `src/app/api/budgets/[id]/route.ts` (PUT & DELETE). Endpoint ini harus memvalidasi session login terlebih dahulu sebelum memanggil service (Tugas SRS-203).

Kerjakan dengan teliti. DILARANG mengedit file UI/Components apapun agar tidak terjadi konflik dengan Programmer 2 dan 3.
