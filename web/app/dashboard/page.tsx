"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { CreateTicketModal } from "@/components/create-ticket-modal"
import { CreateReservationModal } from "@/components/create-reservation-modal"
import { useTickets } from "@/hooks/use-tickets"
import { useReservations } from "@/hooks/use-reservations"
import { useAssets } from "@/hooks/use-assets"
import { Package, Ticket, Calendar, Plus, CheckCircle2, Clock, XCircle, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { cn } from "@/lib/utils"

function UserDashboard() {
  const { user } = useAuth()
  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [reservationModalOpen, setReservationModalOpen] = useState(false)
  const [ticketFilter, setTicketFilter] = useState<"all" | "active">("all")
  const [reservationFilter, setReservationFilter] = useState<"all" | "active">("all")

  // Fetch real data from backend
  const { data: ticketsResponse } = useTickets()
  const { data: reservationsResponse } = useReservations()
  const { data: assetsResponse } = useAssets()

  // Get user's tickets (filter by requester email or ID)
  // Backend uses: requesterEmail, requestedBy, requestedByUser
  const allUserTickets = (ticketsResponse?.data || []).filter(
    (ticket: any) => {
      const matchesEmail = 
        ticket.requesterEmail === user?.email || 
        ticket.requestedBy === user?.email
      
      const matchesId = 
        ticket.requestedByUser === user?.id ||
        ticket.requestedByUser === user?.sub
      
      return matchesEmail || matchesId
    }
  )

  // Apply ticket filter
  const userTickets = ticketFilter === "active" 
    ? allUserTickets.filter((ticket: any) => 
        !["resolved", "closed", "cancelled"].includes(ticket.status.toLowerCase())
      )
    : allUserTickets

  // Debug logging for tickets
  console.log('[Dashboard] Ticket data:', {
    totalTickets: ticketsResponse?.data?.length || 0,
    userEmail: user?.email,
    userId: user?.id,
    userSub: user?.sub,
    filteredCount: userTickets.length,
    sampleTicket: ticketsResponse?.data?.[0],
  })

  // Get user's reservations
  const allUserReservations = (reservationsResponse?.data || []).filter(
    (res: any) => res.requesterId === user?.id || res.requesterEmail === user?.email
  )

  // Apply reservation filter
  const userReservations = reservationFilter === "active"
    ? allUserReservations.filter((res: any) => 
        !["completed", "cancelled", "rejected", "returned"].includes(res.status.toLowerCase())
      )
    : allUserReservations

  // Get user's assigned assets
  const assignedAssets = (assetsResponse?.data || []).filter(
    (asset: any) => asset.assignedToId === user?.id
  )

  // Get ticket stages for progress bar (similar to reservation)
  const getTicketStages = (status: string) => {
    const stages = [
      { key: "open", label: "Open", icon: Clock },
      { key: "in_progress", label: "In Progress", icon: Clock },
      { key: "resolved", label: "Resolved", icon: CheckCircle2 },
      { key: "closed", label: "Closed", icon: CheckCircle2 },
    ]

    const currentIndex = stages.findIndex((s) => s.key === status)

    return stages.map((stage, index) => ({
      ...stage,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex,
    }))
  }

  // Calculate days remaining for reservation
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, diff)
  }

  const getReservationProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const now = new Date().getTime()

    if (now < start) return 0
    if (now > end) return 100

    const total = end - start
    const elapsed = now - start
    return Math.round((elapsed / total) * 100)
  }

  const getReservationStages = (status: string) => {
    // Determine final stage based on status
    let finalStageLabel = "Returned"
    let finalStageIcon = CheckCircle2
    
    if (status === "denied" || status === "rejected") {
      finalStageLabel = "Rejected"
      finalStageIcon = XCircle
    } else if (status === "cancelled") {
      finalStageLabel = "Cancelled"
      finalStageIcon = XCircle
    }

    const stages = [
      { key: "pending", label: "Pending", icon: Clock },
      { key: "approved", label: "Approved", icon: CheckCircle2 },
      { key: "final", label: finalStageLabel, icon: finalStageIcon },
    ]

    // Determine which stages are active
    let activeUntilIndex = 0
    if (status === "pending") activeUntilIndex = 0
    else if (status === "approved" || status === "active") activeUntilIndex = 1
    else if (status === "returned" || status === "completed") activeUntilIndex = 2
    else if (status === "denied" || status === "rejected") activeUntilIndex = 2
    else if (status === "cancelled") activeUntilIndex = 2

    const isRejected = status === "denied" || status === "rejected"
    const isCancelled = status === "cancelled"

    return stages.map((stage, index) => ({
      ...stage,
      isActive: index <= activeUntilIndex,
      isCurrent: index === activeUntilIndex,
      isRejected,
      isCancelled,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-2">Here's an overview of your IT resources and requests</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button onClick={() => setTicketModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
          <Button variant="outline" onClick={() => setReservationModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Reservation
          </Button>
        </div>

        {/* Assigned Assets */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Assigned Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignedAssets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No assets assigned to you</p>
            ) : (
              <div className="space-y-4">
                {assignedAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Serial: {asset.serialNumber || asset.assetId}</p>
                      <p className="font-medium">{asset.description || asset.type}</p>
                    </div>
                    <Badge variant="secondary">{asset.type}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Tickets */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                My Tickets
              </CardTitle>
              <Select value={ticketFilter} onValueChange={(value: any) => setTicketFilter(value)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {userTickets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tickets submitted</p>
            ) : (
              <div className="space-y-4">
                {userTickets.map((ticket) => {
                  const stages = getTicketStages(ticket.status)
                  return (
                    <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                      <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{ticket.title}</p>
                              <StatusBadge status={ticket.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">{ticket.number}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{formatRelativeTime(ticket.createdAt)}</p>
                        </div>
                        
                        {/* Progress bar with stages - Hidden on mobile */}
                        <div className="hidden md:flex items-center justify-between">
                          {stages.map((stage, index) => {
                            const Icon = stage.icon
                            return (
                              <div key={stage.key} className="flex-1 flex items-center">
                                <div className="flex flex-col items-center flex-1">
                                  <div
                                    className={cn(
                                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                                      stage.isActive
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "bg-background border-muted-foreground/30 text-muted-foreground",
                                    )}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <p className={cn("text-xs mt-1.5 font-medium text-center", stage.isActive ? "text-foreground" : "text-muted-foreground")}>
                                    {stage.label}
                                  </p>
                                </div>
                                {index < stages.length - 1 && (
                                  <div className={cn("h-0.5 flex-1 -mx-2", stage.isActive ? "bg-primary" : "bg-muted-foreground/30")} />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Reservations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                My Reservations
              </CardTitle>
              <Select value={reservationFilter} onValueChange={(value: any) => setReservationFilter(value)}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reservations</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {userReservations.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reservations made</p>
            ) : (
              <div className="space-y-4">
                {userReservations.slice(0, 1).map((reservation) => {
                  const stages = getReservationStages(reservation.status)
                  return (
                    <Link key={reservation.id} href={`/reservations/${reservation.id}`}>
                      <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{reservation.purpose}</p>
                              <StatusBadge status={reservation.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">{reservation.reservationNumber}</p>
                          </div>
                        </div>

                        {/* Progress bar with stages - Hidden on mobile */}
                        <div className="mb-4 hidden md:block">
                          <div className="flex items-center justify-between mb-2">
                            {stages.map((stage, index) => {
                              const Icon = stage.icon
                              const isLastStage = index === stages.length - 1
                              
                              return (
                                <div key={stage.key} className="flex-1 flex items-center">
                                  <div className="flex flex-col items-center flex-1">
                                    <div
                                      className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                        // Cancelled: grey
                                        stage.isCancelled && stage.isActive && "bg-muted border-muted text-muted-foreground",
                                        // Rejected: red
                                        stage.isRejected && stage.isActive && "bg-destructive border-destructive text-destructive-foreground",
                                        // Normal flow: primary or inactive
                                        !stage.isCancelled && !stage.isRejected && stage.isActive && "bg-primary border-primary text-primary-foreground",
                                        !stage.isCancelled && !stage.isRejected && !stage.isActive && "bg-background border-muted-foreground/30 text-muted-foreground",
                                      )}
                                    >
                                      <Icon className="h-5 w-5" />
                                    </div>
                                    <p
                                      className={cn(
                                        "text-xs mt-2 font-medium",
                                        stage.isActive ? "text-foreground" : "text-muted-foreground",
                                      )}
                                    >
                                      {stage.label}
                                    </p>
                                    
                                    {/* Show dates under respective checkpoints */}
                                    {index === 0 && (
                                      <div className="mt-2 text-center">
                                        <p className="text-xs text-muted-foreground">Start Date</p>
                                        <p className="text-xs font-medium">{formatDate(reservation.requestDate || reservation.startDate)}</p>
                                      </div>
                                    )}
                                    {isLastStage && (
                                      <div className="mt-2 text-center">
                                        <p className="text-xs text-muted-foreground">Return Date</p>
                                        <p className="text-xs font-medium">{formatDate(reservation.returnDate || reservation.endDate)}</p>
                                      </div>
                                    )}
                                  </div>
                                  {index < stages.length - 1 && (
                                    <div
                                      className={cn(
                                        "h-0.5 flex-1 -mx-2",
                                        // Cancelled: grey bar
                                        stage.isCancelled && stage.isActive && "bg-muted",
                                        // Rejected: red bar
                                        stage.isRejected && stage.isActive && "bg-destructive",
                                        // Normal flow: primary or inactive
                                        !stage.isCancelled && !stage.isRejected && stage.isActive && "bg-primary",
                                        !stage.isCancelled && !stage.isRejected && !stage.isActive && "bg-muted-foreground/30",
                                      )}
                                    />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Show dates on mobile */}
                        <div className="md:hidden mb-3 flex justify-between text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Start Date</p>
                            <p className="text-xs font-medium">{formatDate(reservation.requestDate || reservation.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Return Date</p>
                            <p className="text-xs font-medium">{formatDate(reservation.returnDate || reservation.endDate)}</p>
                          </div>
                        </div>

                        {reservation.status === "approved" && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Time Remaining</span>
                              <span className="font-medium">{getDaysRemaining(reservation.endDate)} days</span>
                            </div>
                            <Progress
                              value={getReservationProgress(reservation.startDate, reservation.endDate)}
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <CreateTicketModal open={ticketModalOpen} onOpenChange={setTicketModalOpen} />
      <CreateReservationModal open={reservationModalOpen} onOpenChange={setReservationModalOpen} />
    </div>
  )
}

function AdminDashboard() {
  // Fetch real data from backend
  const { data: ticketsResponse, isLoading: ticketsLoading } = useTickets()
  const { data: reservationsResponse, isLoading: reservationsLoading } = useReservations()
  const { data: assetsResponse, isLoading: assetsLoading } = useAssets()

  const isLoading = ticketsLoading || reservationsLoading || assetsLoading

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  const tickets = ticketsResponse?.data || []
  const reservations = reservationsResponse?.data || []
  const assets = assetsResponse?.data || []

  const ticketAnalytics = {
    summary: {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      inProgress: tickets.filter((t) => t.status === "in_progress").length,
      resolved: tickets.filter((t) => t.status === "resolved").length,
      closed: tickets.filter((t) => t.status === "closed").length,
      mttrDays: 2.5,
    },
  }

  const reservationAnalytics = {
    summary: {
      total: reservations.length,
      byStatus: {
        pending: reservations.filter((r) => r.status === "pending").length,
        approved: reservations.filter((r) => r.status === "approved").length,
        active: reservations.filter((r) => r.status === "active").length,
        returned: reservations.filter((r) => r.status === "returned" || r.status === "completed").length,
      },
    },
    performance: {
      approvalRate: reservations.length > 0 
        ? Math.round((reservations.filter((r) => r.status === "approved" || r.status === "active" || r.status === "returned" || r.status === "completed").length / reservations.length) * 100)
        : 0,
      onTimeReturnRate: (() => {
        const completedReservations = reservations.filter((r) => (r.status === "returned" || r.status === "completed") && r.actualReturnDate && r.returnDate)
        if (completedReservations.length === 0) return 0
        const onTimeReturns = completedReservations.filter((r) => new Date(r.actualReturnDate) <= new Date(r.returnDate))
        return Math.round((onTimeReturns.length / completedReservations.length) * 100)
      })(),
    },
  }

  const assetAnalytics = {
    summary: {
      total: assets.length,
      byStatus: {
        available: assets.filter((a) => a.status === "available").length,
        assigned: assets.filter((a) => a.status === "assigned").length,
        maintenance: assets.filter((a) => a.status === "maintenance").length,
      },
      utilizationRate: assets.length > 0 
        ? Math.round((assets.filter((a) => a.status === "assigned").length / assets.length) * 100)
        : 0,
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your IT helpdesk system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketAnalytics.summary.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservationAnalytics.summary.byStatus.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asset Utilization</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetAnalytics.summary.utilizationRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Returns</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservationAnalytics.performance.onTimeReturnRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Tickets</span>
                  <span className="font-bold">{ticketAnalytics.summary.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Open</span>
                  <span className="font-medium text-blue-500">{ticketAnalytics.summary.open}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <span className="font-medium text-amber-500">{ticketAnalytics.summary.inProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resolved</span>
                  <span className="font-medium text-green-500">{ticketAnalytics.summary.resolved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Closed</span>
                  <span className="font-medium text-gray-500">{ticketAnalytics.summary.closed}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">MTTR (Mean Time to Resolve)</span>
                    <span className="font-bold">{ticketAnalytics.summary.mttrDays} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reservation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Reservations</span>
                  <span className="font-bold">{reservationAnalytics.summary.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-medium text-amber-500">{reservationAnalytics.summary.byStatus.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="font-medium text-green-500">{reservationAnalytics.summary.byStatus.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <span className="font-medium text-blue-500">{reservationAnalytics.summary.byStatus.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Returned</span>
                  <span className="font-medium text-gray-500">{reservationAnalytics.summary.byStatus.returned}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Approval Rate</span>
                    <span className="font-bold">{reservationAnalytics.performance.approvalRate}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{assetAnalytics.summary.total}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Assets</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{assetAnalytics.summary.byStatus.available}</p>
                <p className="text-sm text-muted-foreground mt-1">Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">{assetAnalytics.summary.byStatus.assigned}</p>
                <p className="text-sm text-muted-foreground mt-1">Assigned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500">{assetAnalytics.summary.byStatus.maintenance}</p>
                <p className="text-sm text-muted-foreground mt-1">Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function DashboardContent() {
  const { user } = useAuth()

  if (user?.role === "operator") {
    window.location.href = "/dashboard/tickets"
    return <LoadingSpinner fullScreen />
  }

  if (user?.role === "admin") {
    return <AdminDashboard />
  }

  return <UserDashboard />
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
