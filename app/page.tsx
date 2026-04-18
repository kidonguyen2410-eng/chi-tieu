"use client";

import { useMemo, useState } from "react";
import { useTransactionStore } from "@/hooks/useTransactionStore";
import { filterTransactionsByPeriod, calculateStats, getChartData } from "@/lib/calculations";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { loadDemoData, saveTransactions } from "@/lib/storage";
import { Wallet, Plus, FlaskConical, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function DashboardPage() {
  const { transactions, totalBalance, isLoaded } = useTransactionStore();
  const [addOpen, setAddOpen] = useState(false);

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

  const handleLoadDemo = () => {
    loadDemoData();
    window.location.reload();
    toast.success("Đã tải dữ liệu demo");
  };

  const handleClearAll = () => {
    if (!confirm("Xóa toàn bộ dữ liệu? Không thể khôi phục lại.")) return;
    saveTransactions([]);
    window.location.reload();
    toast.success("Đã xóa tất cả dữ liệu");
  };

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

  // Empty state — new user
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center"
        >
          <Wallet className="h-12 w-12 text-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-bold">Chi Tiêu Thông Minh</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Theo dõi thu chi cá nhân dễ dàng.<br />
            Bắt đầu bằng cách thêm giao dịch đầu tiên!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-xs space-y-3"
        >
          {/* Primary CTA */}
          <button
            onClick={() => setAddOpen(true)}
            className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/30 active:scale-95 transition-transform"
          >
            <Plus className="h-5 w-5" />
            Thêm giao dịch đầu tiên
          </button>

          {/* Demo CTA */}
          <button
            onClick={handleLoadDemo}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl border border-border text-muted-foreground font-medium text-sm hover:bg-muted active:scale-95 transition-all"
          >
            <FlaskConical className="h-4 w-4" />
            Xem thử với dữ liệu demo
          </button>
        </motion.div>

        <TransactionForm open={addOpen} onOpenChange={setAddOpen} />
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
        <button
          onClick={handleClearAll}
          className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Xóa tất cả dữ liệu"
        >
          <Trash2 className="h-4 w-4" />
        </button>
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
