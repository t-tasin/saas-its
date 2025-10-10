import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { reservationApi } from "@/lib/api-client"
import type { CreateReservationData } from "@/types"
import toast from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context"

// Transform backend status to UI format
const transformStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    CANCELLED: "cancelled",
  }
  return statusMap[status] || status.toLowerCase()
}

// Transform UI status to backend format
const transformStatusToBackend = (status: string): string => {
  return status.toUpperCase()
}

// Transform backend reservation to UI format
const transformReservation = (reservation: any) => {
  return {
    ...reservation,
    status: transformStatus(reservation.status),
    // Backend already has requesterId, requesterName, requesterEmail
    requesterId: reservation.requesterId || reservation.userId,
    requesterName: reservation.requesterName || reservation.user?.name || "Unknown",
    requesterEmail: reservation.requesterEmail || reservation.user?.email || "",
    // Ensure date fields are preserved
    requestDate: reservation.requestDate,
    returnDate: reservation.returnDate,
    actualReturnDate: reservation.actualReturnDate,
  }
}

export function useReservations(params?: any) {
  const { isAuthenticated, loading, token } = useAuth()
  
  return useQuery({
    queryKey: ["reservations", params],
    queryFn: async () => {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!authToken) {
        return { data: [], total: 0 }
      }

      try {
        const response = await reservationApi.get("/reservations", { params })
        
        // Backend returns { items: [], nextCursor: string }
        const reservations = response.data.items || response.data.data || []
        
        return {
          data: reservations.map(transformReservation),
          total: reservations.length,
        }
      } catch (error: any) {
        console.error("Failed to load reservations:", error)
        throw error
      }
    },
    enabled: !loading && isAuthenticated && !!token,
    retry: false,
    staleTime: 30000,
  })
}

export function useReservation(id: string) {
  const { isAuthenticated, loading } = useAuth()
  
  return useQuery({
    queryKey: ["reservation", id],
    queryFn: async () => {
      const response = await reservationApi.get(`/reservations/${id}`)
      return { data: transformReservation(response.data) }
    },
    enabled: !!id && !loading && isAuthenticated,
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateReservationData) => {
      // Get user info from localStorage
      const user = typeof window !== "undefined" ? localStorage.getItem("user") : null
      const userEmail = user ? JSON.parse(user).email : "anonymous@example.com"
      const userName = user ? JSON.parse(user).name : "Anonymous User"

      const payload = {
        equipmentType: data.equipmentType || "LAPTOP",
        quantity: data.quantity || 1,
        purpose: data.purpose,
        requestDate: data.startDate || data.requestDate, // Support both field names
        returnDate: data.endDate || data.returnDate, // Support both field names
        requesterEmail: userEmail,
        requesterName: userName,
        notes: data.notes || undefined,
      }

      const response = await reservationApi.post("/reservations", payload)
      return transformReservation(response.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      toast.success("Reservation created successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create reservation")
    },
  })
}

export function useApproveReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: "APPROVED" | "REJECTED"; reason?: string }) => {
      const response = await reservationApi.post(`/reservations/${id}/approve`, {
        status,
        reason,
      })
      return transformReservation(response.data)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      toast.success(
        variables.status === "APPROVED" ? "Reservation approved successfully" : "Reservation rejected successfully",
      )
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update reservation")
    },
  })
}

export function useDenyReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await reservationApi.post(`/reservations/${id}/approve`, {
        status: "REJECTED",
        reason,
      })
      return transformReservation(response.data)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      toast.success("Reservation rejected successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject reservation")
    },
  })
}

export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await reservationApi.delete(`/reservations/${id}`)
      return response.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", id] })
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      toast.success("Reservation cancelled successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cancel reservation")
    },
  })
}

export function useEquipmentAvailability() {
  const { isAuthenticated, loading } = useAuth()
  
  return useQuery({
    queryKey: ["equipment-availability"],
    queryFn: async () => {
      // This endpoint might not exist in backend, using assets as fallback
      const response = await reservationApi.get("/reservations", {
        params: { status: "APPROVED" },
      })
      return {
        data: [],
      }
    },
    enabled: !loading && isAuthenticated,
  })
}

export function useReservationAnalytics(days = 30) {
  const { isAuthenticated, loading } = useAuth()
  
  return useQuery({
    queryKey: ["analytics", "reservations", days],
    queryFn: async () => {
      const response = await reservationApi.get("/reservations")
      const reservations = response.data.data || []

      return {
        data: {
          total: reservations.length,
          pending: reservations.filter((r: any) => r.status === "PENDING").length,
          approved: reservations.filter((r: any) => r.status === "APPROVED").length,
          rejected: reservations.filter((r: any) => r.status === "REJECTED").length,
          cancelled: reservations.filter((r: any) => r.status === "CANCELLED").length,
          trend: [],
        },
      }
    },
    enabled: !loading && isAuthenticated,
  })
}
