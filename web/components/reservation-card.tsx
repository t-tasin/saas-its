import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { formatDate } from "@/lib/utils"
import type { Reservation } from "@/types"
import { Calendar, Package } from "lucide-react"

interface ReservationCardProps {
  reservation: Reservation
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  return (
    <Link href={`/reservations/${reservation.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono text-muted-foreground mb-1">#{reservation.id.slice(0, 8)}</p>
              <h3 className="font-semibold text-lg leading-tight">
                {reservation.requesterName || reservation.requesterEmail || "Anonymous"}
              </h3>
            </div>
            <StatusBadge status={reservation.status} type="reservation" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(reservation.requestDate)} - {formatDate(reservation.returnDate)}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Equipment:</span>
            </div>
            <div className="pl-6 space-y-0.5">
              {reservation.items.slice(0, 2).map((item) => (
                <p key={item.id} className="text-sm text-muted-foreground">
                  {item.assetTypeName} (x{item.quantity})
                </p>
              ))}
              {reservation.items.length > 2 && (
                <p className="text-sm text-muted-foreground">+{reservation.items.length - 2} more</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
