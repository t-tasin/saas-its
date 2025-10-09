"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { AssetCard } from "@/components/asset-card"
import { EmptyState } from "@/components/empty-state"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAssets, useAssetTypes, useCreateAsset, useAssignAsset, useUnassignAsset } from "@/hooks/use-assets"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Package } from "lucide-react"
import type { Asset } from "@/types"

function DashboardAssetsContent() {
  const [status, setStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  // Create Asset Form
  const [assetTag, setAssetTag] = useState("")
  const [assetTypeId, setAssetTypeId] = useState("")
  const [assetStatus, setAssetStatus] = useState<"available" | "assigned" | "maintenance" | "retired">("available")
  const [location, setLocation] = useState("")
  const [summary, setSummary] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")

  // Assign Form
  const [personId, setPersonId] = useState("")
  const [personName, setPersonName] = useState("")
  const [personEmail, setPersonEmail] = useState("")

  const { toast } = useToast()

  const params: any = {}
  if (status !== "all") params.status = status

  const { data: assets, isLoading, error } = useAssets(params)
  const { data: assetTypes } = useAssetTypes()
  const createAsset = useCreateAsset()
  const assignAsset = useAssignAsset()
  const unassignAsset = useUnassignAsset()

  const filteredAssets = assets?.data?.filter((asset: any) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      asset.assetTag.toLowerCase().includes(query) ||
      asset.assetType.name.toLowerCase().includes(query) ||
      asset.location?.toLowerCase().includes(query)
    )
  })

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createAsset.mutateAsync({
        assetTag,
        assetTypeId,
        status: assetStatus,
        location: location || undefined,
        summary: summary || undefined,
        purchaseDate: purchaseDate || undefined,
      })

      toast({
        title: "Success",
        description: "Asset created successfully.",
      })

      // Reset form
      setAssetTag("")
      setAssetTypeId("")
      setAssetStatus("available")
      setLocation("")
      setSummary("")
      setPurchaseDate("")
      setShowCreateDialog(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create asset. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedAsset) return

    try {
      // In a real app, you'd create the person first or select from existing
      // For now, we'll use a placeholder ID
      const tempPersonId = `person-${Date.now()}`

      await assignAsset.mutateAsync({
        id: selectedAsset.id,
        personId: tempPersonId,
      })

      toast({
        title: "Success",
        description: "Asset assigned successfully.",
      })

      setPersonId("")
      setPersonName("")
      setPersonEmail("")
      setSelectedAsset(null)
      setShowAssignDialog(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to assign asset. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUnassign = async (asset: Asset) => {
    try {
      await unassignAsset.mutateAsync(asset.id)

      toast({
        title: "Success",
        description: "Asset unassigned successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to unassign asset. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <PageHeader
          title="Asset Management"
          description="Manage your IT assets and equipment"
          action={
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          }
        />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by asset tag, type, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assets Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load assets. Please try again.</p>
          </div>
        ) : filteredAssets?.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No assets found"
            description="Try adjusting your filters or add a new asset."
            action={{
              label: "Add Asset",
              onClick: () => setShowCreateDialog(true),
            }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets?.map((asset: any) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                showActions
                onAssign={() => {
                  setSelectedAsset(asset)
                  setShowAssignDialog(true)
                }}
                onUnassign={() => handleUnassign(asset)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Asset Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>Create a new asset in the inventory</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAsset}>
            <div className="space-y-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetTag">Asset Tag *</Label>
                  <Input
                    id="assetTag"
                    placeholder="e.g., LAPTOP-001"
                    value={assetTag}
                    onChange={(e) => setAssetTag(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetTypeId">Asset Type *</Label>
                  <Select value={assetTypeId} onValueChange={setAssetTypeId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes?.data?.map((type: any) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={assetStatus} onValueChange={(value: any) => setAssetStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Building A, Floor 3"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Additional details about this asset..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createAsset.isPending}>
                {createAsset.isPending ? "Creating..." : "Create Asset"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assign Asset Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Asset</DialogTitle>
            <DialogDescription>Assign {selectedAsset?.assetTag} to a person</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssign}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="personName">Person Name *</Label>
                <Input
                  id="personName"
                  placeholder="Enter person's name"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personEmail">Email</Label>
                <Input
                  id="personEmail"
                  type="email"
                  placeholder="person@example.com"
                  value={personEmail}
                  onChange={(e) => setPersonEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAssignDialog(false)
                  setSelectedAsset(null)
                }}
                className="bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={assignAsset.isPending}>
                {assignAsset.isPending ? "Assigning..." : "Assign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function DashboardAssetsPage() {
  return (
    <ProtectedRoute roles={["operator", "admin"]}>
      <DashboardAssetsContent />
    </ProtectedRoute>
  )
}
