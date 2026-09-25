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

      <section className="feature-grid">
        <article className="panel feature-card">
          <h2>Auth & Session</h2>
          <p>Registrasi, login, logout, dan proteksi route untuk user yang memiliki session aktif.</p>
        </article>
        <article className="panel feature-card">
          <h2>Transaction</h2>
          <p>CRUD transaksi personal dengan filter income dan expense untuk mengelola arus keuangan.</p>
        </article>
        <article className="panel feature-card">
          <h2>Dashboard</h2>
          <p>Saldo, total pemasukan, total pengeluaran, dan transaksi terbaru per pengguna login.</p>
        </article>
      </section>
    </main>
  );
}
