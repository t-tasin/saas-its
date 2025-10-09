"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { identityApi } from "@/lib/api"
import type { User, RegisterData } from "@/types"

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isOperator: boolean
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load user from localStorage on mount
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await identityApi.login(email, password)
      const { token: newToken, user: newUser } = response.data

      setToken(newToken)
      setUser(newUser)
      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))

      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await identityApi.register(data)
      const { token: newToken, user: newUser } = response.data

      setToken(newToken)
      setUser(newUser)
      localStorage.setItem("token", newToken)
      localStorage.setItem("user", JSON.stringify(newUser))

      router.push("/dashboard")
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const value = {
    user,
    token,
    login,
    register,
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
