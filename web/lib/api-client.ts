import axios, { type AxiosError, type AxiosInstance } from "axios"
import toast from "react-hot-toast"

const IDENTITY_API = "/api/auth"
const TICKET_API = "/api/tickets"
const ASSET_API = "/api/assets"
const RESERVATION_API = "/api/reservations"

console.log("[v0] API Configuration (using proxy routes):", {
  IDENTITY_API,
  TICKET_API,
  ASSET_API,
  RESERVATION_API,
})

// Create axios instances for each microservice
const createApiClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  })

  // Request interceptor - Add auth token and tenant ID
  client.interceptors.request.use(
    (config) => {
      const fullUrl = `${config.baseURL}${config.url}`

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken")
        const tenantId = localStorage.getItem("tenantId")

        console.log("[v0] API Request:", {
          method: config.method?.toUpperCase(),
          fullUrl,
          baseURL: config.baseURL,
          path: config.url,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : "none",
        })

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        if (tenantId) {
          config.headers["X-Tenant-ID"] = tenantId
        }
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  // Response interceptor - Handle errors and token refresh
  client.interceptors.response.use(
    (response) => {
      console.log("[v0] API Response Success:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      })
      return response
    },
    (error: AxiosError<any>) => {
      console.error("[v0] API Error Details:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })

      if (!error.response) {
        console.error("[v0] Network Error - Check if backend is accessible")
        toast.error("Cannot connect to server")
        return Promise.reject(error)
      }

      // Handle 401 Unauthorized - redirect to login
      if (error.response?.status === 401) {
        console.error("[v0] 401 Unauthorized - Token might be invalid or missing")
        console.error("[v0] Response data:", error.response?.data)
        // TEMPORARILY DISABLED to debug
        // if (typeof window !== "undefined") {
        //   localStorage.removeItem("authToken")
        //   localStorage.removeItem("refreshToken")
        //   localStorage.removeItem("user")
        //   localStorage.removeItem("tenantId")
        //   window.location.href = "/login"
        // }
      }

      // Extract error message from various formats
      let errorMessage = "An error occurred"
      const responseData = error.response?.data
      
      if (responseData) {
        if (typeof responseData.message === 'string') {
          errorMessage = responseData.message
        } else if (Array.isArray(responseData.message)) {
          errorMessage = responseData.message.join(", ")
        } else if (responseData.error) {
          if (typeof responseData.error === 'string') {
            errorMessage = responseData.error
          } else if (typeof responseData.error === 'object') {
            if (Array.isArray(responseData.error.message)) {
              errorMessage = responseData.error.message.join(", ")
            } else if (typeof responseData.error.message === 'string') {
              errorMessage = responseData.error.message
            } else if (responseData.error.code) {
              errorMessage = responseData.error.code
            }
          }
        }
      }
      
      toast.error(errorMessage)

      return Promise.reject(error)
    },
  )

  return client
}

// Export API clients for each microservice
export const identityClient = createApiClient(IDENTITY_API)
export const ticketClient = createApiClient(TICKET_API)
export const assetClient = createApiClient(ASSET_API)
export const reservationClient = createApiClient(RESERVATION_API)

export const identityApi = identityClient
export const ticketApi = ticketClient
export const assetApi = assetClient
export const reservationApi = reservationClient

// Export base URLs for reference
export const API_URLS = {
  IDENTITY_API,
  TICKET_API,
  ASSET_API,
  RESERVATION_API,
}
