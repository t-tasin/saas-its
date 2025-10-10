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

