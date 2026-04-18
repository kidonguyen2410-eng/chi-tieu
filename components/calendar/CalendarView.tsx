"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, getDay, addMonths, subMonths, parseISO, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { TransactionList } from "@/components/transactions/TransactionList";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

interface Props {
  transactions: Transaction[];
}

export function CalendarView({ transactions }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Build calendar days
  const calendarData = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    // Padding at start (Monday = 0)
    const startDay = (getDay(start) + 6) % 7; // convert Sunday=0 to Monday-first

    return { days, startPadding: startDay };
  }, [currentMonth]);

  // Day stats lookup
  const dayStats = useMemo(() => {
    const map = new Map<string, { income: number; expense: number; count: number }>();
    for (const tx of transactions) {
      const key = format(parseISO(tx.date), "yyyy-MM-dd");
      const existing = map.get(key) || { income: 0, expense: 0, count: 0 };
      if (tx.type === "income") existing.income += tx.amount;
      else existing.expense += tx.amount;
      existing.count += 1;
      map.set(key, existing);
    }
    return map;
  }, [transactions]);

  const selectedDayTx = useMemo(() => {
    if (!selectedDate) return [];
    return transactions.filter((t) => isSameDay(parseISO(t.date), selectedDate))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedDate]);

  const selectedDayStats = selectedDate
    ? dayStats.get(format(selectedDate, "yyyy-MM-dd"))
    : null;

  return (
    <div className="space-y-4">
      {/* Month Header */}
      <div className="flex items-center justify-between px-4 pt-5">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <motion.h2
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base font-bold"
        >
          {format(currentMonth, "MMMM yyyy", { locale: vi })}
        </motion.h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="h-9 w-9 rounded-full bg-muted flex items-center justify-center active:scale-90 transition-transform"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 px-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 px-2 gap-y-1">
        {/* Start padding */}
        {Array.from({ length: calendarData.startPadding }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {calendarData.days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const stats = dayStats.get(key);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const isCurrentDay = isToday(day);
          const hasTransactions = stats && stats.count > 0;

          return (
            <button
              key={key}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "relative flex flex-col items-center py-1.5 px-0.5 rounded-2xl transition-all active:scale-90",
                isSelected && "bg-primary text-primary-foreground",
                !isSelected && isCurrentDay && "ring-2 ring-primary ring-offset-1",
                !isSelected && "hover:bg-muted"
              )}
            >
              <span className={cn(
                "text-sm font-semibold leading-none mb-1",
                !isSameMonth(day, currentMonth) && "text-muted-foreground/40",
              )}>
                {format(day, "d")}
              </span>

              {/* Transaction dots */}
              {hasTransactions && (
                <div className="flex gap-0.5">
                  {stats!.expense > 0 && (
                    <div className={cn("h-1 w-1 rounded-full", isSelected ? "bg-white/70" : "bg-red-500")} />
                  )}
                  {stats!.income > 0 && (
                    <div className={cn("h-1 w-1 rounded-full", isSelected ? "bg-white/70" : "bg-emerald-500")} />
                  )}
                </div>
              )}

              {/* Mini amount for selected */}
              {isSelected && stats && (
                <span className="text-[9px] font-medium text-white/80 mt-0.5 leading-none">
                  {stats.expense > 0 ? `-${formatCurrency(stats.expense).replace("₫", "").trim()}` : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Summary */}
      {selectedDate && (
        <AnimatePresence mode="wait">
          <motion.div
            key={format(selectedDate, "yyyy-MM-dd")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 space-y-3"
          >
            {/* Day Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  {isToday(selectedDate) ? "Hôm nay" : format(selectedDate, "EEEE, dd/MM", { locale: vi })}
                </h3>
                {selectedDayStats && (
                  <div className="flex gap-3 mt-0.5">
                    {selectedDayStats.income > 0 && (
                      <span className="text-xs text-emerald-600 font-medium">+{formatCurrency(selectedDayStats.income)}</span>
                    )}
                    {selectedDayStats.expense > 0 && (
                      <span className="text-xs text-red-500 font-medium">-{formatCurrency(selectedDayStats.expense)}</span>
                    )}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                {selectedDayTx.length} giao dịch
              </span>
            </div>

            <TransactionList
              transactions={selectedDayTx}
              emptyMessage="Không có giao dịch ngày này"
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
