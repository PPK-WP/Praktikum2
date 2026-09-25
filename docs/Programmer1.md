# Programmer 1

## 1. Role

Programmer 1 bertanggung jawab pada domain autentikasi, session, dan preferensi pengguna. Fokus utama adalah memastikan pengguna dapat membuat akun, masuk, menjaga sesi, dan mengakses halaman yang memerlukan autentikasi dengan aman.

## 2. Responsibility

- mengembangkan alur register dan login;
- menangani session pengguna dan protected route;
- menyediakan mekanisme logout;
- menyimpan serta membaca preferensi pengguna melalui cookies;
- memastikan security dasar dan user context tersedia bagi programmer lain.

## 3. Assigned Requirements

- FR-001: registrasi akun
- FR-002: login
- FR-003: session management
- FR-004: logout
- FR-011: cookie preference
- FR-012: akses data milik sesi yang aktif (sebagian kontrak keamanan)

## 4. Assigned Modules

- Authentication & Session
- Preferences & Cookies
- Shared User Context / Guard

## 5. Assigned Sub-modules

- Register flow
- Login flow
- Password validation
- Session persistence
- Route protection
- Logout process
- Cookie preference save/load
- Auth guard and user context provider

## 6. Assigned Tasks

- TASK-AUTH-001: Build register form UI and validation
- TASK-AUTH-002: Build login form UI and validation
- TASK-AUTH-003: Save login session and validate active user
- TASK-AUTH-004: Implement guard for protected pages
- TASK-AUTH-005: Add logout action and session cleanup
- TASK-AUTH-006: Create preference cookie read/write logic
- TASK-AUTH-007: Define shared auth types and session contract

## 7. Task Dependencies

- TASK-AUTH-003 bergantung pada kontrak user model yang konsisten.
- TASK-AUTH-004 bergantung pada session contract dari TASK-AUTH-003.
- TASK-AUTH-006 bergantung pada shared preference contract disepakati bersama.
- Semua task di P1 harus selesai sebelum P2/P3 mengakses user context secara penuh.

## 8. API Responsibility

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session
- GET/PATCH /api/preferences

P1 bertanggung jawab atas producer dari endpoint autentikasi dan consumer awal untuk session-aware UI.

## 9. Database Responsibility

- users table
- user_preferences table / storage mapping
- password hashing and validation strategy
- user session-related metadata sesuai kebutuhan aplikasi

P1 wajib memastikan tidak mengubah schema transaksi tanpa koordinasi dengan P2.

## 10. Folder Ownership

```text
src/features/auth/
src/lib/auth/
src/services/auth.ts
src/app/(auth)/
src/app/api/auth/
src/types/auth.ts
src/middleware.ts
src/features/preferences/
```

## 11. File Ownership

- auth form components: P1
- route protection logic: P1
- session utilities: P1
- cookie preference utilities: P1
- shared auth types: P1

## 12. Shared Files

- src/types/shared.ts: primary owner P1
- src/lib/utils.ts: primary owner P1
- src/app/layout.tsx: primary owner P1
- src/app/globals.css: primary owner P1

P2 dan P3 hanya boleh mengonsumsi hasil shared file, bukan mengubah tanpa koordinasi.

## 13. Git Branch

- feature/p1/auth

## 14. Commit Convention

- feat: add register flow
- feat: add login session
- fix: session redirect issue
- refactor: simplify auth guard
- docs: auth contract notes

## 15. Development Sequence

1. definisikan user model dan auth contract;
2. bangun register dan login UI;
3. implementasikan submit validation dan autentikasi;
4. simpan session user dan route protection;
5. implementasikan logout;
6. tambahkan cookie preference;
7. lakukan smoke test untuk login/logout dan protected page.

## 16. Testing Checklist

- registrasi berhasil dengan data valid
- registrasi gagal jika email duplikat
- login berhasil dengan kredensial benar
- login gagal dengan password salah
- session tetap aktif selama valid
- halaman protected redirect ke login saat logout
- preferensi cookies terbaca setelah reload

## 17. Integration Instructions

- P1 merge ke baseline setelah validasi auth selesai.
- pastikan response session sesuai kontrak untuk P2 dan P3.
- hindari perubahan besar pada shared types setelah P2 mulai bekerja.
- semua perubahan auth contract harus diinformasikan sebelum integrasi.

## 18. Restrictions

- tidak mengubah transaction schema milik P2 tanpa koordinasi;
- tidak menambah field user yang tidak dibutuhkan oleh auth dan dashboard;
- tidak membiarkan halaman protected mengakses data tanpa session.
- semua perubahan pada shared file harus melalui owner utama.

## 19. Definition of Done

- register, login, logout, dan session berfungsi;
- protected route berjalan sesuai user state;
- user hanya bisa masuk jika autentikasi valid;
- cookie preference tersimpan dan terbaca;
- PR siap review dan merge ke baseline.
