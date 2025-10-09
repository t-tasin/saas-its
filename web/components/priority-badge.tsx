import { cn, getPriorityColor, capitalizeFirst } from "@/lib/utils"

interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "urgent"
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const colorClass = getPriorityColor(priority)

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white",
        colorClass,
        className,
      )}
    >
      {capitalizeFirst(priority)}
    </span>
  )
}
