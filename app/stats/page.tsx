"use client";

import { useTransactionStore } from "@/hooks/useTransactionStore";
import { StatsView } from "@/components/stats/StatsView";
import { BarChart3 } from "lucide-react";

export default function StatsPage() {
  const { transactions } = useTransactionStore();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-1">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Thống kê</h1>
          <p className="text-xs text-muted-foreground">Phân tích chi tiêu theo kỳ</p>
        </div>
      </div>

      <StatsView transactions={transactions} />
    </div>
  );
}
