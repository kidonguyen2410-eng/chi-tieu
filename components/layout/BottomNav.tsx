"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, BarChart3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/calendar", label: "Lịch", icon: Calendar },
  { href: "/stats", label: "Thống kê", icon: BarChart3 },
  { href: "/transactions", label: "Giao dịch", icon: List },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-colors min-w-0 flex-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 -m-1.5 bg-primary/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn("h-5 w-5 relative z-10 transition-all", isActive && "scale-110")} />
              </div>
              <span className="text-[10px] font-medium leading-none truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
