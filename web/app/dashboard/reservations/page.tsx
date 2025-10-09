"use client"

import { useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { ReservationCard } from "@/components/reservation-card"
import { EmptyState } from "@/components/empty-state"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useReservations } from "@/hooks/use-reservations"
import { Plus, Calendar } from "lucide-react"

function DashboardReservationsContent() {
  const [status, setStatus] = useState<string>("all")

  const params: any = {}
  if (status !== "all") params.status = status

  const { data: reservations, isLoading, error } = useReservations(params)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <PageHeader
          title="Reservation Management"
          description="Manage all equipment reservations"
          action={
            <Link href="/reservations/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Reservation
              </Button>
            </Link>
          }
        />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reservations Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load reservations. Please try again.</p>
          </div>
        ) : reservations?.data?.length === 0 ? (
          <EmptyState
            icon={<Calendar className="h-12 w-12" />}
            title="No reservations found"
            description="Try adjusting your filters or create a new reservation."
            action={{
              label: "Create Reservation",
              onClick: () => (window.location.href = "/reservations/new"),
            }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations?.data?.map((reservation: any) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function DashboardReservationsPage() {
  return (
    <ProtectedRoute roles={["operator", "admin"]}>
      <DashboardReservationsContent />
    </ProtectedRoute>
  )
}
