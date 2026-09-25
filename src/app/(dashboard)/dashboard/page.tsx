import { LogoutButton } from "@/features/auth/LogoutButton";
import { formatCurrency } from "@/lib/utils";
import { requireUser } from "@/lib/auth/session";
import { getDashboardSummary } from "@/services/transactions";

export default async function DashboardPage() {
  const user = await requireUser();
  const summary = await getDashboardSummary(user.id);

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Selamat datang</p>
          <h1>{user.name}</h1>
        </div>
        <LogoutButton />
      </header>

      <section className="summary-grid">
        <article className="panel stat-card success">
          <span>Total pemasukan</span>
          <strong>{formatCurrency(summary.totalIncome)}</strong>
        </article>
        <article className="panel stat-card danger">
          <span>Total pengeluaran</span>
          <strong>{formatCurrency(summary.totalExpense)}</strong>
        </article>
        <article className="panel stat-card primary">
          <span>Saldo</span>
          <strong>{formatCurrency(summary.balance)}</strong>
        </article>
      </section>

      <section className="panel list-panel">
        <div className="section-head">
          <h2>Transaksi terbaru</h2>
          <a href="/transactions" className="ghost-button">Lihat semua</a>
        </div>

        <ul className="transaction-list">
          {summary.recentTransactions.length === 0 && (
            <li className="transaction-item">
              <span style={{ color: "var(--muted)" }}>Belum ada transaksi.</span>
            </li>
          )}
          {summary.recentTransactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item">
              <div>
                <strong>{transaction.description}</strong>
                <small>{transaction.date}</small>
              </div>
              <span className={transaction.type === "income" ? "income" : "expense"}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
