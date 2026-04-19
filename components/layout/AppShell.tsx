"use client";

import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { TransactionContext } from "@/hooks/useTransactionStore";
import { useTransactions } from "@/hooks/useTransactions";
import { FloatingAddButton } from "@/components/shared/FloatingAddButton";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: ReactNode }) {
  const store = useTransactions();

  return (
    <TransactionContext.Provider value={store}>
      <ErrorBoundary>
        <div className="min-h-dvh bg-background">
          <main className="max-w-lg mx-auto pb-20">
            {children}
          </main>
          <BottomNav />
          <FloatingAddButton />
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              classNames: {
                toast: "rounded-2xl font-medium",
              },
            }}
          />
        </div>
      </ErrorBoundary>
    </TransactionContext.Provider>
  );
}
