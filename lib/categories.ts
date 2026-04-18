import { Category } from "@/types";

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "food", name: "Ăn uống", icon: "🍜", color: "#f97316", type: "expense" },
  { id: "transport", name: "Di chuyển", icon: "🛵", color: "#8b5cf6", type: "expense" },
  { id: "shopping", name: "Mua sắm", icon: "🛍️", color: "#ec4899", type: "expense" },
  { id: "bills", name: "Hóa đơn", icon: "💡", color: "#f59e0b", type: "expense" },
  { id: "entertainment", name: "Giải trí", icon: "🎮", color: "#06b6d4", type: "expense" },
  { id: "health", name: "Sức khỏe", icon: "💊", color: "#10b981", type: "expense" },
  { id: "education", name: "Học tập", icon: "📚", color: "#3b82f6", type: "expense" },
  { id: "gift", name: "Quà tặng", icon: "🎁", color: "#a855f7", type: "expense" },
  { id: "other_expense", name: "Khác", icon: "📦", color: "#6b7280", type: "expense" },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: "salary", name: "Lương", icon: "💰", color: "#22c55e", type: "income" },
  { id: "bonus", name: "Thưởng", icon: "🏆", color: "#f59e0b", type: "income" },
  { id: "refund", name: "Hoàn tiền", icon: "↩️", color: "#06b6d4", type: "income" },
  { id: "selling", name: "Bán hàng", icon: "🏪", color: "#8b5cf6", type: "income" },
  { id: "other_income", name: "Khác", icon: "✨", color: "#6b7280", type: "income" },
];

export const ALL_CATEGORIES: Category[] = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryById(id: string): Category | undefined {
  return ALL_CATEGORIES.find((c) => c.id === id);
}

export function getCategoriesByType(type: "income" | "expense"): Category[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
