"use client";

import { useState, useMemo } from "react";
import { format, subMonths, addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, subWeeks, addWeeks, subYears, addYears, parseISO, isWithinInterval } from "date-fns";
import { vi } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction, ViewPeriod } from "@/types";
import { calculateStats, getChartData } from "@/lib/calculations";
import { formatCurrency, formatCurrencyCompact } from "@/lib/formatters";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from "recharts";

interface Props {
  transactions: Transaction[];
}

export function StatsView({ transactions }: Props) {
  const [period, setPeriod] = useState<ViewPeriod>("month");
  const [referenceDate, setReferenceDate] = useState(new Date());

  const navigate = (dir: 1 | -1) => {
    if (period === "month") setReferenceDate((d) => dir > 0 ? addMonths(d, 1) : subMonths(d, 1));
    else if (period === "week") setReferenceDate((d) => dir > 0 ? addWeeks(d, 1) : subWeeks(d, 1));
    else if (period === "year") setReferenceDate((d) => dir > 0 ? addYears(d, 1) : subYears(d, 1));
  };

  const periodLabel = useMemo(() => {
    if (period === "month") return format(referenceDate, "MMMM yyyy", { locale: vi });
    if (period === "week") {
      const start = startOfWeek(referenceDate, { weekStartsOn: 1 });
      const end = endOfWeek(referenceDate, { weekStartsOn: 1 });
      return `${format(start, "dd/MM")} – ${format(end, "dd/MM/yyyy")}`;
    }
    if (period === "year") return format(referenceDate, "yyyy");
    return format(referenceDate, "dd/MM/yyyy");
  }, [period, referenceDate]);

  const filtered = useMemo(() => {
    let start: Date, end: Date;
    if (period === "month") { start = startOfMonth(referenceDate); end = endOfMonth(referenceDate); }
    else if (period === "week") { start = startOfWeek(referenceDate, { weekStartsOn: 1 }); end = endOfWeek(referenceDate, { weekStartsOn: 1 }); }
    else if (period === "year") { start = startOfYear(referenceDate); end = endOfYear(referenceDate); }
    else { start = new Date(referenceDate.setHours(0, 0, 0, 0)); end = new Date(referenceDate.setHours(23, 59, 59, 999)); }

    return transactions.filter((t) => isWithinInterval(parseISO(t.date), { start, end }));
  }, [transactions, period, referenceDate]);

  const stats = useMemo(() => calculateStats(filtered), [filtered]);
  const chartData = useMemo(() => getChartData(filtered, referenceDate, period), [filtered, referenceDate, period]);

  const net = stats.income - stats.expense;

  return (
    <div className="space-y-5 pb-6">
      {/* Period Selector */}
      <div className="px-4 pt-5">
        <Tabs value={period} onValueChange={(v) => { setPeriod(v as ViewPeriod); setReferenceDate(new Date()); }}>
          <TabsList className="w-full">
            {(["day", "week", "month", "year"] as ViewPeriod[]).map((p) => (
              <TabsTrigger key={p} value={p} className="flex-1 text-xs">
                {{ day: "Ngày", week: "Tuần", month: "Tháng", year: "Năm" }[p]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Navigation */}
        {period !== "day" && (
          <div className="flex items-center justify-between mt-3">
            <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <AnimatePresence mode="wait">
              <motion.span
                key={periodLabel}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-sm font-bold capitalize"
              >
                {periodLabel}
              </motion.span>
            </AnimatePresence>
            <button onClick={() => navigate(1)} className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 px-4">
        {[
          { label: "Thu nhập", value: stats.income, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
          { label: "Chi tiêu", value: stats.expense, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/30" },
          { label: "Còn lại", value: net, color: net >= 0 ? "text-blue-600" : "text-red-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
        ].map((item) => (
          <motion.div key={item.label} layout className={cn("rounded-2xl p-3 text-center", item.bg)}>
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className={cn("text-sm font-bold", item.color)}>{formatCurrencyCompact(item.value)}</p>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && <ExpenseChart data={chartData} title="Biểu đồ thu chi" />}

      {/* Category Breakdown */}
      {stats.categoryBreakdown.length > 0 && (
        <div className="px-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Chi tiêu theo danh mục</h2>

          {/* Pie Chart */}
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.categoryBreakdown}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {stats.categoryBreakdown.map((cat, i) => (
                    <Cell key={cat.categoryId} fill={cat.categoryColor} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Số tiền"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-2">
            {stats.categoryBreakdown.map((cat, i) => (
              <motion.div
                key={cat.categoryId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 bg-card border border-border/50 rounded-2xl p-3.5"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ backgroundColor: `${cat.categoryColor}18` }}
                >
                  {cat.categoryIcon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cat.categoryName}</span>
                    <span className="text-sm font-bold text-red-500">-{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.categoryColor }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-9 text-right">{cat.percentage.toFixed(0)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {stats.transactions.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center px-4">
          <div className="text-5xl">📊</div>
          <p className="text-sm text-muted-foreground">Không có dữ liệu cho kỳ này</p>
        </div>
      )}
    </div>
  );
}
