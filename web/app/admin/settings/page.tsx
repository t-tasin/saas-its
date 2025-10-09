"use client"

import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings } from "lucide-react"

function AdminSettingsContent() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <PageHeader title="System Settings" description="Configure system-wide settings and preferences" />

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">System Settings</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
              System settings functionality would be implemented here. This would include email configurations, SLA
              settings, notification preferences, and other system-wide configurations.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <AdminSettingsContent />
    </ProtectedRoute>
  )
}
