import { TransactionManager } from "@/components/transaction/TransactionManager";
import { LogoutButton } from "@/features/auth/LogoutButton";
import { requireUser } from "@/lib/auth/session";

export const metadata = {
  title: "Transactions - Expense Tracker",
};

export default async function TransactionsPage() {
  await requireUser();

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Manajemen</p>
          <h1>Transaksi</h1>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <a href="/dashboard" className="ghost-button">Dashboard</a>
          <LogoutButton />
        </div>
      </header>

      <section className="panel mt-4">
        <TransactionManager />
      </section>
    </main>
  );
}
