"use client";

import { useMemo } from "react";
import { format, parseISO, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { Transaction } from "@/types";
import { TransactionCard } from "./TransactionCard";
import { formatCurrency, formatDateHeader } from "@/lib/formatters";
import { Receipt } from "lucide-react";

interface Props {
  transactions: Transaction[];
  showDate?: boolean;
  emptyMessage?: string;
}

interface DayGroup {
  date: string;
  displayDate: string;
  income: number;
  expense: number;
  transactions: Transaction[];
}

export function TransactionList({ transactions, showDate = false, emptyMessage }: Props) {
  const grouped = useMemo((): DayGroup[] => {
    const map = new Map<string, DayGroup>();
    const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const tx of sorted) {
      const key = format(parseISO(tx.date), "yyyy-MM-dd");
      const existing = map.get(key);
      if (existing) {
        existing.transactions.push(tx);
        if (tx.type === "income") existing.income += tx.amount;
        else existing.expense += tx.amount;
      } else {
        map.set(key, {
          date: key,
          displayDate: formatDateHeader(tx.date),
          income: tx.type === "income" ? tx.amount : 0,
          expense: tx.type === "expense" ? tx.amount : 0,
          transactions: [tx],
        });
      }
    }
    return Array.from(map.values());
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3 py-12 text-center"
      >
        <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center text-3xl">
          <Receipt className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{emptyMessage || "Chưa có giao dịch nào"}</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <AnimatePresence>
        {grouped.map((group) => (
          <motion.div key={group.date} layout>
            {/* Day Header */}
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-semibold text-foreground">{group.displayDate}</span>
              <div className="flex items-center gap-3 text-xs">
                {group.income > 0 && (
                  <span className="text-emerald-600 font-medium">+{formatCurrency(group.income)}</span>
                )}
                {group.expense > 0 && (
                  <span className="text-red-500 font-medium">-{formatCurrency(group.expense)}</span>
                )}
              </div>
            </div>

            {/* Transactions */}
            <div className="space-y-2">
              <AnimatePresence>
                {group.transactions.map((tx) => (
                  <TransactionCard key={tx.id} transaction={tx} showDate={showDate} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
