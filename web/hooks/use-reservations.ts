import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { reservationApi } from "@/lib/api"
import type { CreateReservationData } from "@/types"

export function useReservations(params?: any) {
  return useQuery({
    queryKey: ["reservations", params],
    queryFn: async () => {
      const response = await reservationApi.list(params)
      return response.data
    },
  })
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: ["reservation", id],
    queryFn: async () => {
      const response = await reservationApi.get(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateReservationData) => {
      const response = await reservationApi.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
    },
  })
}

export function useApproveReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, assetIds, notes }: { id: string; assetIds: string[]; notes?: string }) => {
      const response = await reservationApi.approve(id, { assetIds, notes })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
    },
  })
}

export function useDenyReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await reservationApi.deny(id, reason)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservation", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["reservations"] })
    },
  })
}

export function useEquipmentAvailability() {
  return useQuery({
    queryKey: ["equipment-availability"],
    queryFn: async () => {
      const response = await reservationApi.getAvailability()
      return response.data
    },
  })
}

export function useReservationAnalytics(days = 30) {
  return useQuery({
    queryKey: ["analytics", "reservations", days],
    queryFn: async () => {
      const response = await reservationApi.getAnalytics(days)
      return response.data
    },
  })
}
