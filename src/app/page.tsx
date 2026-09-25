import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-shell">
      <section className="hero panel">
        <p className="eyebrow">Expense Tracker</p>
        <h1>Kelola uangmu dengan lebih rapi dan lebih aman.</h1>
        <p className="lead">
          Aplikasi ini menjadi fondasi untuk mencatat pemasukan, pengeluaran, saldo, serta
          riwayat transaksi mahasiswa dalam satu dashboard yang personal.
        </p>

        <div className="hero-actions">
          <Link href="/login" className="primary-button">Masuk</Link>
          <Link href="/register" className="secondary-button">Daftar</Link>
        </div>
      </section>
    </main>
  );
}
