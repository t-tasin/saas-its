import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { PriorityBadge } from "@/components/priority-badge"
import { formatDateTime } from "@/lib/utils"
import type { Ticket } from "@/types"

interface TicketCardProps {
  ticket: Ticket
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link href={`/tickets/${ticket.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono text-muted-foreground mb-1">{ticket.number}</p>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">{ticket.title}</h3>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <StatusBadge status={ticket.status} type="ticket" />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {ticket.category && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Category:</span>
              <span>{ticket.category.name}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Created {formatDateTime(ticket.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
