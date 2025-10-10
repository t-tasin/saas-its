"use client"

import { useState } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { TicketCard } from "@/components/ticket-card"
import { EmptyState } from "@/components/empty-state"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useTickets } from "@/hooks/use-tickets"
import { Plus, Search, Ticket } from "lucide-react"

export default function TicketsPage() {
  const [status, setStatus] = useState<string>("all")
  const [priority, setPriority] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const params: any = { limit: 50 }
  if (status !== "all") params.status = status
  if (priority !== "all") params.priority = priority

  const { data: tickets, isLoading, error } = useTickets(params)

  const filteredTickets = tickets?.data?.filter((ticket: any) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return ticket.number.toLowerCase().includes(query) || ticket.title.toLowerCase().includes(query)
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="All Tickets"
          description="Browse and search support tickets"
          action={
            <Link href="/tickets/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </Link>
          }
        />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticket number or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tickets Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load tickets. Please try again.</p>
          </div>
        ) : filteredTickets?.length === 0 ? (
          <EmptyState
            icon={<Ticket className="h-12 w-12" />}
            title="No tickets found"
            description="Try adjusting your filters or create a new ticket."
            action={{
              label: "Create Ticket",
              onClick: () => (window.location.href = "/tickets/new"),
            }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets?.map((ticket: any) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
