import { ticketApi } from "@/lib/api-client"

export const ticketService = {
  listTickets: async (params?: any) => {
    const response = await ticketApi.get("/tickets", { params })
    return response.data
  },

  getTicket: async (id: string) => {
    const response = await ticketApi.get(`/tickets/${id}`)
    return response.data
  },

  createTicket: async (data: any) => {
    const response = await ticketApi.post("/tickets", data)
    return response.data
  },

  updateTicket: async (id: string, data: any) => {
    const response = await ticketApi.patch(`/tickets/${id}`, data)
    return response.data
  },

  deleteTicket: async (id: string) => {
    const response = await ticketApi.delete(`/tickets/${id}`)
    return response.data
  },

  assignTicket: async (id: string, data: any) => {
    const response = await ticketApi.post(`/tickets/${id}/assign`, data)
    return response.data
  },

  uploadAttachment: async (ticketId: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await ticketApi.post(`/tickets/${ticketId}/attachments`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  },

  getTicketHistory: async (id: string) => {
    const response = await ticketApi.get(`/tickets/${id}/history`)
    return response.data
  },
}
