"use client";

import { useMemo } from "react";
import { useTransactionStore } from "@/hooks/useTransactionStore";
import { filterTransactionsByPeriod, calculateStats, getChartData } from "@/lib/calculations";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Wallet } from "lucide-react";

export default function DashboardPage() {
  const { transactions, totalBalance, isLoaded } = useTransactionStore();

  const now = new Date();

  const todayStats = useMemo(
    () => calculateStats(filterTransactionsByPeriod(transactions, now, "day")),
    [transactions]
  );
  const weekStats = useMemo(
    () => calculateStats(filterTransactionsByPeriod(transactions, now, "week")),
    [transactions]
  );
  const monthStats = useMemo(
    () => calculateStats(filterTransactionsByPeriod(transactions, now, "month")),
    [transactions]
  );
  const yearStats = useMemo(
    () => calculateStats(filterTransactionsByPeriod(transactions, now, "year")),
    [transactions]
  );

  const chartData = useMemo(
    () => getChartData(filterTransactionsByPeriod(transactions, now, "month"), now, "month"),
    [transactions]
  );

  const recentTx = useMemo(
    () => [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20),
    [transactions]
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Wallet className="h-8 w-8 animate-pulse" />
          <span className="text-sm">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5">
        <div>
          <p className="text-xs text-muted-foreground">Xin chào 👋</p>
          <h1 className="text-xl font-bold">Chi Tiêu Thông Minh</h1>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Balance Card */}
      <BalanceCard totalBalance={totalBalance} monthStats={monthStats} />

      {/* Stats Overview */}
      <StatsOverview
        todayStats={todayStats}
        weekStats={weekStats}
        monthStats={monthStats}
        yearStats={yearStats}
      />

      {/* Chart */}
      {chartData.some((d) => d.income > 0 || d.expense > 0) && (
        <ExpenseChart data={chartData} title="Thu chi tháng này" />
      )}

      {/* Recent Transactions */}
      <div className="px-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Giao dịch gần đây</h2>
        <TransactionList transactions={recentTx} emptyMessage="Chưa có giao dịch. Bấm + để thêm!" />
      </div>
    </div>
  );
}
