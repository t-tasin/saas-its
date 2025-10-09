"use client"

import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

function AdminUsersContent() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <PageHeader title="User Management" description="Manage system users and permissions" />

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              User management functionality would be implemented here. This would include user CRUD operations, role
              assignments, and permission management.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <AdminUsersContent />
    </ProtectedRoute>
  )
}
