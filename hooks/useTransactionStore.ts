"use client";

import { createContext, useContext } from "react";
import { Transaction } from "@/types";

export interface TransactionStore {
  transactions: Transaction[];
  isLoaded: boolean;
  totalBalance: number;
  addTransaction: (data: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Transaction;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByDay: (date: Date) => Transaction[];
}

export const TransactionContext = createContext<TransactionStore | null>(null);

export function useTransactionStore() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactionStore must be used within TransactionProvider");
  return ctx;
}
