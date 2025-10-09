"use client"

import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCategories } from "@/hooks/use-tickets"
import { FolderTree } from "lucide-react"

function DashboardCategoriesContent() {
  const { data: categories, isLoading } = useCategories()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <PageHeader title="Categories" description="Ticket categories and subcategories" />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.data?.map((category: any) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  {category.description && <p className="text-sm text-muted-foreground mt-2">{category.description}</p>}
                </CardHeader>
                <CardContent>
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Subcategories:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.map((sub: any) => (
                          <Badge key={sub.id} variant="secondary">
                            {sub.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No subcategories</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function DashboardCategoriesPage() {
  return (
    <ProtectedRoute roles={["operator", "admin"]}>
      <DashboardCategoriesContent />
    </ProtectedRoute>
  )
}
