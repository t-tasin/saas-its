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
import { useTickets, useTicketAnalytics } from "@/hooks/use-tickets"
import { useReservations, useReservationAnalytics } from "@/hooks/use-reservations"
import { useAssets, useAssetAnalytics } from "@/hooks/use-assets"
import { Package, Ticket, Calendar, Plus, CheckCircle2, Clock, XCircle, Filter, Activity, Gauge, BarChart3 } from "lucide-react"
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
  const { data: ticketsResponse, isLoading: ticketsLoading } = useTickets()
  const { data: reservationsResponse, isLoading: reservationsLoading } = useReservations()
  const { data: assetsResponse, isLoading: assetsLoading } = useAssets()
  const { data: ticketAnalytics, isLoading: ticketAnalyticsLoading } = useTicketAnalytics(30)
  const { data: reservationAnalytics, isLoading: reservationAnalyticsLoading } = useReservationAnalytics(30)
  const { data: assetAnalytics, isLoading: assetAnalyticsLoading } = useAssetAnalytics()

  const isLoading =
    ticketsLoading ||
    reservationsLoading ||
    assetsLoading ||
    ticketAnalyticsLoading ||
    reservationAnalyticsLoading ||
    assetAnalyticsLoading

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  const tickets = ticketsResponse?.data || []
  const reservations = reservationsResponse?.data || []
  const assets = assetsResponse?.data || []

  const statusCounts = ticketAnalytics?.summary?.statusCounts ?? {
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  }

  const totalTickets = ticketAnalytics?.summary?.total ?? tickets.length
  const openTickets = statusCounts.open ?? 0
  const inProgressTickets = statusCounts.in_progress ?? 0
  const resolvedTickets = statusCounts.resolved ?? 0
  const closedTickets = statusCounts.closed ?? 0

  const reservationSummary = {
    total: reservationAnalytics?.summary?.total ?? reservations.length,
    byStatus: {
      pending:
        reservationAnalytics?.summary?.byStatus?.pending ??
        reservations.filter((r) => r.status === "pending").length,
      approved:
        reservationAnalytics?.summary?.byStatus?.approved ??
        reservations.filter((r) => r.status === "approved").length,
      active:
        reservationAnalytics?.summary?.byStatus?.active ??
        reservations.filter((r) => r.status === "active").length,
      returned:
        reservationAnalytics?.summary?.byStatus?.returned ??
        reservations.filter((r) => r.status === "returned" || r.status === "completed").length,
      cancelled:
        reservationAnalytics?.summary?.byStatus?.cancelled ??
        reservations.filter((r) => r.status === "cancelled").length,
    },
    approvalRate: reservationAnalytics?.summary?.approvalRate ?? 0,
  }

  const reservationPerformance = reservationAnalytics?.performance ?? {
    onTimeReturnRate: 0,
    avgUsageDays: 0,
    avgDelayDays: 0,
  }

  const reservationReadiness = reservationAnalytics?.readiness ?? {
    autoApprovalRate: 0,
    autoApprovedCount: 0,
    avgApprovalLeadHours: 0,
    medianApprovalLeadHours: 0,
    conflictRate: 0,
    conflictCount: 0,
  }

  const upcomingDue = reservationAnalytics?.upcoming?.reservations ?? []

  const assetSummary = {
    total: assetAnalytics?.summary?.total ?? assets.length,
    byStatus: {
      available:
        assetAnalytics?.summary?.byStatus?.available ??
        assets.filter((a) => a.status === "available").length,
      assigned:
        assetAnalytics?.summary?.byStatus?.assigned ??
        assets.filter((a) => a.status === "assigned").length,
      maintenance:
        assetAnalytics?.summary?.byStatus?.maintenance ??
        assets.filter((a) => a.status === "maintenance").length,
      retired:
        assetAnalytics?.summary?.byStatus?.retired ??
        assets.filter((a) => a.status === "retired").length,
    },
    utilizationRate:
      assetAnalytics?.summary?.utilizationRate ??
      (assets.length
        ? Math.round((assets.filter((a) => a.status === "assigned").length / assets.length) * 100)
        : 0),
  }

  const assetFinancial = assetAnalytics?.financial ?? {
    totalBookValue: 0,
    avgCostByType: [],
    costPerUtilizedDay: 0,
    warranty: { expiringSoonCount: 0, expiredCount: 0, expiringSoon: [] },
  }

  const assetCompliance = assetAnalytics?.compliance ?? {
    policyViolationCount: 0,
    policyViolations: [],
  }

  const timeToValue = ticketAnalytics?.timeToValue ?? {
    meanFirstResponseHours: undefined,
    medianFirstResponseHours: undefined,
    mttrHours: undefined,
    mttrClosedHours: undefined,
    slaAttainmentRate: undefined,
    openSlaBreaches: undefined,
    reopenRate: undefined,
  }

  const workload = ticketAnalytics?.workload ?? {
    ticketsPerTechnician: [],
    backlogAging: { under24h: 0, oneToThreeDays: 0, threeToSevenDays: 0, overSevenDays: 0 },
    unassignedOpen: 0,
    urgentOrPastDue: 0,
    totalEscalations: 0,
    escalationRate: 0,
    escalationReasons: { sla_breach: 0, impact_level: 0, manual: 0 },
  }

  const customerFeedback = ticketAnalytics?.customerFeedback ?? {
    avgCsat: 0,
    csatResponseRate: 0,
    totalResponses: 0,
    csatDistribution: { excellent: 0, good: 0, neutral: 0, poor: 0, veryPoor: 0 },
  }

  const impactDistribution = ticketAnalytics?.trends?.byImpact ?? {
    P1: tickets.filter((t) => t.impactLevel === "P1").length,
    P2: tickets.filter((t) => t.impactLevel === "P2").length,
    P3: tickets.filter((t) => t.impactLevel === "P3").length,
    P4: tickets.filter((t) => t.impactLevel === "P4").length,
  }

  const formatHours = (value?: number) => {
    if (value === undefined || value === null || Number.isNaN(value)) return "—"
    if (Math.abs(value) < 1) {
      return `${Math.max(1, Math.round(value * 60))}m`
    }
    return `${value.toFixed(1)}h`
  }

  const formatPercent = (value?: number) => {
    if (value === undefined || value === null || Number.isNaN(value)) return "—"
    return `${value.toFixed(1)}%`
  }

  const formatDays = (value?: number) => {
    if (value === undefined || value === null || Number.isNaN(value)) return "—"
    return `${value.toFixed(1)}d`
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null || Number.isNaN(value)) return "—"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
  }

  const topTechnicians = (workload.ticketsPerTechnician ?? []).slice(0, 4)
  const backlog = workload.backlogAging ?? {
    under24h: 0,
    oneToThreeDays: 0,
    threeToSevenDays: 0,
    overSevenDays: 0,
  }
  const escalationReasons = workload.escalationReasons ?? {
    sla_breach: 0,
    impact_level: 0,
    manual: 0,
  }
  const assetWarranty = assetFinancial.warranty ?? {
    expiringSoonCount: 0,
    expiredCount: 0,
    expiringSoon: [],
  }
  const assetOverviewStats = [
    { label: "Total Assets", value: assetSummary.total, accent: "" },
    { label: "Available", value: assetSummary.byStatus.available, accent: "text-green-500" },
    { label: "Assigned", value: assetSummary.byStatus.assigned, accent: "text-blue-500" },
    { label: "Maintenance", value: assetSummary.byStatus.maintenance, accent: "text-amber-500" },
    { label: "Retired", value: assetSummary.byStatus.retired ?? 0, accent: "text-muted-foreground" },
  ]
  const csatBuckets = [
    { label: "Excellent (5)", value: customerFeedback.csatDistribution?.excellent ?? 0 },
    { label: "Good (4)", value: customerFeedback.csatDistribution?.good ?? 0 },
    { label: "Neutral (3)", value: customerFeedback.csatDistribution?.neutral ?? 0 },
    { label: "Poor (2)", value: customerFeedback.csatDistribution?.poor ?? 0 },
    { label: "Very Poor (1)", value: customerFeedback.csatDistribution?.veryPoor ?? 0 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your IT helpdesk system</p>
        </div>

        {/* Primary Stats */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {inProgressTickets} in progress • {workload.unassignedOpen} unassigned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reservationSummary.byStatus.pending.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {reservationSummary.byStatus.approved.toLocaleString()} approved •{" "}
                {reservationSummary.byStatus.active.toLocaleString()} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asset Utilization</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetSummary.utilizationRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {assetSummary.byStatus.assigned.toLocaleString()} assigned •{" "}
                {assetSummary.byStatus.available.toLocaleString()} available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Returns</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercent(reservationPerformance.onTimeReturnRate)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg usage {formatDays(reservationPerformance.avgUsageDays)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Service Quality Snapshot */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SLA Attainment</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercent(timeToValue.slaAttainmentRate)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {timeToValue.openSlaBreaches ?? 0} open breaches
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">First Response (avg)</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatHours(timeToValue.meanFirstResponseHours)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Median {formatHours(timeToValue.medianFirstResponseHours)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mean Time to Resolve</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatHours(timeToValue.mttrHours)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Closed MTTR {formatHours(timeToValue.mttrClosedHours)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg CSAT</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {customerFeedback.avgCsat ? customerFeedback.avgCsat.toFixed(1) : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Response rate {formatPercent(customerFeedback.csatResponseRate)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ticket & Reservation Summary */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Tickets</span>
                  <span className="font-semibold">{totalTickets.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Open</span>
                  <span className="font-medium text-blue-500">{openTickets.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <span className="font-medium text-amber-500">{inProgressTickets.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resolved</span>
                  <span className="font-medium text-green-500">{resolvedTickets.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Closed</span>
                  <span className="font-medium text-muted-foreground">{closedTickets.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 border-t pt-4 mt-4">
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Reopen Rate</p>
                  <p className="text-lg font-semibold">{formatPercent(timeToValue.reopenRate)}</p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Urgent / Past Due</p>
                  <p className="text-lg font-semibold">{workload.urgentOrPastDue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reservation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Reservations</span>
                  <span className="font-semibold">{reservationSummary.total.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-medium text-amber-500">
                    {reservationSummary.byStatus.pending.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="font-medium text-green-500">
                    {reservationSummary.byStatus.approved.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <span className="font-medium text-blue-500">
                    {reservationSummary.byStatus.active.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Returned</span>
                  <span className="font-medium text-muted-foreground">
                    {reservationSummary.byStatus.returned.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cancelled</span>
                  <span className="font-medium text-rose-500">
                    {reservationSummary.byStatus.cancelled.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 border-t pt-4 mt-4">
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Approval Rate</p>
                  <p className="text-lg font-semibold">
                    {formatPercent(reservationSummary.approvalRate)}
                  </p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">On-Time Returns</p>
                  <p className="text-lg font-semibold">
                    {formatPercent(reservationPerformance.onTimeReturnRate)}
                  </p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Avg Utilization</p>
                  <p className="text-lg font-semibold">
                    {formatDays(reservationPerformance.avgUsageDays)}
                  </p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Avg Late Return</p>
                  <p className="text-lg font-semibold">
                    {formatDays(reservationPerformance.avgDelayDays)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid xl:grid-cols-3 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Operator Workload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold mb-2">Tickets per Technician</p>
                  {topTechnicians.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No active assignments</p>
                  ) : (
                    <div className="space-y-2">
                      {topTechnicians.map((tech) => (
                        <div
                          key={tech.technicianId || "unassigned"}
                          className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                          <div className="text-sm font-medium truncate mr-3">
                            {tech.technicianId || "Unassigned"}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{tech.ticketCount}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatPercent(tech.shareOfOpen)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Backlog Aging (Open)</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "< 24h", value: backlog.under24h ?? 0 },
                      { label: "1-3 days", value: backlog.oneToThreeDays ?? 0 },
                      { label: "3-7 days", value: backlog.threeToSevenDays ?? 0 },
                      { label: "> 7 days", value: backlog.overSevenDays ?? 0 },
                    ].map((bucket) => (
                      <div
                        key={bucket.label}
                        className="rounded-md border px-3 py-2 flex items-center justify-between text-sm"
                      >
                        <span>{bucket.label}</span>
                        <span className="font-semibold">{bucket.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback &amp; Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {customerFeedback.totalResponses} feedback responses captured
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {csatBuckets.map((bucket) => (
                  <div key={bucket.label} className="rounded-md border px-3 py-2">
                    <p className="text-xs text-muted-foreground uppercase">{bucket.label}</p>
                    <p className="text-lg font-semibold">{bucket.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-md border px-3 py-2">
                <p className="text-xs text-muted-foreground uppercase">CSAT Response Rate</p>
                <p className="text-lg font-semibold">
                  {formatPercent(customerFeedback.csatResponseRate)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Impact &amp; Escalations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(impactDistribution).map(([level, count]) => (
                  <div key={level} className="rounded-md border px-3 py-2">
                    <p className="text-xs text-muted-foreground uppercase">Impact {level}</p>
                    <p className="text-lg font-semibold">{count}</p>
                  </div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-3 border-t pt-4 mt-4">
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Total Escalations</p>
                  <p className="text-lg font-semibold">
                    {workload.totalEscalations} · {formatPercent(workload.escalationRate)}
                  </p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Reasons</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    SLA {escalationReasons.sla_breach ?? 0} • Impact {escalationReasons.impact_level ?? 0} •
                    Manual {escalationReasons.manual ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {assetOverviewStats.map((stat) => (
                  <div key={stat.label} className="rounded-md border px-4 py-3 text-center">
                    <p className={`text-2xl font-bold ${stat.accent}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asset Financial &amp; Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Total Book Value</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(assetFinancial.totalBookValue)}
                  </p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Cost / Utilized Day</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(assetFinancial.costPerUtilizedDay)}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Warranty Expiring (90d)</p>
                  <p className="text-lg font-semibold">{assetWarranty.expiringSoonCount ?? 0}</p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Warranty Expired</p>
                  <p className="text-lg font-semibold">{assetWarranty.expiredCount ?? 0}</p>
                </div>
              </div>
              <div className="mt-4 rounded-md border px-3 py-2">
                <p className="text-xs text-muted-foreground uppercase">Policy Violations</p>
                <p className="text-lg font-semibold text-destructive">
                  {assetCompliance.policyViolationCount ?? 0}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(assetCompliance.policyViolations ?? [])
                    .slice(0, 2)
                    .map((violation: any) => violation.issue)
                    .join(" • ") || "No outstanding issues"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reservation Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Auto Approval Rate</p>
                  <p className="text-lg font-semibold">
                    {formatPercent(reservationReadiness.autoApprovalRate)}
                  </p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Median Lead Time</p>
                  <p className="text-lg font-semibold">
                    {formatHours(reservationReadiness.medianApprovalLeadHours)}
                  </p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Conflict Rate</p>
                  <p className="text-lg font-semibold">
                    {formatPercent(reservationReadiness.conflictRate)}
                  </p>
                </div>
                <div className="rounded-md border px-3 py-2">
                  <p className="text-xs text-muted-foreground uppercase">Conflict Count</p>
                  <p className="text-lg font-semibold">
                    {reservationReadiness.conflictCount ?? 0}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground uppercase mb-2">Due within 7 days</p>
                {upcomingDue.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming returns</p>
                ) : (
                  <div className="space-y-2">
                    {upcomingDue.slice(0, 4).map((due: any) => (
                      <div
                        key={due.id}
                        className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                      >
                        <span className="truncate mr-3">
                          {due.equipmentType} × {due.quantity}
                        </span>
                        <span className="text-muted-foreground">{formatDate(due.returnDate)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
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
