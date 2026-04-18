"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { ChartDataPoint } from "@/types";
import { formatCurrencyCompact } from "@/lib/formatters";

interface Props {
  data: ChartDataPoint[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-xl shadow-xl p-3 text-xs">
      <p className="font-semibold mb-1.5 text-foreground">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span className="text-muted-foreground">{entry.name === "income" ? "Thu" : "Chi"}:</span>
          <span className="font-semibold text-foreground">{formatCurrencyCompact(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function ExpenseChart({ data, title = "Thu chi theo ngày" }: Props) {
  if (!data.length) return null;

  return (
    <div className="px-4">
      <h2 className="text-sm font-semibold text-muted-foreground mb-3">{title}</h2>
      <div className="bg-card border border-border/50 rounded-2xl p-4 pb-2">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} barGap={2} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickFormatter={formatCurrencyCompact} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />Thu nhập
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="h-2.5 w-2.5 rounded-sm bg-red-500" />Chi tiêu
          </div>
        </div>
      </div>
    </div>
  );
}
