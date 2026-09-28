# Fase 2 - Programmer 2 (Frontend Input & Interaksi AJAX)

## Role & Tugas

Kamu adalah Programmer 2. Tugasmu adalah membuat komponen antarmuka pengguna (UI) yang bersifat interaktif untuk manajemen input fitur "Budget Bulanan". Pekerjaanmu difokuskan pada pengumpulan data dari pengguna dan integrasi pemanggilan API (AJAX).

## Software Requirements Specification (SRS) - Mandiri P2

- **SRS-205**: Sistem harus menyediakan komponen Form antarmuka (`SetBudgetForm`) bagi pengguna untuk menetapkan atau mengubah nominal batas anggaran bulanan.
- **SRS-206**: Sistem harus menyediakan kontrol Pemilih Bulan (`MonthSelector`) agar pengguna dapat memilih dan mengatur filter bulan/tahun (YYYY-MM) budget yang aktif.
- **SRS-207**: Semua aksi penambahan/pengubahan data pada form serta pemilihan bulan harus dilakukan secara asinkron (AJAX) di latar belakang menggunakan Client Component tanpa proses _page reload_.
- **SRS-208**: Antarmuka komponen harus reaktif, memberikan indikasi _loading state_ saat request berlangsung, dan _error state_ yang jelas apabila input gagal divalidasi.

## File Ownership (Hanya Boleh Edit File Ini)

1. `src/components/budget/SetBudgetForm.tsx` (Buat baru)
2. `src/components/budget/MonthSelector.tsx` (Buat baru)
3. Komponen-komponen pendukung lain khusus di folder `src/components/budget/*` yang berkaitan dengan input data.

---

## Prompt untuk Programmer 2 (Copas ini ke AI P2)

Kamu adalah Programmer 2. Kita sedang berada di Fase 2 pengembangan Expense Tracker. Tugasmu adalah memenuhi SRS-205 hingga SRS-208 dengan membuat Client Components untuk Input pada fitur "Budget Bulanan".

Berikut spesifikasi pekerjaanmu:

1. Buat folder baru `src/components/budget/`.
2. Buat komponen `SetBudgetForm.tsx` (Client Component) untuk input Nominal Anggaran. Komponen ini wajib melakukan validasi client-side, memiliki state loading/error (SRS-208), dan men-submit data secara AJAX (menggunakan `fetch`) ke endpoint `/api/budgets` (SRS-205 & SRS-207). Anggap backend sudah menyiapkan endpoint ini.
3. Buat komponen `MonthSelector.tsx` berupa dropdown atau pemilih bulan/tahun (YYYY-MM). Komponen ini harus memiliki interaktivitas untuk mengatur state bulan aktif dan bisa mem-trigger aksi eksternal (`onChangeMonth`) agar UI lain bisa bereaksi via AJAX (SRS-206).
4. Gunakan gaya desain (styling) yang selaras dengan tema glassmorphism dan globals.css yang sudah ada.

Kerjakan dengan teliti. DILARANG mengedit halaman utama (page.tsx) atau komponen Dashboard agar tidak terjadi merge conflict dengan Programmer 3.
