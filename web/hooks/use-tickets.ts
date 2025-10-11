import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ticketApi } from "@/lib/api-client"
import type { CreateTicketData } from "@/types"
import toast from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context"

// Transform backend status to UI format
function transformStatus(status: string): string {
  return status.toLowerCase().replace("_", " ")
}

// Transform UI status to backend format
function transformStatusToBackend(status: string): string {
  return status.toLowerCase().replace(" ", "_")
}

export function useTickets(params?: any) {
  const { isAuthenticated, loading, token } = useAuth()
  
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: async () => {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!authToken) {
        return { data: [], total: 0 }
      }

      const response = await ticketApi.get("/tickets", { params })
      const data = response.data

      // Backend returns { items: [], nextCursor: string }
      const tickets = data.items || data.data || []
      
      // Transform data to match UI expectations
      const transformedData = tickets.map((ticket: any) => ({
        ...ticket,
        status: transformStatus(ticket.status),
        priority: ticket.priority?.toLowerCase() || 'medium',
        category: { name: ticket.category || ticket.type || 'other' },
      }))

      return { data: transformedData, total: tickets.length }
    },
    enabled: !loading && isAuthenticated && !!token,
    retry: false,
    staleTime: 30000,
  })
}

export function useTicket(id: string) {
  const { isAuthenticated, loading, token } = useAuth()
  
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!authToken) {
        throw new Error("No auth token available")
      }

      const response = await ticketApi.get(`/tickets/${id}`)
      const ticket = response.data

      // Transform attachments from backend format to frontend format
      const transformedAttachments = (ticket.attachments || []).map((att: any) => ({
        id: att.id,
        fileName: att.filename,
        fileSize: att.size || 0,
        mimeType: att.contentType,
        fileUrl: att.key, // S3 key - will need download URL endpoint
        uploadedAt: att.uploadedAt,
        uploadedBy: att.uploadedBy,
      }))

      // Transform data to match UI expectations
      return {
        data: {
          ...ticket,
          status: transformStatus(ticket.status),
          priority: ticket.priority.toLowerCase(),
          category: { name: ticket.category },
          attachments: transformedAttachments,
        },
      }
    },
    enabled: !!id && !loading && isAuthenticated && !!token,
    retry: false,
  })
}

export function useTicketComments(id: string) {
  const { isAuthenticated, loading } = useAuth()
  
  return useQuery({
    queryKey: ["ticket-comments", id],
    queryFn: async () => {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!authToken) {
        return { data: [] }
      }

      try {
        const response = await ticketApi.get(`/tickets/${id}/comments`)
        const comments = response.data || []

        return { data: comments }
      } catch (error: any) {
        // If endpoint returns 404, return empty comments
        if (error.response?.status === 404) {
          return { data: [] }
        }
        throw error
      }
    },
    enabled: !!id && !loading && isAuthenticated,
    retry: false,
  })
}

export function useCreateTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateTicketData & { attachments?: File[] }) => {
      // Get user email from localStorage for requestedBy field
      const user = typeof window !== "undefined" ? localStorage.getItem("user") : null
      const userEmail = user ? JSON.parse(user).email : "anonymous@example.com"

      const backendData = {
        title: data.title,
        description: data.description,
        type: data.type || "incident", // Required by backend
        priority: data.priority?.toLowerCase() || "medium", // Backend expects lowercase
        requestedBy: userEmail, // Required by backend
        // Only include categoryId if it's a valid UUID, otherwise omit
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.subcategoryId && { subcategoryId: data.subcategoryId }),
      }

      const response = await ticketApi.post("/tickets", backendData)
      const ticket = response.data

      // Note: Attachment uploads are disabled as the backend doesn't support them yet
      // Keeping the code here for future implementation
      if (data.attachments && data.attachments.length > 0) {
        console.warn("[v0] Attachments are not supported by the backend yet. Skipping upload.")
        // Silently skip attachments - don't show errors to user since ticket was created
        /*
        for (const file of data.attachments) {
          const formData = new FormData()
          formData.append("file", file)

          try {
            await ticketApi.post(`/tickets/${ticket.id}/attachments`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
          } catch (error) {
            console.error("Failed to upload attachment:", error)
            toast.error(`Failed to upload ${file.name}`)
          }
        }
        */
      }

      return ticket
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
      toast.success("Ticket created successfully!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create ticket")
    },
  })
}

export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ticketId, body, authorName }: { ticketId: string; body: string; authorName?: string }) => {
      const response = await ticketApi.post(`/tickets/${ticketId}/comments`, {
        body: body,  // Backend expects "body" not "content"
        authorName: authorName || "You",
      })

      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-comments", variables.ticketId] })
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.ticketId] })
      toast.success("Comment added!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add comment")
    },
  })
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const backendStatus = transformStatusToBackend(status)
      const response = await ticketApi.patch(`/tickets/${id}/status`, { status: backendStatus })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
      toast.success("Ticket status updated!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update status")
    },
  })
}

export function useAssignTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, operatorId }: { id: string; operatorId: string }) => {
      const response = await ticketApi.patch(`/tickets/${id}/assign`, { operatorId })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["tickets"] })
      toast.success("Ticket assigned successfully!")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to assign ticket")
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Categories are static enums in backend
      return {
        data: [
          { id: "HARDWARE", name: "Hardware" },
          { id: "SOFTWARE", name: "Software" },
          { id: "NETWORK", name: "Network" },
          { id: "ACCESS", name: "Access" },
          { id: "OTHER", name: "Other" },
        ],
      }
    },
  })
}

export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      // Subcategories not implemented in backend yet
      return { data: [] }
    },
    enabled: !!categoryId,
  })
}

export function useTicketAnalytics(days = 30) {
  const { isAuthenticated, loading } = useAuth()
  
  return useQuery({
    queryKey: ["analytics", "tickets", days],
    queryFn: async () => {
      // Get all tickets and calculate analytics client-side
      const response = await ticketApi.get("/tickets", { params: { limit: 1000 } })
      const tickets = response.data.data || []

      return {
        data: {
          total: tickets.length,
          open: tickets.filter((t: any) => t.status === "OPEN").length,
          inProgress: tickets.filter((t: any) => t.status === "IN_PROGRESS").length,
          resolved: tickets.filter((t: any) => t.status === "RESOLVED").length,
          byPriority: {
            low: tickets.filter((t: any) => t.priority === "LOW").length,
            medium: tickets.filter((t: any) => t.priority === "MEDIUM").length,
            high: tickets.filter((t: any) => t.priority === "HIGH").length,
            urgent: tickets.filter((t: any) => t.priority === "CRITICAL").length,
          },
          trend: [],
        },
      }
    },
    enabled: !loading && isAuthenticated,
  })
}
