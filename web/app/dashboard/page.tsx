"use client"

import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTicketAnalytics } from "@/hooks/use-tickets"
import { useReservationAnalytics } from "@/hooks/use-reservations"
import { useAssetAnalytics } from "@/hooks/use-assets"
import { Ticket, Calendar, Package, TrendingUp } from "lucide-react"

function DashboardContent() {
  const { data: ticketAnalytics, isLoading: ticketsLoading } = useTicketAnalytics(30)
  const { data: reservationAnalytics, isLoading: reservationsLoading } = useReservationAnalytics(30)
  const { data: assetAnalytics, isLoading: assetsLoading } = useAssetAnalytics()

  const isLoading = ticketsLoading || reservationsLoading || assetsLoading

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <PageHeader title="Dashboard" description="Overview of your IT helpdesk system" />

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Open Tickets"
            value={ticketAnalytics?.summary?.open || 0}
            icon={<Ticket className="h-4 w-4" />}
          />
          <StatCard
            title="Pending Reservations"
            value={reservationAnalytics?.summary?.byStatus?.pending || 0}
            icon={<Calendar className="h-4 w-4" />}
          />
          <StatCard
            title="Asset Utilization"
            value={`${assetAnalytics?.summary?.utilizationRate || 0}%`}
            icon={<Package className="h-4 w-4" />}
          />
          <StatCard
            title="On-Time Returns"
            value={`${reservationAnalytics?.performance?.onTimeReturnRate || 0}%`}
            icon={<TrendingUp className="h-4 w-4" />}
          />
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
                  <span className="font-bold">{ticketAnalytics?.summary?.total || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Open</span>
                  <span className="font-medium text-blue-500">{ticketAnalytics?.summary?.open || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <span className="font-medium text-amber-500">{ticketAnalytics?.summary?.inProgress || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resolved</span>
                  <span className="font-medium text-green-500">{ticketAnalytics?.summary?.resolved || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Closed</span>
                  <span className="font-medium text-gray-500">{ticketAnalytics?.summary?.closed || 0}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">MTTR (Mean Time to Resolve)</span>
                    <span className="font-bold">{ticketAnalytics?.summary?.mttrDays || 0} days</span>
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
                  <span className="font-bold">{reservationAnalytics?.summary?.total || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="font-medium text-amber-500">
                    {reservationAnalytics?.summary?.byStatus?.pending || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="font-medium text-green-500">
                    {reservationAnalytics?.summary?.byStatus?.approved || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <span className="font-medium text-blue-500">
                    {reservationAnalytics?.summary?.byStatus?.active || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Returned</span>
                  <span className="font-medium text-gray-500">
                    {reservationAnalytics?.summary?.byStatus?.returned || 0}
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Approval Rate</span>
                    <span className="font-bold">{reservationAnalytics?.performance?.approvalRate || 0}%</span>
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
                <p className="text-3xl font-bold">{assetAnalytics?.summary?.total || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Assets</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{assetAnalytics?.summary?.byStatus?.available || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">{assetAnalytics?.summary?.byStatus?.assigned || 0}</p>
                <p className="text-sm text-muted-foreground mt-1">Assigned</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-amber-500">
                  {assetAnalytics?.summary?.byStatus?.maintenance || 0}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
