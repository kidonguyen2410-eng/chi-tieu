import { Transaction } from "@/types";
import { SEED_TRANSACTIONS } from "./seed-data";

const STORAGE_KEY = "viet_expense_transactions";

export function loadTransactions(): Transaction[] {
  if (typeof window === "undefined") return SEED_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: seed demo data
      saveTransactions(SEED_TRANSACTIONS);
      return SEED_TRANSACTIONS;
    }
    return JSON.parse(raw) as Transaction[];
  } catch {
    return SEED_TRANSACTIONS;
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function generateId(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
