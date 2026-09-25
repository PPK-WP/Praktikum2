import Link from "next/link";

import { LoginForm } from "@/features/auth/LoginForm";
import { redirectIfLoggedIn } from "@/features/auth/redirect-if-logged-in";
import { AFTER_LOGIN_PATH } from "@/lib/auth/constants";
import { safeRedirectPath } from "@/lib/auth/http";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  await redirectIfLoggedIn();

  const { next } = await searchParams;
  const redirectTo = safeRedirectPath(typeof next === "string" ? next : null, AFTER_LOGIN_PATH);

  return (
    <main className="auth-shell">
      <section className="panel auth-panel">
        <p className="eyebrow">Expense Tracker</p>
        <h1>Masuk ke akun</h1>
        <LoginForm redirectTo={redirectTo} />
        <p className="subtle">
          Belum punya akun? <Link href="/register">Daftar</Link>
        </p>
      </section>
    </main>
  );
}
