"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import type { Asset } from "@/types"
import { MapPin, User } from "lucide-react"

interface AssetCardProps {
  asset: Asset
  onAssign?: () => void
  onUnassign?: () => void
  showActions?: boolean
}

export function AssetCard({ asset, onAssign, onUnassign, showActions = false }: AssetCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-mono font-bold mb-1">{asset.assetTag}</p>
            <h3 className="font-semibold text-base text-muted-foreground">{asset.assetType.name}</h3>
          </div>
          <StatusBadge status={asset.status} type="asset" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {asset.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{asset.location}</span>
          </div>
        )}
        {asset.assignedTo && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Assigned to: {asset.assignedTo.name}</span>
          </div>
        )}
        {asset.summary && <p className="text-sm text-muted-foreground line-clamp-2">{asset.summary}</p>}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {asset.status === "available" && onAssign && (
              <Button size="sm" onClick={onAssign} className="flex-1">
                Assign
              </Button>
            )}
            {asset.status === "assigned" && onUnassign && (
              <Button size="sm" variant="outline" onClick={onUnassign} className="flex-1 bg-transparent">
                Unassign
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
