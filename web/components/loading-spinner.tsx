import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  fullScreen?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ fullScreen, size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const spinner = <Loader2 className={cn("animate-spin text-primary", sizeClasses[size], className)} />

  if (fullScreen) {
    return <div className="flex items-center justify-center min-h-screen">{spinner}</div>
  }

  return spinner
}
