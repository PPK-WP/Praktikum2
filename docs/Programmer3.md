# Programmer 3

## 1. Role

Programmer 3 bertanggung jawab pada domain dashboard, ringkasan kondisi keuangan, dan tampilan transaksi terbaru. Fokus utama adalah menghasilkan informasi saldo, total pemasukan, total pengeluaran, dan ringkasan yang konsisten berdasarkan data milik pengguna yang sedang login.

## 2. Responsibility

- membangun dashboard utama untuk mahasiswa;
- menghitung saldo, total pemasukan, dan total pengeluaran;
- menampilkan transaksi terbaru dan ringkasan finansial;
- memastikan dashboard hanya menampilkan data dari user aktif;
- menyediakan data dan UI yang konsisten untuk penggunaan lanjutan.

## 3. Assigned Requirements

- FR-005: dashboard menampilkan nama, saldo, total pemasukan, total pengeluaran, dan transaksi terbaru
- FR-013: informasi keuangan diperbarui setelah transaksi berubah

## 4. Assigned Modules

- Dashboard & Reporting
- Summary Calculation
- Recent Transaction View

## 5. Assigned Sub-modules

- summary card balance
- income total calculation
- expense total calculation
- recent transaction list
- dashboard refresh logic after CRUD
- empty state and fallback view

## 6. Assigned Tasks

- TASK-DASH-001: Build dashboard layout and summary cards
- TASK-DASH-002: Calculate total income from user transactions
- TASK-DASH-003: Calculate total expense from user transactions
- TASK-DASH-004: Calculate current balance = income - expense
- TASK-DASH-005: Display recent transactions for current user
- TASK-DASH-006: Integrate dashboard with transaction API and filters
- TASK-DASH-007: Refresh summary after add, edit, or delete transaction

## 7. Task Dependencies

- TASK-DASH-001 sampai TASK-DASH-007 bergantung pada user context dan transaction contract yang disediakan oleh P1 dan P2.
- P3 tidak boleh mengerjakan perhitungan final sebelum API summary dan data list transaksi siap dikonsumsi.
- Jika terjadi perubahan di transaction payload, P3 harus menyesuaikan dashboard secara cepat melalui contract review.

## 8. API Responsibility

- GET /api/auth/session
- GET /api/transactions
- GET /api/dashboard/summary

P3 adalah consumer utama untuk data transaksi milik user dan penanggung jawab endpoint summary dashboard.

## 9. Database Responsibility

- read-only access terhadap transaksi milik user aktif
- akses pada summary aggregation sesuai kebutuhan dashboard
- tidak mengubah schema user atau schema transaksi tanpa koordinasi dari P1/P2

P3 fokus pada query dan presentasi, bukan perubahan data utama.

## 10. Folder Ownership

```text
src/features/dashboard/
src/components/dashboard/
src/services/dashboard.ts
src/lib/dashboard/
src/app/(dashboard)/
src/types/dashboard.ts
```

## 11. File Ownership

- dashboard layout: P3
- balance card: P3
- income and expense summary cards: P3
- recent transaction list: P3
- dashboard refresh helper: P3
- summary type definitions: P3

## 12. Shared Files

- src/types/shared.ts: major contract, owner P1
- src/lib/utils.ts: owner P1
- src/app/layout.tsx: owner P1
- src/app/globals.css: owner P1

P3 hanya boleh mengambil data dari shared contract dan tidak boleh merusak struktur umum UI.

## 13. Git Branch

- feature/p3/reporting

## 14. Commit Convention

- feat: add dashboard summary
- feat: render recent transactions
- fix: refresh totals after delete
- refactor: simplify dashboard data flow
- test: dashboard calculation check

## 15. Development Sequence

1. ambil session user aktif;
2. konsumsi data transaksi milik user dari P2;
3. bangun layout dashboard dan summary cards;
4. hitung saldo, total pemasukan, dan total pengeluaran;
5. tampilkan transaksi terbaru;
6. integrasikan refresh otomatis setelah perubahan transaksi;
7. uji empty state dan final summary.

## 16. Testing Checklist

- nama pengguna muncul di dashboard
- saldo dihitung dengan benar
- total pemasukan sesuai transaksi income
- total pengeluaran sesuai transaksi expense
- transaksi terbaru ditampilkan urut waktu terbaru
- dashboard tidak menampilkan data pengguna lain
- summary berubah setelah add, edit, atau delete transaksi

## 17. Integration Instructions

- P3 melakukan integrasi setelah P2 menyelesaikan transaksi contract dan P1 session berfungsi.
- semua dashboard summary harus dibangun berdasarkan user_id aktif.
- jika ada perubahan data payload, review harus dilakukan bersama P2 dan P1.
- merge ke baseline setelah dashboard menampilkan data real dengan validasi.

## 18. Restrictions

- tidak mengubah logic transaksi atau auth tanpa koordinasi;
- tidak menambahkan schema baru yang memengaruhi user atau transactions tanpa review;
- tidak menampilkan data milik pengguna lain;
- tidak mengubah layout global yang dimiliki P1.

## 19. Definition of Done

- dashboard menampilkan semua ringkasan yang diminta;
- saldo, pemasukan, dan pengeluaran akurat sesuai transaksi logged-in user;
- recent transactions tampil dengan urutan benar;
- update otomatis terjadi setelah perubahan data transaksi;
- PR siap review dan merge ke baseline.
