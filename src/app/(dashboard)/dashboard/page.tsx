import { LogoutButton } from "@/features/auth/LogoutButton";
import { formatCurrency } from "@/lib/utils";

const summary = {
  name: "Mahasiswa",
  balance: 1550000,
  totalIncome: 2300000,
  totalExpense: 750000,
};

const recentTransactions = [
  { id: "trx-004", type: "income", description: "Uang tugas tambahan", amount: 300000, date: "2026-09-24" },
  { id: "trx-003", type: "expense", description: "Beli buku", amount: 750000, date: "2026-09-22" },
  { id: "trx-002", type: "expense", description: "Makan siang", amount: 450000, date: "2026-09-21" },
  { id: "trx-001", type: "income", description: "Gaji part-time", amount: 2000000, date: "2026-09-20" },
];

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Selamat datang</p>
          <h1>{summary.name}</h1>
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
          <button className="ghost-button">+ Tambah transaksi</button>
        </div>

        <ul className="transaction-list">
          {recentTransactions.map((transaction) => (
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
