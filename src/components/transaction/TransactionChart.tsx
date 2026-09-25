"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import type { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/utils";

interface TransactionChartProps {
  transactions: Transaction[];
}

export function TransactionChart({ transactions }: TransactionChartProps) {
  // Aggregate data by date
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Group by date
    const grouped = transactions.reduce((acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = { date: curr.date, income: 0, expense: 0 };
      }
      if (curr.type === "income") {
        acc[curr.date].income += curr.amount;
      } else {
        acc[curr.date].expense += curr.amount;
      }
      return acc;
    }, {} as Record<string, { date: string; income: number; expense: number }>);

    // Convert to array and sort by date (ascending for charts)
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [transactions]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div style={{ width: "100%", height: 300, marginBottom: 32 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--success)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: "var(--muted)", fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => {
              const d = new Date(value);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
          />
          <YAxis 
            tick={{ fill: "var(--muted)", fontSize: 12 }} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `Rp${(value/1000)}k`}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid var(--border)',
              background: 'var(--panel)',
              color: 'var(--text)',
              boxShadow: 'var(--shadow)'
            }}
            formatter={(value: any) => [formatCurrency(Number(value) || 0), ""]}
          />
          <Legend wrapperStyle={{ paddingTop: 20 }} />
          <Area 
            type="monotone" 
            dataKey="income" 
            name="Pemasukan" 
            stroke="var(--success)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorIncome)" 
          />
          <Area 
            type="monotone" 
            dataKey="expense" 
            name="Pengeluaran" 
            stroke="var(--danger)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorExpense)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
