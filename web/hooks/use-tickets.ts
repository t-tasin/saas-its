import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ticketApi } from "@/lib/api"
import type { CreateTicketData } from "@/types"

export function useTickets(params?: any) {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: async () => {
      const response = await ticketApi.list(params)
      return response.data
    },
  })
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const response = await ticketApi.get(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useTicketComments(id: string) {
  return useQuery({
    queryKey: ["ticket-comments", id],
    queryFn: async () => {
      const response = await ticketApi.getComments(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const response = await ticketApi.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    },
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ticketId, body, authorName }: { ticketId: string; body: string; authorName?: string }) => {
      const response = await ticketApi.addComment(ticketId, { body, authorName })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-comments", variables.ticketId] })
    },
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await ticketApi.updateStatus(id, status)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await ticketApi.getCategories()
      return response.data
    },
  })
}

export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      const response = await ticketApi.getSubcategories(categoryId)
      return response.data
    },
    enabled: !!categoryId,
  })
}

export function useTicketAnalytics(days = 30) {
  return useQuery({
    queryKey: ["analytics", "tickets", days],
    queryFn: async () => {
      const response = await ticketApi.getAnalytics(days)
      return response.data
    },
  })
}
