"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Transaction } from "@/types";
import { loadTransactions, saveTransactions, generateId } from "@/lib/storage";
import { getTotalBalance } from "@/lib/calculations";
import { parseISO, isSameDay } from "date-fns";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTransactions(loadTransactions());
    setIsLoaded(true);
  }, []);

  const addTransaction = useCallback((data: Omit<Transaction, "id" | "createdAt" | "updatedAt">): Transaction => {
    const now = new Date().toISOString();
    const tx: Transaction = { ...data, id: generateId(), createdAt: now, updatedAt: now };
    setTransactions((prev) => {
      const updated = [tx, ...prev];
      saveTransactions(updated);
      return updated;
    });
    return tx;
  }, []);

  const updateTransaction = useCallback((id: string, data: Partial<Omit<Transaction, "id" | "createdAt">>) => {
    setTransactions((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
      );
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const getTransactionsByDay = useCallback(
    (date: Date) => transactions.filter((t) => isSameDay(parseISO(t.date), date)),
    [transactions]
  );

  const totalBalance = useMemo(() => getTotalBalance(transactions), [transactions]);

  return {
    transactions,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByDay,
    totalBalance,
  };
}
