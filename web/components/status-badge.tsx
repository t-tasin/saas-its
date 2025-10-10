import { cn, getStatusColor, formatStatus } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  type?: "ticket" | "reservation" | "asset"
  className?: string
}

export function StatusBadge({ status, type = "ticket", className }: StatusBadgeProps) {
  const colorClass = getStatusColor(status, type)

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white",
        colorClass,
        className,
      )}
    >
      {formatStatus(status)}
    </span>
  )
}
