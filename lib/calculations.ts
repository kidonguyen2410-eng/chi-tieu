import {
  startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, startOfYear, endOfYear,
  isWithinInterval, parseISO, format, eachDayOfInterval,
  eachMonthOfInterval,
} from "date-fns";
import { vi } from "date-fns/locale";
import { Transaction, PeriodStats, DaySummary, ChartDataPoint, CategoryBreakdown, ViewPeriod } from "@/types";
import { getCategoryById, ALL_CATEGORIES } from "./categories";

export function getPeriodBounds(date: Date, period: ViewPeriod) {
  switch (period) {
    case "day":
      return { start: startOfDay(date), end: endOfDay(date) };
    case "week":
      return { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) };
    case "month":
      return { start: startOfMonth(date), end: endOfMonth(date) };
    case "year":
      return { start: startOfYear(date), end: endOfYear(date) };
  }
}

export function filterTransactionsByPeriod(
  transactions: Transaction[],
  date: Date,
  period: ViewPeriod
): Transaction[] {
  const { start, end } = getPeriodBounds(date, period);
  return transactions.filter((t) => {
    const d = parseISO(t.date);
    return isWithinInterval(d, { start, end });
  });
}

export function calculateStats(transactions: Transaction[]): PeriodStats {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = new Map<string, { amount: number; count: number }>();
  transactions.forEach((t) => {
    if (t.type === "expense") {
      const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
      categoryMap.set(t.category, {
        amount: existing.amount + t.amount,
        count: existing.count + 1,
      });
    }
  });

  const categoryBreakdown: CategoryBreakdown[] = [];
  categoryMap.forEach((data, catId) => {
    const cat = getCategoryById(catId);
    if (cat && expense > 0) {
      categoryBreakdown.push({
        categoryId: catId,
        categoryName: cat.name,
        categoryColor: cat.color,
        categoryIcon: cat.icon,
        amount: data.amount,
        percentage: (data.amount / expense) * 100,
        count: data.count,
      });
    }
  });
  categoryBreakdown.sort((a, b) => b.amount - a.amount);

  return { income, expense, balance: income - expense, transactions, categoryBreakdown };
}

export function getDaySummaries(transactions: Transaction[], date: Date, period: ViewPeriod): DaySummary[] {
  const { start, end } = getPeriodBounds(date, period);
  const days = eachDayOfInterval({ start, end });

  return days.map((day) => {
    const dayTx = transactions.filter((t) => {
      const d = parseISO(t.date);
      return isWithinInterval(d, { start: startOfDay(day), end: endOfDay(day) });
    });
    const income = dayTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = dayTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { date: format(day, "yyyy-MM-dd"), income, expense, transactions: dayTx };
  });
}

export function getChartData(transactions: Transaction[], date: Date, period: ViewPeriod): ChartDataPoint[] {
  if (period === "day") {
    // Hourly breakdown
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours
      .filter((h) => {
        const start = new Date(date);
        start.setHours(h, 0, 0, 0);
        const end = new Date(date);
        end.setHours(h, 59, 59, 999);
        return transactions.some((t) => {
          const d = parseISO(t.date);
          return isWithinInterval(d, { start, end });
        });
      })
      .map((h) => {
        const start = new Date(date);
        start.setHours(h, 0, 0, 0);
        const end = new Date(date);
        end.setHours(h, 59, 59, 999);
        const tx = transactions.filter((t) => {
          const d = parseISO(t.date);
          return isWithinInterval(d, { start, end });
        });
        const income = tx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const expense = tx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        return { label: `${h}h`, income, expense, balance: income - expense };
      });
  }

  if (period === "week") {
    const { start, end } = getPeriodBounds(date, "week");
    const days = eachDayOfInterval({ start, end });
    return days.map((day) => {
      const dayTx = transactions.filter((t) => {
        const d = parseISO(t.date);
        return isWithinInterval(d, { start: startOfDay(day), end: endOfDay(day) });
      });
      const income = dayTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expense = dayTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      return {
        label: format(day, "EEE", { locale: vi }),
        income,
        expense,
        balance: income - expense,
      };
    });
  }

  if (period === "month") {
    const { start, end } = getPeriodBounds(date, "month");
    const days = eachDayOfInterval({ start, end });
    return days.map((day) => {
      const dayTx = transactions.filter((t) => {
        const d = parseISO(t.date);
        return isWithinInterval(d, { start: startOfDay(day), end: endOfDay(day) });
      });
      const income = dayTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expense = dayTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      return { label: format(day, "d"), income, expense, balance: income - expense };
    });
  }

  // Year: monthly breakdown
  const { start, end } = getPeriodBounds(date, "year");
  const months = eachMonthOfInterval({ start, end });
  return months.map((month) => {
    const mStart = startOfMonth(month);
    const mEnd = endOfMonth(month);
    const mTx = transactions.filter((t) => {
      const d = parseISO(t.date);
      return isWithinInterval(d, { start: mStart, end: mEnd });
    });
    const income = mTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = mTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return {
      label: format(month, "MMM", { locale: vi }),
      income,
      expense,
      balance: income - expense,
    };
  });
}

export function getTotalBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => {
    return t.type === "income" ? sum + t.amount : sum - t.amount;
  }, 0);
}
