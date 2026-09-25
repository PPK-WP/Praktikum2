import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">Expense Tracker</p>
        <h1>Masuk ke akun</h1>
        <form className="auth-form">
          <label>
            Email
            <input type="email" defaultValue="mahasiswa@expense.test" />
          </label>
          <label>
            Password
            <input type="password" defaultValue="password123" />
          </label>
          <button type="submit">Login</button>
        </form>
        <p className="subtle">
          Belum punya akun? <Link href="/register">Daftar</Link>
        </p>
      </section>
    </main>
  );
}
