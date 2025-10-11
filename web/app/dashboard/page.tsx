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
import mockData from "@/data/mock-data.json"
import { Package, Ticket, Calendar, Plus, CheckCircle2, Clock, XCircle } from "lucide-react"
import { formatDate, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { cn } from "@/lib/utils"

function UserDashboard() {
  const { user } = useAuth()
  const [ticketModalOpen, setTicketModalOpen] = useState(false)
  const [reservationModalOpen, setReservationModalOpen] = useState(false)

  // Fetch real data from backend
  const { data: ticketsResponse } = useTickets()
  const { data: reservationsResponse } = useReservations()
  const { data: assetsResponse } = useAssets()

  // Get user's tickets (filter by requester email or ID)
  const userTickets = (ticketsResponse?.data || []).filter(
    (ticket: any) => 
      ticket.requesterEmail === user?.email || 
      ticket.requestedBy === user?.email ||
      ticket.requesterId === user?.id
  )

  // Get user's reservations
  const userReservations = (reservationsResponse?.data || []).filter(
    (res: any) => res.requesterId === user?.id || res.requesterEmail === user?.email
  )

  // Get user's assigned assets
  const assignedAssets = (assetsResponse?.data || []).filter(
    (asset: any) => asset.assignedToId === user?.id
  )

  // Calculate progress for tickets (based on status)
  const getTicketProgress = (status: string) => {
    switch (status) {
      case "open":
        return 25
      case "in_progress":
        return 50
      case "resolved":
        return 75
      case "closed":
        return 100
      default:
        return 0
    }
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
    const stages = [
      { key: "pending", label: "Pending", icon: Clock },
      { key: "approved", label: "Approved", icon: CheckCircle2 },
      { key: "rejected", label: "Rejected", icon: XCircle },
      { key: "cancelled", label: "Cancelled", icon: XCircle },
    ]

    const currentIndex = stages.findIndex((s) => s.key === status)

    return stages.map((stage, index) => ({
      ...stage,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex,
      isRejected: status === "rejected" && stage.key === "rejected",
      isCancelled: status === "cancelled" && stage.key === "cancelled",
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-2">Here's an overview of your IT resources and requests</p>
        </div>

        <div className="flex gap-3 mb-6">
          <Button onClick={() => setTicketModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
          <Button variant="outline" onClick={() => setReservationModalOpen(true)}>
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
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-sm text-muted-foreground">Serial: {asset.serialNumber}</p>
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
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              My Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userTickets.length === 0 ? (
              <p className="text-muted-foreground text-sm">No tickets submitted</p>
            ) : (
              <div className="space-y-4">
                {userTickets.map((ticket) => (
                  <Link key={ticket.id} href={`/tickets/${ticket.id}`}>
                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{ticket.title}</p>
                            <StatusBadge status={ticket.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">{ticket.number}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(ticket.createdAt)}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{getTicketProgress(ticket.status)}%</span>
                        </div>
                        <Progress value={getTicketProgress(ticket.status)} className="h-2" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Reservations
            </CardTitle>
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

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            {stages.map((stage, index) => {
                              const Icon = stage.icon
                              return (
                                <div key={stage.key} className="flex-1 flex items-center">
                                  <div className="flex flex-col items-center flex-1">
                                    <div
                                      className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                        stage.isActive
                                          ? "bg-primary border-primary text-primary-foreground"
                                          : "bg-background border-muted-foreground/30 text-muted-foreground",
                                        (stage.isRejected || stage.isCancelled) &&
                                          "bg-destructive border-destructive text-destructive-foreground",
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
                                  </div>
                                  {index < stages.length - 1 && (
                                    <div
                                      className={cn(
                                        "h-0.5 flex-1 -mx-2",
                                        stage.isActive ? "bg-primary" : "bg-muted-foreground/30",
                                      )}
                                    />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">{formatDate(reservation.startDate)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Return Date</p>
                            <p className="font-medium">{formatDate(reservation.endDate)}</p>
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
  const ticketAnalytics = {
    summary: {
      total: mockData.tickets.length,
      open: mockData.tickets.filter((t) => t.status === "open").length,
      inProgress: mockData.tickets.filter((t) => t.status === "in_progress").length,
      resolved: mockData.tickets.filter((t) => t.status === "resolved").length,
      closed: mockData.tickets.filter((t) => t.status === "closed").length,
      mttrDays: 2.5,
    },
  }

  const reservationAnalytics = {
    summary: {
      total: mockData.reservations.length,
      byStatus: {
        pending: mockData.reservations.filter((r) => r.status === "pending").length,
        approved: mockData.reservations.filter((r) => r.status === "approved").length,
        active: mockData.reservations.filter((r) => r.status === "active").length,
        returned: mockData.reservations.filter((r) => r.status === "returned").length,
      },
    },
    performance: {
      approvalRate: 85,
      onTimeReturnRate: 92,
    },
  }

  const assetAnalytics = {
    summary: {
      total: mockData.assets.length,
      byStatus: {
        available: mockData.assets.filter((a) => a.status === "available").length,
        assigned: mockData.assets.filter((a) => a.status === "assigned").length,
        maintenance: mockData.assets.filter((a) => a.status === "maintenance").length,
      },
      utilizationRate: 65,
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
