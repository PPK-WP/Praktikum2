import { LogoutButton } from "@/features/auth/LogoutButton";
import { requireUser } from "@/lib/auth/session";
import { getPreference } from "@/services/preferences";
import { getDashboardSummary } from "@/services/transactions";
import { DashboardView } from "@/components/dashboard/DashboardView";

export const metadata = {
  title: "Dashboard - Expense Tracker",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const [summary, preference] = await Promise.all([
    getDashboardSummary(user.id),
    getPreference(),
  ]);

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Dashboard Keuangan Mahasiswa</p>
          <h1>Selamat datang, {user.name}</h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <LogoutButton />
        </div>
      </header>

      <DashboardView
        user={user}
        initialSummary={summary}
        initialPreference={preference}
      />
    </main>
  );
}
