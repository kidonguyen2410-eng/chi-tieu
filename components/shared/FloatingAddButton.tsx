"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { TransactionForm } from "@/components/transactions/TransactionForm";

export function FloatingAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 flex items-center justify-center"
        aria-label="Thêm giao dịch"
      >
        <Plus className="h-7 w-7 stroke-[2.5]" />
      </motion.button>
      <TransactionForm open={open} onOpenChange={setOpen} />
    </>
  );
}
