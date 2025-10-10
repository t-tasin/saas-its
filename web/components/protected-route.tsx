"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: string[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] ProtectedRoute check:", { 
      loading, 
      isAuthenticated, 
      userRole: user?.role,
      requiredRoles: roles 
    })

    if (!loading && !isAuthenticated) {
      console.log("[v0] Not authenticated, redirecting to login")
      router.push("/login")
    }

    if (!loading && isAuthenticated && roles && !roles.includes(user?.role || "")) {
      console.log("[v0] User role not authorized, redirecting to dashboard")
      router.push("/dashboard")
    }
  }, [isAuthenticated, loading, user, roles, router])

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!isAuthenticated) {
    return null
  }

  if (roles && !roles.includes(user?.role || "")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
