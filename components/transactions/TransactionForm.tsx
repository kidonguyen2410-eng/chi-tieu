"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageCaptureField } from "@/components/shared/ImageCaptureField";
import { useTransactionStore } from "@/hooks/useTransactionStore";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/categories";
import { Transaction } from "@/types";
import { TrendingUp, TrendingDown, CheckCircle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
  editTransaction?: Transaction;
}

export function TransactionForm({ open, onOpenChange, initialDate, editTransaction }: Props) {
  const { addTransaction, updateTransaction } = useTransactionStore();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amountRaw, setAmountRaw] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(format(initialDate || new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [image, setImage] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const isEdit = !!editTransaction;

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmountRaw(editTransaction.amount.toString());
      setTitle(editTransaction.title);
      setCategory(editTransaction.category);
      setNote(editTransaction.note || "");
      setDate(format(new Date(editTransaction.date), "yyyy-MM-dd'T'HH:mm"));
      setImage(editTransaction.image);
    } else {
      setType("expense");
      setAmountRaw("");
      setTitle("");
      setCategory("");
      setNote("");
      setDate(format(initialDate || new Date(), "yyyy-MM-dd'T'HH:mm"));
      setImage(undefined);
    }
  }, [editTransaction, open, initialDate]);

  // Format amount display
  const formatAmount = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    return digits ? parseInt(digits, 10).toLocaleString("vi-VN") : "";
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setAmountRaw(digits);
  };

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const amount = parseInt(amountRaw || "0", 10);

  const isValid = amount > 0 && title.trim() && category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 200)); // tactile delay

    const data = {
      type,
      amount,
      title: title.trim(),
      category,
      note: note.trim(),
      date: new Date(date).toISOString(),
      image,
    };

    if (isEdit && editTransaction) {
      updateTransaction(editTransaction.id, data);
      toast.success("Đã cập nhật giao dịch");
    } else {
      addTransaction(data);
      toast.success(type === "income" ? "Đã thêm khoản thu ✅" : "Đã thêm khoản chi ✅");
    }
    setSaving(false);
    onOpenChange(false);
  };

  const isIncome = type === "income";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent bottomSheet className="px-0">
        <DialogHeader className="px-5">
          <DialogTitle className="text-xl">{isEdit ? "Sửa giao dịch" : "Thêm giao dịch"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-5 pb-8 space-y-5">
          {/* Type Toggle */}
          <div className="flex gap-2 p-1 bg-muted rounded-2xl">
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setCategory(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  type === t
                    ? t === "expense"
                      ? "bg-red-500 text-white shadow-sm"
                      : "bg-emerald-500 text-white shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {t === "expense" ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {t === "expense" ? "Chi tiêu" : "Thu nhập"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Số tiền</label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                value={formatAmount(amountRaw)}
                onChange={handleAmountChange}
                placeholder="0"
                className={`text-2xl font-bold h-14 pr-14 ${
                  isIncome ? "text-emerald-600 border-emerald-200 focus-visible:ring-emerald-500" : "text-red-500 border-red-200 focus-visible:ring-red-500"
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">₫</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Nội dung</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isIncome ? "Lương tháng 4..." : "Suất cơm trưa..."}
              maxLength={100}
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Danh mục</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Ngày giờ</label>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground">Ghi chú (tuỳ chọn)</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thêm ghi chú..."
              rows={2}
            />
          </div>

          {/* Image */}
          <ImageCaptureField value={image} onChange={setImage} />

          {/* Submit */}
          <Button
            type="submit"
            size="xl"
            className="w-full"
            disabled={!isValid || saving}
            variant={isIncome ? "income" : "expense"}
          >
            {saving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }}>
                ⟳
              </motion.div>
            ) : (
              <>
                <CheckCircle className="h-5 w-5" />
                {isEdit ? "Lưu thay đổi" : `Lưu ${isIncome ? "khoản thu" : "khoản chi"}`}
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
