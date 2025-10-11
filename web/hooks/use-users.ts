import { useQuery } from "@tanstack/react-query"
import { identityApi } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"

export function useOperators() {
  const { isAuthenticated, loading, token } = useAuth()

  return useQuery({
    queryKey: ["users", "operators"],
    queryFn: async () => {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!authToken) {
        return { data: [] }
      }

      try {
        // Fetch users with operator or admin role
        const response = await identityApi.get("/users", {
          params: { role: "operator" },
        })
        
        // Backend returns { users: [], total: 0, page: 1, limit: 20 }
        const users = response.data.users || response.data.items || response.data.data || []

        return { data: users }
      } catch (error) {
        console.error("Failed to load operators:", error)
        return { data: [] }
      }
    },
    enabled: !loading && isAuthenticated && !!token,
    staleTime: 60000, // Cache for 1 minute
    retry: false,
  })
}

export function useAdmins() {
  const { isAuthenticated, loading, token } = useAuth()

  return useQuery({
    queryKey: ["users", "admins"],
    queryFn: async () => {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!authToken) {
        return { data: [] }
      }

      try {
        const response = await identityApi.get("/users", {
          params: { role: "admin" },
        })
        
        // Backend returns { users: [], total: 0, page: 1, limit: 20 }
        const users = response.data.users || response.data.items || response.data.data || []

        return { data: users }
      } catch (error) {
        console.error("Failed to load admins:", error)
        return { data: [] }
      }
    },
    enabled: !loading && isAuthenticated && !!token,
    staleTime: 60000,
    retry: false,
  })
}

// Get all operators and admins who can be assigned tickets
export function useAssignableUsers() {
  const { isAuthenticated, loading, token } = useAuth()

  return useQuery({
    queryKey: ["users", "assignable"],
    queryFn: async () => {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!authToken) {
        return { data: [] }
      }

      try {
        // Fetch all users (backend will filter by role if needed)
        const response = await identityApi.get("/users")
        
        // Backend returns { users: [], total: 0, page: 1, limit: 20 }
        const allUsers = response.data.users || response.data.items || response.data.data || []
        
        // Filter to only operators and admins on frontend
        const assignableUsers = allUsers.filter((user: any) => 
          user.role === "operator" || user.role === "admin"
        )

        return { data: assignableUsers }
      } catch (error) {
        console.error("Failed to load assignable users:", error)
        return { data: [] }
      }
    },
    enabled: !loading && isAuthenticated && !!token,
    staleTime: 60000,
    retry: false,
  })
}

// Get ALL users (general, operator, admin) for asset assignment
export function useAllUsers() {
  const { isAuthenticated, loading, token } = useAuth()

  return useQuery({
    queryKey: ["users", "all"],
    queryFn: async () => {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!authToken) {
        return { data: [] }
      }

      try {
        // Fetch all users regardless of role
        const response = await identityApi.get("/users")
        
        // Backend returns { users: [], total: 0, page: 1, limit: 20 }
        const users = response.data.users || response.data.items || response.data.data || []

        return { data: users }
      } catch (error) {
        console.error("Failed to load all users:", error)
        return { data: [] }
      }
    },
    enabled: !loading && isAuthenticated && !!token,
    staleTime: 60000, // Cache for 1 minute
    retry: false,
  })
}

// Get a single user by ID
export function useUser(userId: string | null | undefined) {
  const { isAuthenticated, loading, token } = useAuth()

  // Check if userId is valid UUID (not 'anonymous' or other invalid values)
  const isValidUserId = userId && userId !== 'anonymous' && userId.length > 10

  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
      if (!authToken || !userId || !isValidUserId) {
        return { data: null }
      }

      try {
        const response = await identityApi.get(`/users/${userId}`)
        return { data: response.data }
      } catch (error) {
        console.error("Failed to load user:", error)
        return { data: null }
      }
    },
    enabled: !loading && isAuthenticated && !!token && !!isValidUserId,
    staleTime: 300000, // Cache for 5 minutes
    retry: false,
  })
}

