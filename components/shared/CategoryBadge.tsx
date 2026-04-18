import { getCategoryById } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface Props {
  categoryId: string;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function CategoryBadge({ categoryId, size = "md", showLabel = true }: Props) {
  const cat = getCategoryById(categoryId);
  if (!cat) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"
      )}
      style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
    >
      <span>{cat.icon}</span>
      {showLabel && <span>{cat.name}</span>}
    </span>
  );
}
