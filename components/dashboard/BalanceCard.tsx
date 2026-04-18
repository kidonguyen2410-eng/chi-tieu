"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { PeriodStats } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  totalBalance: number;
  monthStats: PeriodStats;
}

export function BalanceCard({ totalBalance, monthStats }: Props) {
  const isPositive = totalBalance >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mt-4 rounded-3xl overflow-hidden relative"
    >
      {/* Gradient background */}
      <div className={cn(
        "absolute inset-0",
        isPositive
          ? "bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600"
          : "bg-gradient-to-br from-red-500 via-rose-600 to-pink-600"
      )} />

      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative p-6">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-4 w-4 text-white/70" />
          <span className="text-white/70 text-sm font-medium">Số dư hiện tại</span>
        </div>
        <motion.div
          key={totalBalance}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="text-4xl font-bold text-white mb-5"
        >
          {formatCurrency(totalBalance)}
        </motion.div>

        {/* Month stats */}
        <div className="flex gap-3">
          <div className="flex-1 bg-white/15 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-white/70 text-xs">Thu tháng này</span>
            </div>
            <span className="text-white font-bold text-base">{formatCurrency(monthStats.income)}</span>
          </div>
          <div className="flex-1 bg-white/15 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="h-3.5 w-3.5 text-red-300" />
              <span className="text-white/70 text-xs">Chi tháng này</span>
            </div>
            <span className="text-white font-bold text-base">{formatCurrency(monthStats.expense)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
