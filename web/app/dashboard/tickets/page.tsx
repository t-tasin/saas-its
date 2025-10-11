"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { EmptyState } from "@/components/empty-state"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Ticket, ArrowUpDown, Loader2, UserPlus } from "lucide-react"
import { formatRelativeTime } from "@/lib/utils"
import { PriorityBadge } from "@/components/priority-badge"
import { CreateTicketModal } from "@/components/create-ticket-modal"
import { useTickets, useAssignTicket } from "@/hooks/use-tickets"
import { useAssignableUsers } from "@/hooks/use-users"

function DashboardTicketsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [showTicketModal, setShowTicketModal] = useState(false)
  
  // Fetch tickets from backend
  const { data: ticketsResponse, isLoading, error } = useTickets()
  const tickets = ticketsResponse?.data || []
  
  // Fetch assignable users
  const { data: usersResponse } = useAssignableUsers()
  const assignableUsers = usersResponse?.data || []
  
  // Assign ticket mutation
  const assignTicket = useAssignTicket()

  const sortedTickets = [...tickets].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB
  })

  const filteredTickets = sortedTickets.filter((ticket) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      ticket.number?.toLowerCase().includes(query) ||
      ticket.title?.toLowerCase().includes(query) ||
      ticket.requestedBy?.toLowerCase().includes(query) ||
      ticket.requesterEmail?.toLowerCase().includes(query) ||
      ticket.type?.toLowerCase().includes(query)
    )
  })

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <PageHeader
          title="Latest Tickets"
          description="Manage all support tickets"
          action={
            <Button onClick={() => setShowTicketModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          }
        />

        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ticket number, title, email, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading tickets...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="border rounded-lg bg-destructive/10 p-6 text-center">
            <p className="text-destructive">Failed to load tickets. Please try again.</p>
          </div>
        )}

        {/* Empty/No Results State */}
        {!isLoading && !error && filteredTickets.length === 0 && (
          <EmptyState
            icon={<Ticket className="h-12 w-12" />}
            title="No tickets found"
            description={searchQuery ? "Try adjusting your search." : "Create your first ticket to get started."}
            action={{
              label: "Create Ticket",
              onClick: () => setShowTicketModal(true),
            }}
          />
        )}

        {/* Tickets Table */}
        {!isLoading && !error && filteredTickets.length > 0 && (
          <div className="border rounded-lg bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px] font-semibold">Ticket #</TableHead>
                    <TableHead className="w-[80px] font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="w-[80px] font-semibold">Priority</TableHead>
                    <TableHead className="w-[100px] font-semibold">Status</TableHead>
                    <TableHead className="w-[180px] font-semibold">Assign To</TableHead>
                    <TableHead className="w-[100px] font-semibold">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSort}
                        className="flex items-center gap-1 -ml-3 hover:bg-transparent"
                      >
                        Created
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <TableCell 
                        className="font-mono font-medium text-sm cursor-pointer"
                        onClick={() => (window.location.href = `/tickets/${ticket.id}`)}
                      >
                        {ticket.number || ticket.id.slice(0, 8)}
                      </TableCell>
                      <TableCell onClick={() => (window.location.href = `/tickets/${ticket.id}`)} className="cursor-pointer">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {ticket.type || "incident"}
                        </span>
                      </TableCell>
                      <TableCell 
                        className="max-w-xs truncate font-medium cursor-pointer"
                        onClick={() => (window.location.href = `/tickets/${ticket.id}`)}
                      >
                        {ticket.title}
                      </TableCell>
                      <TableCell onClick={() => (window.location.href = `/tickets/${ticket.id}`)} className="cursor-pointer">
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell onClick={() => (window.location.href = `/tickets/${ticket.id}`)} className="cursor-pointer">
                        <StatusBadge status={ticket.status} type="ticket" />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={ticket.assignedTo || ""}
                          onValueChange={(operatorId) => {
                            if (operatorId) {
                              assignTicket.mutate({ id: ticket.id, operatorId })
                            }
                          }}
                          disabled={assignTicket.isPending}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Assign..." />
                          </SelectTrigger>
                          <SelectContent>
                            {assignableUsers.map((user: any) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name || user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell 
                        className="text-muted-foreground text-sm cursor-pointer"
                        onClick={() => (window.location.href = `/tickets/${ticket.id}`)}
                      >
                        {formatRelativeTime(ticket.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>

      {/* Modal Component */}
      <CreateTicketModal open={showTicketModal} onOpenChange={setShowTicketModal} />
    </div>
  )
}

export default function DashboardTicketsPage() {
  return (
    <ProtectedRoute roles={["operator", "admin"]}>
      <DashboardTicketsContent />
    </ProtectedRoute>
  )
}
