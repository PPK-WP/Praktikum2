# Programmer 2

## 1. Role

Programmer 2 bertanggung jawab pada domain transaksi keuangan dan pengamanan akses data. Fokusnya adalah mengimplementasikan fitur CRUD transaksi, filter, dan validasi yang mengikat transaksi kepada user yang sedang login.

## 2. Responsibility

- membuat model transaksi dan validasi input;
- mengimplementasikan tambah, lihat, ubah, dan hapus transaksi;
- membangun filter berdasarkan jenis pemasukan atau pengeluaran;
- memastikan authorization: user hanya mengakses transaksi miliknya sendiri;
- menyediakan data transaksi yang konsisten untuk dashboard.

## 3. Assigned Requirements

- FR-006: menambahkan transaksi
- FR-007: melihat transaksi
- FR-008: mengubah transaksi
- FR-009: menghapus transaksi
- FR-010: memfilter transaksi
- FR-012: authorization per-user
- FR-013: update data keuangan setelah perubahan transaksi

## 4. Assigned Modules

- Transaction Management
- Authorization & Data Isolation
- Transaction Filtering

## 5. Assigned Sub-modules

- transaction model
- create form
- transaction list view
- edit flow
- delete flow
- filter by type
- access-control middleware per transaction

## 6. Assigned Tasks

- TASK-TRX-001: Build create transaction form and validation
- TASK-TRX-002: Build transaction list view with user-specific query
- TASK-TRX-003: Implement edit transaction flow
- TASK-TRX-004: Implement delete transaction action
- TASK-TRX-005: Add filter by income or expense
- TASK-TRX-006: Enforce user_id ownership checks on every transaction action
- TASK-TRX-007: Define transaction API contract and response payload

## 7. Task Dependencies

- TASK-TRX-001 dan TASK-TRX-002 bergantung pada user session contract dari P1.
- TASK-TRX-006 bergantung pada auth guard dan user identity data.
- TASK-TRX-007 harus disepakati dahulu agar P3 dapat menggunakan transaksi summary.
- P2 harus menunggu kontrak autentikasi minimal selesai sebelum memulai akses data bersifat user-based.

## 8. API Responsibility

- GET /api/transactions
- POST /api/transactions
- PUT /api/transactions/:id
- DELETE /api/transactions/:id
- Filter parameter: ?type=income|expense

P2 adalah producer utama untuk API transaksi dan consumer utama terhadap session user context.

## 9. Database Responsibility

- transactions table
- user_id foreign key / owner mapping
- validasi tipe transaksi: income atau expense
- metadata tanggal, nominal, deskripsi, dan created/updated timestamp

P2 tidak boleh mengubah schema user atau auth tanpa persetujuan P1.

## 10. Folder Ownership

```text
src/features/transactions/
src/services/transactions.ts
src/lib/transaction/
src/app/api/transactions/
src/components/transaction/
src/types/transaction.ts
```

## 11. File Ownership

- transaction form UI: P2
- list table and filter: P2
- edit modal/form: P2
- delete confirmation and action: P2
- transaction validation utilities: P2
- authorization helper per transaction: P2

## 12. Shared Files

- src/types/shared.ts: P1 owner, consumed by P2
- src/lib/utils.ts: P1 owner, consumed by P2
- src/app/layout.tsx: P1 owner
- src/app/globals.css: P1 owner

Seluruh perubahan pada shared files harus mendapat koordinasi sebelum dilakukan.

## 13. Git Branch

- feature/p2/transaction

## 14. Commit Convention

- feat: add transaction form
- feat: implement transaction filter
- fix: enforce user ownership check
- refactor: simplify transaction API
- test: add transaction validation tests

## 15. Development Sequence

1. definisikan transaction contract dan model;
2. bangun form create transaction;
3. tambah API create dan list data per user;
4. implementasikan edit dan delete;
5. tambahkan filter oleh tipe transaksi;
6. terapkan authorization user_id pada semua operasi;
7. uji fungsi CRUD dan data milik user sendiri.

## 16. Testing Checklist

- transaksi dapat ditambahkan dengan valid input
- transaksi gagal jika nominal tidak valid
- user dapat melihat daftar transaksi miliknya saja
- user tidak bisa mengubah transaksi pengguna lain
- filter income dan expense bekerja dengan benar
- delete transaction berhasil dan data benar-benar hilang
- saldo/dashboard ter-update setelah perubahan transaksi

## 17. Integration Instructions

- P2 mengintegrasikan setelah P1 menyelesaikan auth/session contract.
- semua endpoint transaksi harus mengharuskan user login valid.
- apabila ada perubahan schema atau contract yang berdampak ke P3, update harus diinformasikan lebih awal.
- merge ke baseline hanya setelah smoke test CRUD selesai.

## 18. Restrictions

- tidak mengubah data user atau auth milik P1 tanpa persetujuan;
- tidak boleh menambahkan transaksi yang tidak terikat ke user login;
- jangan menulis logic dashboard ke module transaksi yang seharusnya dikerjakan P3;
- semua perubahan yang mempengaruhi shared contract harus melalui review.

## 19. Definition of Done

- CRUD transaksi berjalan untuk user yang login;
- authorization per user terpasang pada semua operasi;
- filter income/expense berfungsi;
- data transaksi siap digunakan oleh dashboard;
- PR review dan smoke test untuk transaction module telah selesai.
