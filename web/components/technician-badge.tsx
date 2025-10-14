"use client"

import { useUser } from "@/hooks/use-users"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"

interface TechnicianBadgeProps {
  userId: string
}

export function TechnicianBadge({ userId }: TechnicianBadgeProps) {
  const { data: user, isLoading } = useUser(userId)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
        <User className="h-4 w-4" />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  const displayName = user?.data?.name || user?.data?.email || userId

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
      <User className="h-4 w-4" />
      <span className="text-sm font-medium">{displayName}</span>
      {user?.data?.role && (
        <Badge variant="secondary" className="text-xs">
          {user.data.role}
        </Badge>
      )}
    </div>
  )
}

