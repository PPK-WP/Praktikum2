# Auth & Preference Contract (P1)

Catatan untuk P2 dan P3 tentang cara memakai hasil kerja P1.

## Session di server

Pakai helper dari `@/lib/auth/session`:

| Helper | Kapan dipakai | Hasil |
| --- | --- | --- |
| `getCurrentUser()` | Route handler / server component yang harus menolak tamu | `User` atau `null` → balas `401` jika `null` |
| `requireUser()` | Halaman protected (server component) | `User`, atau redirect ke `/login` |

```ts
// contoh di src/app/api/transactions/route.ts (P2)
const user = await getCurrentUser();
if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
// filter data dengan user.id
```

`src/proxy.ts` (pengganti `middleware.ts` di Next.js 16) hanya memeriksa tanda tangan cookie
untuk `/dashboard/*` dan `/transactions/*`. Tetap panggil `getCurrentUser()` sebelum membaca data.

## Session di client

`useCurrentUser()` dari `@/features/auth` memberi `User | null`. `<LogoutButton />` sudah siap dipakai.

## Tipe

- `User` di `src/types/auth.ts`: `{ id, name, email, role, createdAt }`
- `UserPreference` di `src/types/shared.ts`: `{ theme: "light" | "dark", defaultFilter: "all" | "income" | "expense" }`

## Endpoint

| Endpoint | Method | Request | Response sukses | Error |
| --- | --- | --- | --- | --- |
| `/api/auth/register` | POST | `{ name, email, password }` | `201 { user }` | `422` validasi, `409` email dipakai |
| `/api/auth/login` | POST | `{ email, password }` | `200 { user, session: { expiresAt } }` | `422`, `401` |
| `/api/auth/logout` | POST | – | `200 { success: true }` | – |
| `/api/auth/session` | GET | – | `200 { user }` | `401` |
| `/api/preferences` | GET | – | `200 { preference }` | – |
| `/api/preferences` | PATCH | `{ theme?, defaultFilter? }` | `200 { preference }` | `422` |

Error selalu berbentuk `{ message, errors? }` (`ApiError` di `src/types/shared.ts`).

## Aturan

- Password minimal 8 karakter, berisi huruf dan angka. Email disimpan huruf kecil dan harus unik.
- Session berlaku 7 hari (cookie `et_session`, httpOnly).
- Preferensi disimpan di cookie `et_preference`, dan juga di akun jika sedang login (dipulihkan saat login).
- Data akun sementara disimpan di `data/auth.json` (tidak di-commit) sampai database dipilih.
- Production wajib mengisi `AUTH_SECRET` (lihat `.env.example`).
