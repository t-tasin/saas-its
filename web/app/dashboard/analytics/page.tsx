"use client"

import { useState } from "react"
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

function formatHours(value?: number) {
  if (!value && value !== 0) return "—"
  if (value < 1) {
    return `${(value * 60).toFixed(0)}m`
  }
  return `${value.toFixed(1)}h`
}

function formatPercent(value?: number) {
  if (!value && value !== 0) return "—"
  return `${value.toFixed(1)}%`
}

function AnalyticsContent() {
  const [ticketDays, setTicketDays] = useState("30")
  const [reservationDays, setReservationDays] = useState("30")

  const { data: ticketAnalytics, isLoading: ticketsLoading } = useTicketAnalytics(Number(ticketDays))
  const { data: reservationAnalytics, isLoading: reservationsLoading } = useReservationAnalytics(Number(reservationDays))
  const { data: assetAnalytics, isLoading: assetsLoading } = useAssetAnalytics()

  const isLoading = ticketsLoading || reservationsLoading || assetsLoading

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  const ticketSummary = ticketAnalytics?.summary ?? {}
  const ticketTimeToValue = ticketAnalytics?.timeToValue ?? {}
  const ticketWorkload = ticketAnalytics?.workload ?? {}
  const ticketAiImpact = ticketAnalytics?.aiImpact ?? {}
  const ticketTrends = ticketAnalytics?.trends ?? {}

  const ticketStatusData = Object.entries(ticketSummary.statusCounts ?? {}).map(([name, value]) => ({
    name: name.replace("_", " "),
    value,
  }))

  const ticketPriorityData = Object.entries(ticketTrends.byPriority ?? {}).map(([name, value]) => ({
    name: name.replace("_", " "),
    value,
  }))

  const ticketCategoryData = (ticketAnalytics?.categories ?? []).slice(0, 10).map((item: any) => ({
    category: item.category,
    total: item.total,
    open: item.open,
    closed: item.closed,
  }))

  const backlogTrendData = (ticketTrends.backlog ?? []).map((item: any) => ({
    ...item,
    date: item.date,
  }))

  const aiUsageTrend = (ticketTrends.aiUsage ?? []).map((item: any) => ({
    date: item.date,
    created: item.created,
    resolved: item.resolved,
  }))

  const technicianLoad = ticketWorkload.ticketsPerTechnician ?? []
  const backlogAging = ticketWorkload.backlogAging ?? {}

  const reservationTrendData = (reservationAnalytics?.trend ?? []).slice(-14).map((item: any) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    created: item.created,
    approved: item.approved,
    returned: item.returned,
  }))

  const reservationEquipmentData = reservationAnalytics?.equipment?.mostRequested?.slice(0, 10).map((item: any) => ({
    name: item.equipmentType,
    count: item.count,
  })) ?? []

  const assetTypeData = assetAnalytics?.breakdown?.byType?.map((item: any) => ({
    name: item.type,
    total: item.total,
    available: item.available,
    assigned: item.assigned,
  })) ?? []

  const assetWarranty = assetAnalytics?.financial?.warranty ?? { expiringSoonCount: 0, expiredCount: 0, expiringSoon: [] }
  const assetCompliance = assetAnalytics?.compliance ?? { policyViolationCount: 0, policyViolations: [] }
  const assetFinancial = assetAnalytics?.financial ?? {}

  const reservationPerformance = reservationAnalytics?.performance ?? {}
  const reservationReadiness = reservationAnalytics?.readiness ?? {}

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <PageHeader title="Analytics Dashboard" description="Comprehensive system analytics and insights" />

        {/* Ticket Analytics */}
        <section className="mb-10">
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

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Service Quality (SLA)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard label="First Response (avg)" value={formatHours(ticketTimeToValue.meanFirstResponseHours)} helper="Median: " helperValue={formatHours(ticketTimeToValue.medianFirstResponseHours)} />
                <MetricCard label="MTTR" value={formatHours(ticketTimeToValue.mttrHours)} helper="Closed: " helperValue={formatHours(ticketTimeToValue.mttrClosedHours)} />
                <MetricCard label="SLA Attainment" value={formatPercent(ticketTimeToValue.slaAttainmentRate)} helper="Breaches" helperValue={String(ticketTimeToValue.openSlaBreaches ?? 0)} />
                <MetricCard label="Reopen Rate" value={formatPercent(ticketTimeToValue.reopenRate)} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Operational Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Tickets per Technician</h4>
                    <div className="space-y-2">
                      {technicianLoad.length === 0 && <p className="text-sm text-muted-foreground">No active assignments</p>}
                      {technicianLoad.slice(0, 6).map((tech: any) => (
                        <div key={tech.technicianId} className="flex items-center justify-between rounded-md border px-3 py-2">
                          <span className="text-sm font-medium truncate mr-2">{tech.technicianId || "Unassigned"}</span>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{tech.ticketCount}</p>
                            <p className="text-xs text-muted-foreground">{formatPercent(tech.shareOfOpen ?? 0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Backlog Aging</h4>
                    <div className="space-y-2">
                      {[
                        { label: "&lt; 24h", value: backlogAging.under24h ?? 0 },
                        { label: "1-3 days", value: backlogAging.oneToThreeDays ?? 0 },
                        { label: "3-7 days", value: backlogAging.threeToSevenDays ?? 0 },
                        { label: "> 7 days", value: backlogAging.overSevenDays ?? 0 },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between rounded-md border px-3 py-2">
                          <span className="text-sm">{item.label}</span>
                          <span className="text-sm font-semibold">{item.value}</span>
                        </div>
                      ))}
                      <div className="mt-4 rounded-md border px-3 py-2">
                        <p className="text-sm font-semibold">Urgent / Past Due</p>
                        <p className="text-lg">{ticketWorkload.urgentOrPastDue ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Tickets requiring immediate attention</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Impact (NL Gateway)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <MetricBlock title="AI-created Tickets" primary={ticketAiImpact.totalAiTickets ?? 0} secondary={`${formatPercent(ticketAiImpact.aiSharePercent ?? 0)} of volume`} />
                  <MetricBlock title="Open AI Tickets" primary={ticketAiImpact.openAiTickets ?? 0} secondary={`Overrides: ${ticketAiImpact.overrideCount ?? 0}`} />
                  <MetricBlock title="Human Override Rate" primary={formatPercent(ticketAiImpact.humanOverrideRate ?? 0)} secondary={`Accuracy ${formatPercent(ticketAiImpact.autoClassificationAccuracy ?? 0)}`} />
                  <MetricBlock title="AI MTTR" primary={formatHours(ticketAiImpact.aiResolutionHours ?? 0)} secondary="Average resolution for AI routed" />
                </div>
                <div className="mt-6 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aiUsageTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="created" stroke="#3B82F6" name="AI Created" />
                      <Line type="monotone" dataKey="resolved" stroke="#10B981" name="AI Resolved" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
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
                      dataKey="value"
                    >
                      {ticketPriorityData.map((entry, index) => (
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

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Tickets by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={ticketCategoryData}>
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
        </section>

        {/* Reservation Analytics */}
        <section className="mb-10">
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

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
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
                  <BarChart data={reservationEquipmentData} layout="vertical">
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
              <CardTitle>Readiness & Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard label="Approval Rate" value={formatPercent(reservationAnalytics?.summary?.approvalRate ?? 0)} helper="Auto" helperValue={formatPercent(reservationReadiness.autoApprovalRate ?? 0)} />
                <MetricCard label="Approval Lead" value={formatHours(reservationReadiness.avgApprovalLeadHours ?? 0)} helper="Median" helperValue={formatHours(reservationReadiness.medianApprovalLeadHours ?? 0)} />
                <MetricCard label="On-time Returns" value={formatPercent(reservationPerformance.onTimeReturnRate ?? 0)} helper="Usage" helperValue={`${(reservationPerformance.avgUsageDays ?? 0).toFixed(1)}d`} />
                <MetricCard label="Conflict Rate" value={formatPercent(reservationReadiness.conflictRate ?? 0)} helper="Conflicts" helperValue={String(reservationReadiness.conflictCount ?? 0)} />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Asset Analytics */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Asset Analytics</h2>
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
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
                <CardTitle>Financial & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between rounded-md border px-4 py-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Book Value</p>
                      <p className="text-lg font-semibold">${(assetFinancial.totalBookValue ?? 0).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Cost / Utilized Day</p>
                      <p className="text-lg font-semibold">${(assetFinancial.costPerUtilizedDay ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <div className="rounded-md border px-4 py-3">
                    <p className="text-sm font-semibold">Warranty Watch</p>
                    <div className="flex justify-between text-sm mt-2">
                      <span>Expiring soon (90d)</span>
                      <span>{assetWarranty.expiringSoonCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expired</span>
                      <span>{assetWarranty.expiredCount}</span>
                    </div>
                  </div>
                  <div className="rounded-md border px-4 py-3">
                    <p className="text-sm font-semibold">Policy Violations</p>
                    <p className="text-2xl font-semibold text-destructive">{assetCompliance.policyViolationCount}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {assetCompliance.policyViolations?.slice(0, 2).map((violation: any) => violation.issue).join(" • ") || "No outstanding issues"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

function MetricCard({ label, value, helper, helperValue }: { label: string; value: string; helper?: string; helperValue?: string }) {
  return (
    <div className="rounded-lg border px-4 py-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      {helper && helperValue && (
        <p className="text-xs text-muted-foreground mt-1">
          {helper}
          <span className="font-medium text-foreground">{helperValue}</span>
        </p>
      )}
    </div>
  )
}

function MetricBlock({ title, primary, secondary }: { title: string; primary: string | number; secondary?: string }) {
  return (
    <div className="rounded-lg border px-4 py-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
      <p className="text-xl font-semibold">{typeof primary === "number" ? primary.toLocaleString() : primary}</p>
      {secondary && <p className="text-xs text-muted-foreground mt-1">{secondary}</p>}
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
