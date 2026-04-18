"use client";

import { useState, useMemo } from "react";
import { useTransactionStore } from "@/hooks/useTransactionStore";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, List, TrendingUp, TrendingDown } from "lucide-react";
import { ALL_CATEGORIES } from "@/lib/categories";
import { cn } from "@/lib/utils";

type FilterType = "all" | "income" | "expense";

export default function TransactionsPage() {
  const { transactions } = useTransactionStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filterType !== "all" && t.type !== filterType) return false;
        if (filterCategory !== "all" && t.category !== filterCategory) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            t.title.toLowerCase().includes(q) ||
            t.note?.toLowerCase().includes(q) ||
            ALL_CATEGORIES.find((c) => c.id === t.category)?.name.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, search, filterType, filterCategory]);

  const categories = ALL_CATEGORIES.filter((cat) =>
    filterType === "all" ? true : cat.type === filterType || cat.type === "both"
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <List className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Giao dịch</h1>
          <p className="text-xs text-muted-foreground">{transactions.length} giao dịch</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm giao dịch..."
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Type Filter */}
      <div className="px-4 flex gap-2">
        {(["all", "expense", "income"] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => { setFilterType(t); setFilterCategory("all"); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
              filterType === t
                ? t === "income"
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : t === "expense"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground bg-card"
            )}
          >
            {t === "income" && <TrendingUp className="h-3.5 w-3.5" />}
            {t === "expense" && <TrendingDown className="h-3.5 w-3.5" />}
            {{ all: "Tất cả", income: "Thu nhập", expense: "Chi tiêu" }[t]}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      {filterType !== "all" && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
          <button
            onClick={() => setFilterCategory("all")}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              filterCategory === "all"
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground bg-card"
            )}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filterCategory === cat.id
                  ? "text-white border-transparent"
                  : "border-border text-muted-foreground bg-card"
              )}
              style={filterCategory === cat.id ? { backgroundColor: cat.color } : {}}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="px-4">
        <p className="text-xs text-muted-foreground">
          {filtered.length} kết quả{search ? ` cho "${search}"` : ""}
        </p>
      </div>

      {/* List */}
      <div className="px-4">
        <TransactionList
          transactions={filtered}
          showDate
          emptyMessage="Không tìm thấy giao dịch nào"
        />
      </div>
    </div>
  );
}
