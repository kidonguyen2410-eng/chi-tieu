"use client";

import { useMemo, useState, useEffect } from "react";
import { useTransactionStore } from "@/hooks/useTransactionStore";
import { filterTransactionsByPeriod, calculateStats, getChartData } from "@/lib/calculations";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { loadDemoData, saveTransactions } from "@/lib/storage";
import { loadProfile, saveProfile, UserProfile } from "@/lib/profile";
import { Wallet, Plus, FlaskConical, Trash2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Onboarding — ask for name
function OnboardingScreen({ onDone }: { onDone: (name: string) => void }) {
  const [name, setName] = useState("");
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleStart = () => {
    if (!name.trim()) return;
    onDone(name.trim());
  };

  const handleDemo = () => {
    const n = name.trim() || "Bạn";
    setLoadingDemo(true);
    loadDemoData();
    onDone(n);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center gap-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center"
      >
        <Wallet className="h-12 w-12 text-primary" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-bold">Chi Tiêu Thông Minh</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Theo dõi thu chi cá nhân dễ dàng, nhanh chóng.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-xs space-y-4"
      >
        <div className="space-y-2 text-left">
          <label className="text-sm font-semibold">Bạn tên là gì?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            placeholder="Nhập tên của bạn..."
            autoFocus
            className="w-full h-12 px-4 rounded-2xl border border-border bg-card text-base focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/25 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Bắt đầu
          <ArrowRight className="h-5 w-5" />
        </button>

        <button
          onClick={handleDemo}
          disabled={loadingDemo}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-border text-muted-foreground font-medium text-sm hover:bg-muted active:scale-95 transition-all"
        >
          <FlaskConical className="h-4 w-4" />
          Xem thử với dữ liệu demo
        </button>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  const { transactions, totalBalance, isLoaded } = useTransactionStore();
  const [addOpen, setAddOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setProfileLoaded(true);
  }, []);

  const handleOnboardingDone = (name: string) => {
    const p: UserProfile = { name, createdAt: new Date().toISOString() };
    saveProfile(p);
    setProfile(p);
    // Reload to pick up any demo data
    window.location.reload();
  };

  const handleClearAll = () => {
    if (!confirm("Xóa toàn bộ dữ liệu? Không thể khôi phục.")) return;
    saveTransactions([]);
    window.location.reload();
  };

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
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20),
    [transactions]
  );

  // Wait for both localStorage reads to complete
  if (!isLoaded || !profileLoaded) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Wallet className="h-8 w-8 animate-pulse" />
          <span className="text-sm">Đang tải...</span>
        </div>
      </div>
    );
  }

  // First visit: no profile yet
  if (!profile) {
    return <OnboardingScreen onDone={handleOnboardingDone} />;
  }

  // Has profile but no transactions: show quick-start
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center"
        >
          <Wallet className="h-12 w-12 text-primary" />
        </motion.div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Xin chào, {profile.name}! 👋</h2>
          <p className="text-muted-foreground text-sm">Thêm giao dịch đầu tiên để bắt đầu.</p>
        </div>
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => setAddOpen(true)}
            className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-lg shadow-primary/25 active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5" />
            Thêm giao dịch đầu tiên
          </button>
        </div>
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
          <h1 className="text-xl font-bold">{profile.name}</h1>
        </div>
        <button
          onClick={handleClearAll}
          className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Xóa tất cả dữ liệu"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <BalanceCard totalBalance={totalBalance} monthStats={monthStats} />

      <StatsOverview
        todayStats={todayStats}
        weekStats={weekStats}
        monthStats={monthStats}
        yearStats={yearStats}
      />

      {chartData.some((d) => d.income > 0 || d.expense > 0) && (
        <ExpenseChart data={chartData} title="Thu chi tháng này" />
      )}

      <div className="px-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">Giao dịch gần đây</h2>
        <TransactionList transactions={recentTx} emptyMessage="Chưa có giao dịch. Bấm + để thêm!" />
      </div>
    </div>
  );
}
