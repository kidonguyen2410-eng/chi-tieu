"use client";

import { useTransactionStore } from "@/hooks/useTransactionStore";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Calendar } from "lucide-react";

export default function CalendarPage() {
  const { transactions } = useTransactionStore();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-2">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Lịch chi tiêu</h1>
          <p className="text-xs text-muted-foreground">Xem giao dịch theo ngày</p>
        </div>
      </div>

      <CalendarView transactions={transactions} />
    </div>
  );
}
