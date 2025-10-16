"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/use-tickets"
import { useAssetTypeCatalog, useCreateAssetType, useDeleteAssetType } from "@/hooks/use-assets"

function CatalogContent() {
  const [categoryName, setCategoryName] = useState("")
  const [assetTypeName, setAssetTypeName] = useState("")

  const { data: categoryData, isLoading: categoriesLoading } = useCategories()
  const { data: assetTypeData, isLoading: assetTypesLoading } = useAssetTypeCatalog()

  const createCategory = useCreateCategory()
  const deleteCategory = useDeleteCategory()
  const createAssetType = useCreateAssetType()
  const deleteAssetType = useDeleteAssetType()

  const isLoading = categoriesLoading || assetTypesLoading

  if (isLoading) {
    return <LoadingSpinner fullScreen />
  }

  const categories = categoryData?.data ?? []
  const assetTypes = assetTypeData ?? []

  return (
    <main className="container mx-auto p-8">
      <PageHeader
        title="Service Catalog"
        description="Manage ticket categories and asset types available across the platform"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                if (!categoryName.trim()) return
                createCategory.mutate({ name: categoryName.trim() })
                setCategoryName("")
              }}
            >
              <Input
                placeholder="Add new category"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                required
              />
              <Button type="submit" disabled={createCategory.isPending}>Add</Button>
            </form>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories defined yet.</p>}
              {categories.map((category: any) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between rounded-md border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{category.name}</p>
                    {category.subcategories?.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {category.subcategories.length} subcategories
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => deleteCategory.mutate({ id: category.id })}
                    disabled={deleteCategory.isPending}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                if (!assetTypeName.trim()) return
                createAssetType.mutate({ name: assetTypeName.trim() })
                setAssetTypeName("")
              }}
            >
              <Input
                placeholder="Add new asset type"
                value={assetTypeName}
                onChange={(event) => setAssetTypeName(event.target.value)}
                required
              />
              <Button type="submit" disabled={createAssetType.isPending}>Add</Button>
            </form>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {assetTypes.length === 0 && <p className="text-sm text-muted-foreground">No asset types defined.</p>}
              {assetTypes.map((type: any) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between rounded-md border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{type.name}</p>
                    <p className="text-xs text-muted-foreground">{type._count?.assets ?? 0} linked assets</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => deleteAssetType.mutate({ id: type.id })}
                    disabled={(type._count?.assets ?? 0) > 0 || deleteAssetType.isPending}
                    title={(type._count?.assets ?? 0) > 0 ? "Detach assets before deleting" : "Remove asset type"}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default function CatalogPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <CatalogContent />
    </ProtectedRoute>
  )
}
