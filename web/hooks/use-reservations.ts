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
        const response = await reservationApi.get("/", { params })
        
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
      const response = await reservationApi.get(`/${id}`)
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

      // Convert date strings to ISO format with time
      const requestDate = data.startDate || data.requestDate
      const returnDate = data.endDate || data.returnDate
      
      // Ensure dates are in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
      const formatDateToISO = (dateStr: string, isStartDate = false): string => {
        const date = new Date(dateStr)
        // If time is not specified, set appropriate time
        if (dateStr.length === 10) { // YYYY-MM-DD format
          if (isStartDate) {
            // For start date, set to 10:00 AM to ensure it's in the future
            date.setHours(10, 0, 0, 0)
          } else {
            // For end date, set to 5:00 PM
            date.setHours(17, 0, 0, 0)
          }
        }
        return date.toISOString()
      }

      const payload = {
        equipmentType: data.equipmentType || "LAPTOP",
        quantity: typeof data.quantity === 'number' ? data.quantity : parseInt(String(data.quantity || 1), 10),
        purpose: data.purpose || "Equipment reservation", // Purpose is required by backend
        requestDate: formatDateToISO(requestDate, true), // true = is start date
        returnDate: formatDateToISO(returnDate, false), // false = is end date
        requesterEmail: userEmail,
        requesterName: userName,
        notes: data.notes || undefined,
        forceRequest: data.forceRequest || false, // Allow special requests when equipment unavailable
      }

      console.log("[DEBUG] Creating reservation with payload:", JSON.stringify(payload, null, 2))
      console.log("[DEBUG] Payload types:", {
        equipmentType: typeof payload.equipmentType,
        quantity: typeof payload.quantity,
        purpose: typeof payload.purpose,
        requestDate: typeof payload.requestDate,
        returnDate: typeof payload.returnDate,
      })

      try {
        const response = await reservationApi.post("/", payload)
        console.log("[DEBUG] Reservation created successfully:", response.data)
        return transformReservation(response.data)
      } catch (error: any) {
        console.error("[DEBUG] Failed to create reservation:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          backendError: error.response?.data?.error,
          backendMessage: error.response?.data?.message,
          fullData: error.response?.data,
          payload: payload,
        })
        // Show the actual backend error message if available
        const backendError = error.response?.data?.error?.message || 
                            error.response?.data?.message || 
                            error.response?.data?.error
        if (backendError) {
          const errorMsg = Array.isArray(backendError) ? backendError.join(', ') : backendError
          toast.error(errorMsg)
        }
        throw error
      }
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
    mutationFn: async ({ id, assetIds, notes }: { id: string; assetIds: string[]; notes?: string }) => {
      const response = await reservationApi.post(`/${id}/approve`, {
        assetIds,
        notes,
      })
      return transformReservation(response.data.reservation || response.data)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      toast.success("Reservation approved successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve reservation")
    },
  })
}

export function useDenyReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await reservationApi.post(`/${id}/deny`, {
        reason,
      })
      return transformReservation(response.data)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      toast.success("Reservation denied successfully")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to deny reservation")
    },
  })
}

export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await reservationApi.post(`/${id}/cancel`, {
        reason: reason || "Cancelled by user",
      })
      return transformReservation(response.data.reservation || response.data)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] })
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
      const response = await reservationApi.get("/", {
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
      const response = await reservationApi.get("/")
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

export function useMarkAsPickedUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await reservationApi.post(`/${id}/pickup`, {})
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      toast.success("Reservation marked as picked up")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark as picked up")
    },
  })
}

export function useCompleteReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, returnNotes }: { id: string; returnNotes?: string }) => {
      const response = await reservationApi.post(`/${id}/complete`, { returnNotes })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
      queryClient.invalidateQueries({ queryKey: ["assets"] }) // Refresh assets to show as available
      toast.success("Reservation completed and assets returned")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to complete reservation")
    },
  })
}
