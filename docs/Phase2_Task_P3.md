# Fase 2 - Programmer 3 (Frontend Output & Integrasi Dashboard)

## Role & Tugas

Kamu adalah Programmer 3. Tugasmu adalah membuat representasi visual dari kondisi budget (Output) dan bertugas sebagai Integrator (merakit semua komponen P2 dan P3) ke dalam halaman utama Dashboard.

## Software Requirements Specification (SRS) - Mandiri P3

- **SRS-209**: Sistem harus menampilkan indikator visual rasio sisa anggaran (`BudgetIndicator` / Progress Bar) yang memperlihatkan perbandingan antara total pengeluaran bulan tersebut dengan batas anggaran.
- **SRS-210**: Indikator anggaran harus secara otomatis merubah warna berdasarkan tingkat penggunaan dana (misalnya: hijau bila aman, kuning bila mendekati limit, merah bila over-budget).
- **SRS-211**: Halaman utama (Dashboard) harus menampilkan secara terintegrasi komponen `SetBudgetForm`, `MonthSelector`, dan `BudgetIndicator` secara proporsional.
- **SRS-212**: Komponen integrasi pada Dashboard harus mem-fetch data terbaru (budget limit dan usage summary) dan memberikan data tersebut ke _child components_ (AJAX Data Orchestration).

## File Ownership (Hanya Boleh Edit File Ini)

1. `src/components/budget/BudgetIndicator.tsx` (Buat baru: representasi visual)
2. `src/components/budget/BudgetSummary.tsx` (Buat baru opsional: teks/angka saldo budget)
3. `src/components/dashboard/DashboardView.tsx` (Update: Embed semua komponen budget)

---

## Prompt untuk Programmer 3 (Copas ini ke AI P3)

Kamu adalah Programmer 3. Kita sedang berada di Fase 2 pengembangan Expense Tracker. Tugasmu adalah memenuhi SRS-209 hingga SRS-212 dengan membuat komponen Indikator Visual dan mengintegrasikan modul Budget ke dalam Dashboard utama.

Berikut spesifikasi pekerjaanmu:

1. Buat komponen visual `src/components/budget/BudgetIndicator.tsx` (Client Component) yang menerima props berupa limit anggaran dan total pengeluaran (SRS-209). Buat elemen visual (seperti Progress Bar) yang warnanya reaktif (misal merah jika pengeluaran > anggaran) untuk memenuhi SRS-210.
2. Modifikasi file `src/components/dashboard/DashboardView.tsx`. Kamu bertugas sebagai Integrator: Panggil komponen `SetBudgetForm` dan `MonthSelector` (yang sudah dikerjakan P2), letakkan berdampingan secara proporsional dengan `BudgetIndicator` buatanmu (SRS-211).
3. Atur logika state dan fetching data pada Dashboard agar ketika `MonthSelector` berganti nilai, maka data budget dan progress bar langsung _re-fetch_ (memperbarui diri secara dinamis/AJAX) tanpa reload layar (SRS-212).

Kerjakan dengan teliti. DILARANG memodifikasi logika struktur Backend/API agar tidak konflik dengan Programmer 1.
