import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">Expense Tracker</p>
        <h1>Buat akun baru</h1>
        <form className="auth-form">
          <label>
            Nama lengkap
            <input type="text" defaultValue="Mahasiswa" />
          </label>
          <label>
            Email
            <input type="email" defaultValue="mahasiswa@expense.test" />
          </label>
          <label>
            Password
            <input type="password" defaultValue="password123" />
          </label>
          <button type="submit">Daftar</button>
        </form>
        <p className="subtle">
          Sudah punya akun? <Link href="/login">Masuk</Link>
        </p>
      </section>
    </main>
  );
}
