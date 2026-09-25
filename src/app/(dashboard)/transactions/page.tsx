import { TransactionManager } from "@/components/transaction/TransactionManager";

export const metadata = {
  title: "Transactions",
};

export default function TransactionsPage() {
  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Manajemen</p>
          <h1>Transaksi</h1>
        </div>
        <a href="/dashboard" className="ghost-button">Back to Dashboard</a>
      </header>

      <section className="panel mt-4">
        <TransactionManager />
      </section>
    </main>
  );
}
