"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { getCategoryById } from "@/lib/categories";
import { useTransactionStore } from "@/hooks/useTransactionStore";
import { TransactionForm } from "./TransactionForm";
import { ImageViewer } from "@/components/shared/ImageViewer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  transaction: Transaction;
  showDate?: boolean;
}

export function TransactionCard({ transaction: tx, showDate = false }: Props) {
  const { deleteTransaction } = useTransactionStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const cat = getCategoryById(tx.category);
  const isIncome = tx.type === "income";

  const handleDelete = () => {
    deleteTransaction(tx.id);
    toast.success("Đã xóa giao dịch");
    setMenuOpen(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50, height: 0 }}
        className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/50 active:bg-accent/50 transition-colors"
      >
        {/* Category Icon */}
        <div
          className="h-11 w-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: `${cat?.color || "#6b7280"}18` }}
        >
          {cat?.icon || "📦"}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate text-foreground">{tx.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span className="text-xs text-muted-foreground">{cat?.name}</span>
                {showDate && (
                  <>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{formatDate(tx.date, "datetime")}</span>
                  </>
                )}
                {!showDate && (
                  <span className="text-xs text-muted-foreground">{formatDate(tx.date, "time")}</span>
                )}
              </div>
              {tx.note && <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{tx.note}</p>}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Image indicator */}
              {tx.image && (
                <button onClick={() => setImageOpen(true)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
                  <ImageIcon className="h-3.5 w-3.5" />
                </button>
              )}
              <span className={cn("font-bold text-sm", isIncome ? "text-emerald-600" : "text-red-500")}>
                {isIncome ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-8 z-40 bg-popover border border-border rounded-2xl shadow-xl overflow-hidden min-w-[140px]"
              >
                <button
                  onClick={() => { setEditOpen(true); setMenuOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm hover:bg-accent transition-colors"
                >
                  <Pencil className="h-4 w-4" /> Sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <Trash2 className="h-4 w-4" /> Xóa
                </button>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      <TransactionForm open={editOpen} onOpenChange={setEditOpen} editTransaction={tx} />
      {tx.image && <ImageViewer open={imageOpen} onOpenChange={setImageOpen} src={tx.image} title={tx.title} />}
    </>
  );
}
