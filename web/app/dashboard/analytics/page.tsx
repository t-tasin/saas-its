"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTicketAnalytics } from "@/hooks/use-tickets"
import { useReservationAnalytics } from "@/hooks/use-reservations"
import { useAssetAnalytics } from "@/hooks/use-assets"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

function AnalyticsContent() {
  const [ticketDays, setTicketDays] = useState("30")
  const [reservationDays, setReservationDays] = useState("30")

  const { data: ticketAnalytics, isLoading: ticketsLoading } = useTicketAnalytics(Number(ticketDays))
  const { data: reservationAnalytics, isLoading: reservationsLoading } = useReservationAnalytics(
    Number(reservationDays),
  )
  const { data: assetAnalytics, isLoading: assetsLoading } = useAssetAnalytics()

  const isLoading = ticketsLoading || reservationsLoading || assetsLoading

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  // Prepare chart data
  const ticketPriorityData =
    ticketAnalytics?.trends?.byPriority?.map((item: any) => ({
      name: item.priority,
      value: item.count,
    })) || []

  const ticketStatusData =
    ticketAnalytics?.trends?.byStatus?.map((item: any) => ({
      name: item.status.replace("_", " "),
      value: item.count,
    })) || []

  const categoryData =
    ticketAnalytics?.categories?.slice(0, 10).map((item: any) => ({
      category: item.category,
      total: item.total,
      open: item.open,
      closed: item.closed,
    })) || []

  const reservationTrendData =
    reservationAnalytics?.trend?.slice(-14).map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      created: item.created,
      approved: item.approved,
      returned: item.returned,
    })) || []

  const equipmentData =
    reservationAnalytics?.equipment?.mostRequested?.slice(0, 10).map((item: any) => ({
      name: item.equipmentType,
      count: item.count,
    })) || []

  const assetTypeData =
    assetAnalytics?.byType?.map((item: any) => ({
      name: item.type,
      total: item.total,
      available: item.available,
      assigned: item.assigned,
    })) || []

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <PageHeader title="Analytics Dashboard" description="Comprehensive system analytics and insights" />

        {/* Ticket Analytics Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Ticket Analytics</h2>
            <Select value={ticketDays} onValueChange={setTicketDays}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Tickets by Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ticketPriorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ticketPriorityData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tickets by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ticketStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tickets by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3B82F6" name="Total" />
                  <Bar dataKey="open" fill="#F59E0B" name="Open" />
                  <Bar dataKey="closed" fill="#10B981" name="Closed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Reservation Analytics Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Reservation Analytics</h2>
            <Select value={reservationDays} onValueChange={setReservationDays}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reservationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="created" stroke="#3B82F6" name="Created" />
                    <Line type="monotone" dataKey="approved" stroke="#10B981" name="Approved" />
                    <Line type="monotone" dataKey="returned" stroke="#6B7280" name="Returned" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Requested Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={equipmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <p className="text-4xl font-bold text-green-500">
                    {reservationAnalytics?.performance?.approvalRate || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Approval Rate</p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <p className="text-4xl font-bold text-blue-500">
                    {reservationAnalytics?.performance?.onTimeReturnRate || 0}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">On-Time Return Rate</p>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <p className="text-4xl font-bold text-amber-500">
                    {reservationAnalytics?.performance?.avgUsageDays || 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Avg Usage Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Analytics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Asset Analytics</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Assets by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assetTypeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3B82F6" name="Total" />
                    <Bar dataKey="available" fill="#10B981" name="Available" />
                    <Bar dataKey="assigned" fill="#F59E0B" name="Assigned" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Utilization Rate</span>
                      <span className="text-2xl font-bold">{assetAnalytics?.summary?.utilizationRate || 0}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{ width: `${assetAnalytics?.summary?.utilizationRate || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold">{assetAnalytics?.summary?.total || 0}</p>
                      <p className="text-xs text-muted-foreground mt-1">Total Assets</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-amber-500">
                        {assetAnalytics?.aging?.needsRefresh?.count || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Needs Refresh (3+ years)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}
