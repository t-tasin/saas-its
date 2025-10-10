import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: "up" | "down"
  }
  icon?: React.ReactNode
  color?: string
}

export function StatCard({ title, value, change, icon, color }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center gap-1 mt-2 text-sm">
            {change.trend === "up" ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
            <span className={cn("font-medium", change.trend === "up" ? "text-green-500" : "text-red-500")}>
              {Math.abs(change.value)}%
            </span>
            <span className="text-muted-foreground">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
