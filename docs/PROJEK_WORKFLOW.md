# Project Workflow

## 1. Project Overview

Aplikasi web Expense Tracker adalah sistem manajemen keuangan pribadi yang dirancang untuk mahasiswa. Tujuan utamanya adalah membantu pengguna mencatat pemasukan dan pengeluaran, memantau saldo, serta memahami kondisi keuangan berdasarkan data transaksi yang tersimpan secara personal dan aman.

Aplikasi ini dibangun dengan pendekatan multi-user, di mana setiap akun hanya dapat melihat dan mengelola datanya sendiri. Sistem juga harus menjaga sesi login selama session masih berlaku, memberlakukan autentikasi pada halaman yang membutuhkan akses, dan menyimpan minimal satu preferensi pengguna melalui cookies.

## 2. Problem Statement

Mahasiswa sering mencatat pengeluaran dan pemasukan secara manual melalui catatan, spreadsheet, atau bahkan di luar sistem. Kondisi ini menimbulkan beberapa masalah:

- data keuangan tidak terstruktur dan sulit dilacak;
- tidak ada ringkasan otomatis mengenai saldo, total pemasukan, dan total pengeluaran;
- proses pencatatan transaksi bersifat manual dan rawan kesalahan;
- tidak ada sistem yang memisahkan data antar pengguna;
- keamanan session dan akses data pribadi belum terjamin;
- preferensi pengguna seperti tema atau pengaturan tampilan tidak konsisten dipertahankan.

### Problem

- Mahasiswa kesulitan memantau arus kas pribadi.
- Tidak ada satu tempat yang aman untuk menyimpan transaksi.
- Data transaksi antar pengguna dapat bercampur jika tidak diberlakukan authorization.
- Proses login dan session belum terkelola secara terstruktur.

### Proposed Solution

Sistem Expense Tracker menyediakan:

- akun dan login berbasis email dan password;
- pembatasan akses per user untuk transaksi dan dashboard;
- sesi autentikasi yang aman dan halaman yang dilindungi;
- dashboard ringkas dengan saldo, total pemasukan, total pengeluaran, dan transaksi terbaru;
- fitur CRUD transaksi untuk pemasukan dan pengeluaran;
- filter transaksi berdasarkan jenis;
- penyimpanan preferensi pengguna menggunakan cookies;
- alur kerja kolaboratif yang memungkinkan tiga programmer mengerjakan modul yang berbeda secara paralel.

## 3. System Objective

Sistem ini bertujuan untuk:

1. memudahkan mahasiswa mencatat transaksi keuangan pribadi;
2. memperlihatkan kondisi keuangan secara cepat dan jelas;
3. menjaga keamanan data transaksi per pengguna;
4. memastikan pengalaman penggunaan yang sederhana, aman, dan konsisten;
5. memberikan struktur pengembangan yang memungkinkan parallel development dengan pembagian domain yang jelas.

## 4. Actors

- Guest / User yang belum login
- Mahasiswa / User yang sudah login
- Authentication System
- Session Manager
- Cookie Preference Manager

## 5. System Scope

### In Scope

- registrasi akun mahasiswa;
- login dan logout;
- session management;
- page protection untuk route yang memerlukan autentikasi;
- CRUD transaksi;
- filter transaksi berdasarkan jenis;
- dashboard dengan ringkasan saldo dan total;
- akses data hanya untuk pengguna yang sedang login;
- penyimpanan preferensi pengguna melalui cookies.

### Out of Scope

- multi-role admin atau manager;
- sistem pembayaran atau integrasi bank;
- kategori transaksi yang sangat kompleks;
- analytics lanjutan, forecasting, atau laporan ekspor PDF.

## 6. Functional Requirements

| ID | Requirement | Actor | Priority |
| --- | --- | --- | --- |
| FR-001 | Pengguna dapat mendaftar akun dengan nama, email, dan password. | Guest | High |
| FR-002 | Pengguna dapat masuk ke aplikasi menggunakan email dan password. | Guest | High |
| FR-003 | Sistem harus menyimpan session pengguna selama session masih berlaku. | Mahasiswa | High |
| FR-004 | Pengguna dapat keluar dari aplikasi dan mengakhiri session. | Mahasiswa | High |
| FR-005 | Dashboard menampilkan nama pengguna, saldo, total pemasukan, total pengeluaran, dan transaksi terbaru. | Mahasiswa | High |
| FR-006 | Pengguna dapat menambahkan transaksi baru. | Mahasiswa | High |
| FR-007 | Pengguna dapat melihat daftar transaksi miliknya. | Mahasiswa | High |
| FR-008 | Pengguna dapat mengubah data transaksi yang sudah ada. | Mahasiswa | High |
| FR-009 | Pengguna dapat menghapus transaksi miliknya. | Mahasiswa | High |
| FR-010 | Pengguna dapat memfilter transaksi berdasarkan jenis pemasukan atau pengeluaran. | Mahasiswa | High |
| FR-011 | Sistem harus menyimpan minimal satu preferensi pengguna melalui cookies. | Mahasiswa | Medium |
| FR-012 | Pengguna hanya dapat mengakses dan mengelola transaksi miliknya sendiri. | Mahasiswa | High |
| FR-013 | Sistem menampilkan informasi keuangan yang diperbarui secara real-time setelah transaksi ditambah atau diubah. | Mahasiswa | High |

## 7. Non-Functional Requirements

| ID | Requirement | Category |
| --- | --- | --- |
| NFR-001 | Sistem harus mengamankan session dan membatasi akses ke halaman yang memerlukan autentikasi. | Security |
| NFR-002 | Antarmuka harus mudah digunakan oleh mahasiswa dengan alur yang jelas. | Usability |
| NFR-003 | Aplikasi harus menampilkan data ringkasan dan transaksi dengan waktu respon yang cepat untuk dataset kecil-menengah. | Performance |
| NFR-004 | Data transaksi harus konsisten dan tidak berubah tanpa validasi. | Reliability |
| NFR-005 | Struktur kode harus mudah dipelihara agar dapat dikembangkan lebih lanjut oleh tim. | Maintainability |
| NFR-006 | Sistem harus dapat menangani penambahan data tanpa menurunkan performa signifikan. | Scalability |

## 8. Requirement Traceability

| Requirement | Module | Sub-module | Task | Owner |
| --- | --- | --- | --- | --- |
| FR-001 | Authentication | Register | Register form + validation | P1 |
| FR-002 | Authentication | Login | Login form + validation | P1 |
| FR-003 | Authentication | Session | Session persistence and route guard | P1 |
| FR-004 | Authentication | Logout | End session + redirect | P1 |
| FR-005 | Dashboard | Summary | Balance and totals cards | P3 |
| FR-006 | Transaction | Create transaction | Add form + create API | P2 |
| FR-007 | Transaction | List transaction | Transaction table + fetch | P2 |
| FR-008 | Transaction | Update transaction | Edit form + update API | P2 |
| FR-009 | Transaction | Delete transaction | Delete action + confirmation | P2 |
| FR-010 | Transaction | Filter | Type filter UI + query filter | P2 |
| FR-011 | Preferences | Cookies | Save/read user preference | P1 |
| FR-012 | Authorization | Data isolation | Owner check on all transaction operations | P2 |
| FR-013 | Dashboard | Real-time summary | Recalculate totals after changes | P3 |

## 9. System Modules

### 1. Authentication & Session
- Tujuan: menangani registrasi, login, session, logout, dan protected route.
- Requirement terkait: FR-001, FR-002, FR-003, FR-004, FR-012.
- Aktor: Guest, Mahasiswa.
- Input: nama, email, password, session cookie.
- Output: akses masuk, redirect ke dashboard, session aktif.
- Dependency: membutuhkan data user yang aman dan schema auth.
- Data yang digunakan: users.
- Programmer owner: P1.

### 2. Transaction Management
- Tujuan: mencatat, melihat, mengubah, dan menghapus transaksi personal.
- Requirement terkait: FR-006, FR-007, FR-008, FR-009, FR-010, FR-012.
- Aktor: Mahasiswa.
- Input: judul transaksi, nominal, tipe (income/expense), tanggal, deskripsi.
- Output: transaksi tersimpan, list transaksi, hasil filter.
- Dependency: bergantung pada contract user dan transaction schema.
- Data yang digunakan: transactions.
- Programmer owner: P2.

### 3. Dashboard & Reporting
- Tujuan: menampilkan ringkasan kondisi keuangan pengguna.
- Requirement terkait: FR-005, FR-013.
- Aktor: Mahasiswa.
- Input: data transaksi milik user.
- Output: saldo, total pemasukan, total pengeluaran, transaksi terbaru.
- Dependency: bergantung pada API summary dan data transaksi milik user.
- Data yang digunakan: users + transactions.
- Programmer owner: P3.

### 4. Preferences & Cookies
- Tujuan: mempertahankan preferensi pengguna seperti tema, urutan tampilan, atau pengaturan default.
- Requirement terkait: FR-011.
- Aktor: Mahasiswa.
- Input: preferensi pengguna.
- Output: preferensi yang dibaca saat reload halaman.
- Dependency: tidak boleh memengaruhi data transaksi inti.
- Data yang digunakan: cookie storage dan preference metadata.
- Programmer owner: P1.

## 10. Module Decomposition

### Authentication
- Register form
- Login form
- Password validation
- Session persistence
- Protected route guard
- Logout action

### Transaction Management
- Transaction model and validation
- Add transaction form
- Transaction list page
- Edit transaction flow
- Delete transaction flow
- Type filter
- User ownership check

### Dashboard & Reporting
- Summary cards
- Balance calculation
- Income summary
- Expense summary
- Recent transactions list
- Empty state handling
- Recalculate totals after update

### Preferences & Cookies
- Read cookie preference
- Save preference on user action
- Apply preference to UI
- Fallback default value

## 11. System Architecture

Aplikasi akan menggunakan arsitektur Next.js yang memisahkan concern sebagai berikut:

- Frontend: UI halaman login, register, dashboard, transaksi
- Route/API layer: endpoint autentikasi dan transaksi
- Service layer: logika bisnis dan validasi
- Data layer: schema user, transaction, dan preference
- Session/cookie layer: autentikasi dan preferensi pengguna

Secara konseptual:

Client UI
  -> API / Server Actions
  -> Validation
  -> Database / Storage
  -> Response to UI

Authorization dan session diperlakukan secara sentral agar semua route dan operasi data protected.

## 12. Dependency Graph

```text
Authentication API
      │
      ├──> Session + Protect Route
      │
      └──> User context

Transaction API
      │
      ├──> Create / Read / Update / Delete
      │
      └──> Authorization by user_id

Dashboard Summary
      │
      └──> Uses Transaction API + User Context

Preference Cookie
      │
      └──> Used by App UI initialization
```

Untuk menjaga paralelism:

- P1 menyiapkan kontrak autentikasi dan user context terlebih dahulu.
- P2 mengenalkan model transaksi dan API dasar.
- P3 menggunakan data transaksi dari contract yang sudah disepakati.

## 13. Team Structure

- Programmer 1 (P1): Authentication, Session, User Preferences, Shared Guard
- Programmer 2 (P2): Transaction CRUD, Filter, Authorization Data Access
- Programmer 3 (P3): Dashboard Summary, Recent Transactions, Total Calculation

## 14. Requirement Ownership

| Requirement | Owner |
| --- | --- |
| FR-001 | P1 |
| FR-002 | P1 |
| FR-003 | P1 |
| FR-004 | P1 |
| FR-005 | P3 |
| FR-006 | P2 |
| FR-007 | P2 |
| FR-008 | P2 |
| FR-009 | P2 |
| FR-010 | P2 |
| FR-011 | P1 |
| FR-012 | P2 |
| FR-013 | P3 |

## 15. Module Ownership

| Module | Primary Owner |
| --- | --- |
| Authentication & Session | P1 |
| Transaction Management | P2 |
| Dashboard & Reporting | P3 |
| Preferences & Cookies | P1 |
| Authorization & Data Isolation | P2 |

## 16. Task Ownership

| Task ID | Task | Owner | Dependency |
| --- | --- | --- | --- |
| TASK-AUTH-001 | Register form UI and validation | P1 | None |
| TASK-AUTH-002 | Login form UI and validation | P1 | None |
| TASK-AUTH-003 | Session persistence and protected route | P1 | Auth contract |
| TASK-AUTH-004 | Logout and redirect | P1 | Session contract |
| TASK-AUTH-005 | Cookie preference read/write | P1 | Shared preference contract |
| TASK-TRX-001 | Transaction form create | P2 | User context contract |
| TASK-TRX-002 | Transaction list and fetch | P2 | User context contract |
| TASK-TRX-003 | Edit transaction flow | P2 | Transaction contract |
| TASK-TRX-004 | Delete transaction flow | P2 | Transaction contract |
| TASK-TRX-005 | Filter by income/expense | P2 | Transaction contract |
| TASK-TRX-006 | Authorization check by user_id | P2 | Auth contract |
| TASK-DASH-001 | Balance summary cards | P3 | Transaction summary contract |
| TASK-DASH-002 | Income and expense totals | P3 | Transaction summary contract |
| TASK-DASH-003 | Recent transactions list | P3 | Transaction list contract |
| TASK-DASH-004 | Recalculation after CRUD change | P3 | Update + summary contract |

## 17. Folder Ownership

```text
src/
├── app/
│   ├── (auth)/               # P1
│   ├── (dashboard)/          # P3
│   └── api/
│       ├── auth/             # P1
│       ├── transactions/     # P2
│       └── dashboard/        # P3
├── features/
│   ├── auth/                 # P1
│   ├── transactions/         # P2
│   ├── dashboard/            # P3
│   └── preferences/          # P1
├── components/
│   ├── auth/                 # P1
│   ├── transaction/          # P2
│   └── dashboard/            # P3
├── lib/
│   ├── auth/                 # P1
│   ├── transaction/          # P2
│   ├── dashboard/            # P3
│   └── utils/                # Shared, primary owner P1
├── types/
│   ├── auth.ts               # P1
│   ├── transaction.ts        # P2
│   ├── dashboard.ts          # P3
│   └── shared.ts             # P1
├── services/
│   ├── auth.ts               # P1
│   ├── transactions.ts       # P2
│   └── dashboard.ts          # P3
└── middleware.ts             # P1
```

## 18. Shared Files

| File / Area | Primary Owner | Allowed Mutations | Rule |
| --- | --- | --- | --- |
| package.json | P1 | P1 only | P2/P3 hanya menggunakan dependency yang sudah disetujui |
| tsconfig.json | P1 | P1 only | perubahan konfigurasi harus melalui review |
| src/types/shared.ts | P1 | P1 | semua contract dasar harus didefinisikan di sini |
| src/lib/utils.ts | P1 | P1 | fungsi umum hanya ditambah jika benar-benar shared |
| src/app/layout.tsx | P1 | P1 | layout umum harus tetap stabil |
| src/app/globals.css | P1 | P1 | style global hanya diubah oleh owner utama |
| database schema | P1 | P1 + approved changes | semua perubahan harus melalui dokumentasi dan koordinasi |

## 19. API Contract

### Authentication

| Endpoint | Method | Request | Response | Producer | Consumer |
| --- | --- | --- | --- | --- | --- |
| /api/auth/register | POST | { name, email, password } | { user, token? } | P1 | P1 |
| /api/auth/login | POST | { email, password } | { user, session } | P1 | P1 |
| /api/auth/logout | POST | {} | { success } | P1 | P1 |
| /api/auth/session | GET | {} | { user } or 401 | P1 | P1, P2, P3 |

### Transactions

| Endpoint | Method | Request | Response | Producer | Consumer |
| --- | --- | --- | --- | --- | --- |
| /api/transactions | GET | ?type=income|expense | [{ ...transaction }] | P2 | P2, P3 |
| /api/transactions | POST | { type, amount, description, date } | created transaction | P2 | P2 |
| /api/transactions/:id | PUT | { type, amount, description, date } | updated transaction | P2 | P2 |
| /api/transactions/:id | DELETE | {} | { success } | P2 | P2 |

### Dashboard

| Endpoint | Method | Request | Response | Producer | Consumer |
| --- | --- | --- | --- | --- | --- |
| /api/dashboard/summary | GET | {} | { balance, totalIncome, totalExpense, recentTransactions } | P3 | P3 |
| /api/preferences | GET/PATCH | { theme, defaultView } | { preference } | P1 | P1 |

### Validation Rules

- nominal transaksi harus > 0;
- tipe hanya boleh income atau expense;
- user_id harus sesuai session login;
- email harus unik pada saat registrasi;
- password minimal aman sesuai policy yang disepakati.

## 20. Database Strategy

### Entity

- users
  - id
  - name
  - email
  - password_hash
  - created_at
- transactions
  - id
  - user_id
  - type
  - amount
  - description
  - date
  - created_at
  - updated_at
- user_preferences
  - id
  - user_id
  - theme
  - default_filter
  - updated_at

### Relationship

- users memiliki banyak transactions
- users memiliki satu user_preferences (atau banyak jika perlu history apapun, namun default satu aktif)

### Owner

- Database schema dan migration owner: P1
- Transaction table owner: P2 (untuk field dan akses data sesuai request)
- Dashboard read-only queries: P3

### Migration Responsibility

- semua perubahan schema harus di-review sebelum dipush;
- P2 tidak boleh mengubah tabel users atau auth tanpa koordiansi dengan P1;
- P1 tidak boleh mengubah transaksi schema tanpa persetujuan P2.

## 21. Git Workflow

```text
main
└── baseline
    ├── feature/p1/auth
    ├── feature/p2/transaction
    └── feature/p3/reporting
```

Aturan:

- tidak coding langsung pada main;
- setiap programmer bekerja pada branch masing-masing;
- commit harus kecil dan jelas;
- push secara berkala;
- sinkronisasi dengan baseline sebelum PR.

## 22. Branch Strategy

- main: branch final production/stable
- baseline: branch integrasi awal dan sinkronisasi tim
- feature/p1/auth: pekerjaan autentikasi dan session
- feature/p2/transaction: pekerjaan transaksi dan authorization
- feature/p3/reporting: pekerjaan dashboard dan ringkasan

## 23. Commit Convention

Gunakan conventional commits sederhana:

- feat: penambahan fitur baru
- fix: perbaikan bug
- refactor: perubahan struktur tanpa perubahan behavior
- test: penambahan atau pembaruan test
- docs: perubahan dokumen
- chore: maintenance project

Contoh:

- feat: add register form
- fix: guard protected route
- refactor: simplify transaction validation
- test: add auth unit check

## 24. Merge Strategy

- setiap programmer membuat Pull Request ke baseline;
- review dilakukan sesuai owner domain;
- merge hanya setelah validasi;
- setelah P1, P2, dan P3 masuk ke baseline, dilakukan final integration ke main.

## 25. Merge Conflict Prevention

- satu domain, satu primary owner;
- P1 memegang auth dan session;
- P2 memegang transaksi dan authorization data;
- P3 memegang dashboard dan summary;
- file shared hanya diubah oleh owner utama;
- semua file API contract harus didefinisikan lebih dahulu sebelum implementasi penuh;
- tidak ada tiga programmer yang mengedit file yang sama secara bersamaan.

## 26. Testing Strategy

### P1 Testing
- register validation
- login success/failure
- session persistence
- route protection
- logout flow
- cookie preference read/write

### P2 Testing
- create transaction valid
- create transaction invalid
- edit transaction
- delete transaction
- filter by type
- user ownership enforcement
- API 401/403 behavior

### P3 Testing
- summary total income and expense
- recent transactions render
- empty state
- summary updates after create/edit/delete transaction
- dashboard against user data only

### Global Validation Before PR

- lint
- build
- smoke test on critical flow
- regression check for shared contracts

## 27. Integration Strategy

Integration dilaksanakan secara bertahap:

1. P1 merge ke baseline.
2. Validasi autentikasi dan session.
3. P2 merge ke baseline setelah API transaction contract siap.
4. Validasi data transaksi dan authorization.
5. P3 merge ke baseline dan uji dashboard.
6. Final integration dan regression testing.

Tujuan: meminimalkan risiko konflik dan memastikan setiap modul dapat bekerja bersama secara bertahap.

## 28. Definition of Done

- semua requirement assigned selesai;
- setiap modul memiliki owner dan task yang jelas;
- API contract sudah disepakati dan konsisten;
- session dan authorization bekerja sesuai skenario;
- dashboard menampilkan data yang benar sesuai user login;
- tidak ada konflik ownership pada file utama;
- PR sudah melalui review dan testing.

## 29. Development Rules

- jangan langsung coding di main;
- setiap programmer hanya mengerjakan domain miliknya;
- file shared hanya boleh diubah oleh owner utama;
- lakukan naming dan modul yang konsisten;
- update API contract jika ada perubahan penting;
- gunakan commit kecil dan jelas;
- integrasi harus berurutan, bukan sekali jadi.

## 30. Open Questions / TBD

- apakah database yang dipilih adalah SQLite, PostgreSQL, atau storage ringan lain;
- preferensi cookie yang dipilih: tema, default category, atau default filter;
- apakah login akan menggunakan server actions atau API route sebagai backend utama;
- apakah pengalaman dashboard akan menampilkan chart sederhana atau hanya summary angka.

Catatan: keputusan teknis di bawah akan disepakati pada tahap baseline Next.js sesudah dokumen ini selesai.
