import Link from "next/link";

import { RegisterForm } from "@/features/auth/RegisterForm";
import { redirectIfLoggedIn } from "@/features/auth/redirect-if-logged-in";

export default async function RegisterPage() {
  await redirectIfLoggedIn();

  return (
    <main className="auth-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">Expense Tracker</p>
        <h1>Buat akun baru</h1>
        <RegisterForm />
        <p className="subtle">
          Sudah punya akun? <Link href="/login">Masuk</Link>
        </p>
      </section>
    </main>
  );
}
