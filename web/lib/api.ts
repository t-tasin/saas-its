import axios from "axios"

// API Base URLs (env vars already include /v1 path)
const IDENTITY_API = process.env.NEXT_PUBLIC_IDENTITY_API || "http://localhost:3000/v1"
const TICKET_API = process.env.NEXT_PUBLIC_TICKET_API || "http://localhost:3001/v1"
const ASSET_API = process.env.NEXT_PUBLIC_ASSET_API || "http://localhost:3002/v1"
const RESERVATION_API = process.env.NEXT_PUBLIC_RESERVATION_API || "http://localhost:3003/v1"

// Create axios instance
const api = axios.create()

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        localStorage.removeItem("tenantId")
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api

// Identity Service API
export const identityApi = {
  login: (email: string, password: string) => api.post(`${IDENTITY_API}/auth/login`, { email, password }),

  register: (data: any) => api.post(`${IDENTITY_API}/auth/register`, data),

  getProfile: () => api.get(`${IDENTITY_API}/auth/me`),
}

// Ticket Service API
export const ticketApi = {
  list: (params?: any) => api.get(`${TICKET_API}/tickets`, { params }),

  get: (id: string) => api.get(`${TICKET_API}/tickets/${id}`),

  create: (data: any) => api.post(`${TICKET_API}/tickets`, data),

  updateStatus: (id: string, status: string) => api.patch(`${TICKET_API}/tickets/${id}/status`, { status }),

  getComments: (id: string) => api.get(`${TICKET_API}/tickets/${id}/comments`),

  addComment: (id: string, data: { body: string; authorName?: string }) =>
    api.post(`${TICKET_API}/tickets/${id}/comments`, data),

  getCategories: () => api.get(`${TICKET_API}/categories`),

  getSubcategories: (categoryId: string) => api.get(`${TICKET_API}/categories/${categoryId}/subcategories`),

  getAnalytics: (days = 30) => api.get(`${TICKET_API}/analytics?days=${days}`),

  getRecentActivity: (limit = 10) => api.get(`${TICKET_API}/analytics/recent-activity?limit=${limit}`),
}

// Asset Service API
export const assetApi = {
  list: (params?: any) => api.get(`${ASSET_API}/assets`, { params }),

  get: (id: string) => api.get(`${ASSET_API}/assets/${id}`),

  create: (data: any) => api.post(`${ASSET_API}/assets`, data),

  update: (id: string, data: any) => api.patch(`${ASSET_API}/assets/${id}`, data),

  delete: (id: string) => api.delete(`${ASSET_API}/assets/${id}`),

  assign: (id: string, personId: string) => api.post(`${ASSET_API}/assets/${id}/assign`, { personId }),

  unassign: (id: string) => api.post(`${ASSET_API}/assets/${id}/unassign`),

  getTypes: () => api.get(`${ASSET_API}/asset-types`),

  getAnalytics: () => api.get(`${ASSET_API}/analytics`),

  getAging: () => api.get(`${ASSET_API}/analytics/aging`),
}

// Reservation Service API
export const reservationApi = {
  list: (params?: any) => api.get(`${RESERVATION_API}/reservations`, { params }),

  get: (id: string) => api.get(`${RESERVATION_API}/reservations/${id}`),

  create: (data: any) => api.post(`${RESERVATION_API}/reservations`, data),

  approve: (id: string, data: { assetIds: string[]; notes?: string }) =>
    api.post(`${RESERVATION_API}/reservations/${id}/approve`, data),

  deny: (id: string, reason: string) => api.post(`${RESERVATION_API}/reservations/${id}/deny`, { reason }),

  cancel: (id: string) => api.post(`${RESERVATION_API}/reservations/${id}/cancel`),
  
  // Note: pickup and complete are now handled via hooks (useMarkAsPickedUp, useCompleteReservation)

  getAvailability: () => api.get(`${RESERVATION_API}/availability`),

  getAnalytics: (days = 30) => api.get(`${RESERVATION_API}/analytics?days=${days}`),
}
