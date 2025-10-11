"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/types"
import toast from "react-hot-toast"
import { identityClient } from "@/lib/api-client"
import mockData from "@/data/mock-data.json"

const identityService = {
  requestOtp: async (email: string) => {
    const response = await identityClient.post("/request-otp", { email })
    return response.data
  },

  // Admin/Operator: Validate password first
  login: async (email: string, password: string) => {
    const response = await identityClient.post("/login", { email, password })
    return response.data
  },

  // Verify OTP (works for both flows)
  verifyOtp: async (data: { email?: string; tempToken?: string; otp: string }) => {
    const response = await identityClient.post("/verify-otp", data)
    return response.data
  },

  resendOtp: async (email: string) => {
    const response = await identityClient.post("/request-otp", { email })
    return response.data
  },

  register: async (data: { email: string; password: string; name: string }) => {
    const response = await identityClient.post("/register", {
      email: data.email,
      password: data.password,
      name: data.name,
    })
    return response.data
  },

  logout: async () => {
    const response = await identityClient.post("/logout")
    return response.data
  },
}

interface AuthContextType {
  user: User | null
  token: string | null
  // General User: Passwordless OTP flow
  requestOTP: (email: string) => Promise<void>
  // Admin/Operator: Password + OTP flow
  loginWithPassword: (email: string, password: string) => Promise<void>
  // Verify OTP (both flows)
  verifyOTP: (otp: string) => Promise<void>
  register: (data: { email: string; password: string; name: string }) => Promise<void>
  resendOTP: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isOperator: boolean
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  })
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken")
    }
    return null
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Ensure user and token are synced from localStorage on mount
    const initAuth = async () => {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("authToken")
        const storedUser = localStorage.getItem("user")
        
        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setToken(storedToken)
            setUser(parsedUser)
            console.log("[v0] Auth restored from localStorage:", { 
              email: parsedUser.email, 
              role: parsedUser.role,
              hasToken: !!storedToken 
            })
          } catch (e) {
            console.error("[v0] Failed to parse stored user:", e)
            // Clear invalid data
            localStorage.removeItem("authToken")
            localStorage.removeItem("user")
          }
        }
      }
      // Small delay to ensure state is fully updated before marking as not loading
      await new Promise(resolve => setTimeout(resolve, 50))
      setLoading(false)
    }
    
    initAuth()
  }, [])

  const requestOTP = async (email: string) => {
    try {
      console.log("[v0] Requesting OTP for user:", email)
      const response = await identityService.requestOtp(email)

      toast.success("OTP sent to your email")
      localStorage.setItem("pendingEmail", email)
      localStorage.setItem("authFlow", "passwordless")
      localStorage.removeItem("tempToken")
      router.push("/verify-otp")
    } catch (error: any) {
      console.log("[v0] Request OTP error:", error.message)

      if (error.message?.includes("HTML") || error.message?.includes("Network Error")) {
        console.log("[v0] Backend unavailable, using mock authentication")

        // Find user in mock data
        const mockUser = mockData.users.find((u) => u.email === email)

        if (mockUser && mockUser.role === "general") {
          toast.success("OTP sent! (Mock Mode) - Enter any 6-digit OTP")
          localStorage.setItem("pendingEmail", email)
          localStorage.setItem("authFlow", "passwordless")
          localStorage.removeItem("tempToken")
          localStorage.setItem("mockMode", "true")
          router.push("/verify-otp")
          return
        } else {
          toast.error("User not found")
          throw new Error("User not found")
        }
      }

      const errorMessage = error.response?.data?.message || "Failed to send OTP"
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const loginWithPassword = async (email: string, password: string) => {
    try {
      console.log("[v0] Validating password for:", email)
      const response = await identityService.login(email, password)

      const { tempToken } = response
      if (!tempToken) {
        throw new Error("Invalid response from server")
      }

      toast.success("Password verified! OTP sent to your email")
      localStorage.setItem("pendingEmail", email)
      localStorage.setItem("tempToken", tempToken)
      localStorage.setItem("authFlow", "password")
      router.push("/verify-otp")
    } catch (error: any) {
      console.log("[v0] Login with password error:", error.message)

      if (error.message?.includes("HTML") || error.message?.includes("Network Error")) {
        console.log("[v0] Backend unavailable, using mock authentication")

        // Find user in mock data
        const mockUser = mockData.users.find((u) => u.email === email)

        if (mockUser && mockUser.role !== "general") {
          // Simulate successful password validation
          toast.success("Password verified! (Mock Mode) - Enter any 6-digit OTP")
          localStorage.setItem("pendingEmail", email)
          localStorage.setItem("tempToken", "mock-temp-token")
          localStorage.setItem("authFlow", "password")
          localStorage.setItem("mockMode", "true")
          router.push("/verify-otp")
          return
        } else {
          toast.error("Invalid email or password")
          throw new Error("Invalid email or password")
        }
      }

      const errorMessage = error.response?.data?.message || "Invalid email or password"
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const verifyOTP = async (otp: string) => {
    try {
      const authFlow = localStorage.getItem("authFlow")
      const email = localStorage.getItem("pendingEmail")
      const tempToken = localStorage.getItem("tempToken")
      const mockMode = localStorage.getItem("mockMode")

      console.log("[v0] Verifying OTP, flow:", authFlow, "mockMode:", mockMode)

      if (mockMode === "true") {
        console.log("[v0] Using mock OTP verification")

        // Accept any 6-digit OTP in mock mode
        if (otp.length !== 6) {
          toast.error("Please enter a 6-digit OTP")
          throw new Error("Invalid OTP format")
        }

        const mockUser = mockData.users.find((u) => u.email === email)
        if (!mockUser) {
          toast.error("User not found")
          throw new Error("User not found")
        }

        const userData: User = {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role.toLowerCase() as "general" | "operator" | "admin",
          createdAt: mockUser.createdAt,
          updatedAt: mockUser.updatedAt,
        }

        const mockToken = `mock-token-${Date.now()}`

        localStorage.setItem("authToken", mockToken)
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.removeItem("pendingEmail")
        localStorage.removeItem("tempToken")
        localStorage.removeItem("authFlow")
        localStorage.removeItem("mockMode")

        setToken(mockToken)
        setUser(userData)

        toast.success("Login successful! (Mock Mode)")

        if (userData.role === "admin" || userData.role === "operator") {
          router.push("/dashboard/tickets")
        } else {
          router.push("/dashboard")
        }
        return
      }

      let verifyData: any
      if (authFlow === "password" && tempToken) {
        // Admin/Operator flow: use tempToken + email
        verifyData = { email, otp, tempToken }
      } else {
        // General User flow: use email
        verifyData = { email, otp }
      }

      const response = await identityService.verifyOtp(verifyData)
      const { token: accessToken, user: backendUser } = response

      if (!accessToken || !backendUser) {
        throw new Error("Invalid response from server")
      }

      const userData: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: backendUser.name,
        role: backendUser.role.toLowerCase() as "general" | "operator" | "admin",
        createdAt: backendUser.createdAt,
        updatedAt: backendUser.updatedAt || backendUser.createdAt,
      }

      // Store auth data in localStorage
      localStorage.setItem("authToken", accessToken)
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.removeItem("pendingEmail")
      localStorage.removeItem("tempToken")
      localStorage.removeItem("authFlow")

      console.log("[v0] OTP verified successfully, storing auth data:", {
        email: userData.email,
        role: userData.role,
        tokenLength: accessToken.length
      })

      // Update state
      setToken(accessToken)
      setUser(userData)

      toast.success("Login successful!")

      // Small delay to ensure state is updated before navigation
      await new Promise(resolve => setTimeout(resolve, 100))

      console.log("[v0] Navigating to dashboard...")
      if (userData.role === "admin" || userData.role === "operator") {
        router.push("/dashboard/tickets")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("[v0] Verify OTP error:", error)
      const errorMessage = error.response?.data?.message || "Invalid OTP"
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const register = async (data: { email: string; password: string; name: string }) => {
    try {
      const response = await identityService.register({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      console.log("[v0] Registration response:", response)

      toast.success(response.message || "Registration successful! Please check your email for OTP.")
      localStorage.setItem("pendingEmail", data.email)
      localStorage.setItem("authFlow", "passwordless")
      localStorage.removeItem("tempToken")
      router.push("/verify-otp")
    } catch (error: any) {
      console.error("[v0] Registration error:", error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Registration failed"
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const resendOTP = async () => {
    try {
      const email = localStorage.getItem("pendingEmail")
      if (!email) throw new Error("No pending email found")

      const response = await identityService.requestOtp(email)
      toast.success("OTP resent successfully")
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP"
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    // Clear all auth data from localStorage
    setToken(null)
    setUser(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
    localStorage.removeItem("tenantId")
    localStorage.removeItem("pendingEmail")
    localStorage.removeItem("tempToken")
    localStorage.removeItem("authFlow")
    localStorage.removeItem("mockMode")
    toast.success("Logged out successfully")
    router.push("/")
  }

  const value = {
    user,
    token,
    requestOTP,
    loginWithPassword,
    verifyOTP,
    register,
    resendOTP,
    logout,
    isAuthenticated: !!user,
    isOperator: user?.role === "operator" || user?.role === "admin",
    isAdmin: user?.role === "admin",
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
