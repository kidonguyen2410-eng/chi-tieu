"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/formatters";
import { PeriodStats } from "@/types";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  income: number;
  expense: number;
  balance: number;
  index: number;
}

function MiniStatCard({ label, income, expense, balance, index }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex-1 bg-card border border-border/50 rounded-2xl p-3.5 min-w-0"
    >
      <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Thu</span>
          <span className="text-xs font-semibold text-emerald-600">+{formatCurrency(income)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Chi</span>
          <span className="text-xs font-semibold text-red-500">-{formatCurrency(expense)}</span>
        </div>
        <div className="h-px bg-border/50 my-1" />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Còn</span>
          <span className={cn("text-xs font-bold", balance >= 0 ? "text-foreground" : "text-red-500")}>
            {balance >= 0 ? "+" : ""}{formatCurrency(balance)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface Props {
  todayStats: PeriodStats;
  weekStats: PeriodStats;
  monthStats: PeriodStats;
  yearStats: PeriodStats;
}

export function StatsOverview({ todayStats, weekStats, monthStats, yearStats }: Props) {
  const items = [
    { label: "Hôm nay", ...todayStats },
    { label: "Tuần này", ...weekStats },
    { label: "Tháng này", ...monthStats },
    { label: "Năm nay", ...yearStats },
  ];

  return (
    <div className="px-4">
      <h2 className="text-sm font-semibold text-muted-foreground mb-3">Tổng hợp</h2>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-0 scrollbar-none">
        {items.map((item, i) => (
          <MiniStatCard key={item.label} {...item} index={i} />
        ))}
      </div>
    </div>
  );
}
