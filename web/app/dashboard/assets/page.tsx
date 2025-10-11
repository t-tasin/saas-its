"use client"

import type React from "react"
import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Package, Loader2 } from "lucide-react"
import { useAssets, useAssetTypes, useCreateAsset } from "@/hooks/use-assets"
import { useUser } from "@/hooks/use-users"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

// Asset Row Component with Assigned User
function AssetRow({ asset, onClick }: { asset: any; onClick: () => void }) {
  const { data: assignedUser } = useUser(asset.assignedToId)

  return (
    <TableRow className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={onClick}>
      <TableCell className="font-mono font-medium">{asset.assetId || asset.id.slice(0, 8)}</TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
          {asset.type}
        </span>
      </TableCell>
      <TableCell className="max-w-[200px] truncate">{asset.description || "-"}</TableCell>
      <TableCell className="font-mono text-sm">{asset.serialNumber || "-"}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            asset.status === "available"
              ? "bg-green-100 text-green-800"
              : asset.status === "assigned"
                ? "bg-blue-100 text-blue-800"
                : asset.status === "maintenance"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-800"
          }`}
        >
          {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
        </span>
      </TableCell>
      <TableCell className="text-sm">
        {asset.assignedToId ? (
          assignedUser?.data?.name || assignedUser?.data?.email || "Loading..."
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{asset.location || "-"}</TableCell>
    </TableRow>
  )
}

function DashboardAssetsContent() {
  const router = useRouter()
  const [status, setStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  // Fetch assets from backend
  const { data: assetsResponse, isLoading, error } = useAssets()
  const { data: assetTypesResponse } = useAssetTypes()
  const createAssetMutation = useCreateAsset()
  
  const assets = assetsResponse?.data || []
  const assetTypes = assetTypesResponse?.data || []

  const [assetTag, setAssetTag] = useState("")
  const [assetTypeId, setAssetTypeId] = useState("")
  const [description, setDescription] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [model, setModel] = useState("")
  const [modelGeneration, setModelGeneration] = useState("")
  const [serialNumber, setSerialNumber] = useState("")
  const [vendor, setVendor] = useState("")
  const [receivedDate, setReceivedDate] = useState("")
  const [disposalDate, setDisposalDate] = useState("")
  const [memory, setMemory] = useState("")
  const [hddSize, setHddSize] = useState("")
  const [hddType, setHddType] = useState("")
  const [cpuGeneration, setCpuGeneration] = useState("")
  const [cpuSpeed, setCpuSpeed] = useState("")
  const [gpuModel, setGpuModel] = useState("")
  const [videoCard, setVideoCard] = useState("")
  const [wiredMac, setWiredMac] = useState("")
  const [wirelessMac, setWirelessMac] = useState("")
  const [output1, setOutput1] = useState("")
  const [output2, setOutput2] = useState("")
  const [cost, setCost] = useState("")
  const [po, setPo] = useState("")
  const [disposalType, setDisposalType] = useState("")
  const [fundingDepartment, setFundingDepartment] = useState("")

  const filteredAssets = assets.filter((asset) => {
    if (status !== "all" && asset.status !== status) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        asset.assetId?.toLowerCase().includes(query) ||
        asset.type?.toLowerCase().includes(query) ||
        asset.serialNumber?.toLowerCase().includes(query) ||
        asset.description?.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!assetTag || !assetTypeId || !description || !fundingDepartment) {
      toast.error("Asset ID, Type, Description, and Funding Department are required.")
      return
    }

    try {
      await createAssetMutation.mutateAsync({
        assetId: assetTag,
        type: assetTypeId,
        description,
        fundingDepartment,
        manufacturer: manufacturer || undefined,
        model: model || undefined,
        modelGeneration: modelGeneration || undefined,
        serialNumber: serialNumber || undefined,
        vendor: vendor || undefined,
        receivedDate: receivedDate || undefined,
        disposalDate: disposalDate || undefined,
        memory: memory || undefined,
        hddSize: hddSize || undefined,
        hddType: hddType || undefined,
        cpuGeneration: cpuGeneration || undefined,
        cpuSpeed: cpuSpeed || undefined,
        gpuModel: gpuModel || undefined,
        videoCard: videoCard || undefined,
        wiredMac: wiredMac || undefined,
        wirelessMac: wirelessMac || undefined,
        output1: output1 || undefined,
        output2: output2 || undefined,
        cost: cost ? parseFloat(cost) : undefined,
        po: po || undefined,
        disposalType: disposalType || undefined,
      } as any)

      // Clear form
      setAssetTag("")
      setAssetTypeId("")
      setDescription("")
      setManufacturer("")
      setModel("")
      setModelGeneration("")
      setSerialNumber("")
      setVendor("")
      setReceivedDate("")
      setDisposalDate("")
      setMemory("")
      setHddSize("")
      setHddType("")
      setCpuGeneration("")
      setCpuSpeed("")
      setGpuModel("")
      setVideoCard("")
      setWiredMac("")
      setWirelessMac("")
      setOutput1("")
      setOutput2("")
      setCost("")
      setPo("")
      setDisposalType("")
      setFundingDepartment("")
      setShowCreateDialog(false)
    } catch (error: any) {
      // Error already handled by mutation
      console.error("Failed to create asset:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
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

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by asset tag, type, or serial number..."
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading assets...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="border rounded-lg bg-destructive/10 p-6 text-center">
            <p className="text-destructive">Failed to load assets. Please try again.</p>
          </div>
        )}

        {/* Empty/No Results State */}
        {!isLoading && !error && filteredAssets.length === 0 && (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="No assets found"
            description={searchQuery ? "Try adjusting your filters." : "Add your first asset to get started."}
            action={{
              label: "Add Asset",
              onClick: () => setShowCreateDialog(true),
            }}
          />
        )}

        {/* Assets Table */}
        {!isLoading && !error && filteredAssets.length > 0 && (
          <div className="border rounded-lg bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold w-[120px]">Asset ID</TableHead>
                  <TableHead className="font-semibold w-[100px]">Type</TableHead>
                  <TableHead className="font-semibold w-[200px]">Description</TableHead>
                  <TableHead className="font-semibold w-[120px]">Serial #</TableHead>
                  <TableHead className="font-semibold w-[100px]">Status</TableHead>
                  <TableHead className="font-semibold w-[140px]">Assigned To</TableHead>
                  <TableHead className="font-semibold w-[120px]">Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <AssetRow key={asset.id} asset={asset} onClick={() => router.push(`/dashboard/assets/${asset.id}`)} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>
              Create a new asset in the inventory. Fields marked with * are mandatory.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAsset}>
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assetTag">
                      Asset ID / Tag <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="assetTag"
                      placeholder="e.g., LAP-001"
                      value={assetTag}
                      onChange={(e) => setAssetTag(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assetTypeId">
                      Type <span className="text-destructive">*</span>
                    </Label>
                    <Select value={assetTypeId} onValueChange={setAssetTypeId} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {assetTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the asset..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    required
                  />
                </div>
              </div>

              {/* Hardware Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Hardware Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      placeholder="e.g., Dell"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g., Latitude 5520"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelGeneration">Model Generation</Label>
                    <Input
                      id="modelGeneration"
                      placeholder="e.g., Gen 11"
                      value={modelGeneration}
                      onChange={(e) => setModelGeneration(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      placeholder="e.g., SN123456789"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor</Label>
                    <Input
                      id="vendor"
                      placeholder="e.g., Tech Supply Co."
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Specifications</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memory">Memory</Label>
                    <Input
                      id="memory"
                      placeholder="e.g., 16GB DDR4"
                      value={memory}
                      onChange={(e) => setMemory(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hddSize">HDD Size</Label>
                    <Input
                      id="hddSize"
                      placeholder="e.g., 512GB"
                      value={hddSize}
                      onChange={(e) => setHddSize(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hddType">HDD Type</Label>
                    <Input
                      id="hddType"
                      placeholder="e.g., SSD NVMe"
                      value={hddType}
                      onChange={(e) => setHddType(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpuGeneration">CPU Generation</Label>
                    <Input
                      id="cpuGeneration"
                      placeholder="e.g., Intel i7 11th Gen"
                      value={cpuGeneration}
                      onChange={(e) => setCpuGeneration(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpuSpeed">CPU Speed</Label>
                    <Input
                      id="cpuSpeed"
                      placeholder="e.g., 2.8 GHz"
                      value={cpuSpeed}
                      onChange={(e) => setCpuSpeed(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpuModel">GPU Model</Label>
                    <Input
                      id="gpuModel"
                      placeholder="e.g., NVIDIA GTX 1650"
                      value={gpuModel}
                      onChange={(e) => setGpuModel(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoCard">Video Card</Label>
                  <Input
                    id="videoCard"
                    placeholder="e.g., Integrated Intel Iris Xe"
                    value={videoCard}
                    onChange={(e) => setVideoCard(e.target.value)}
                  />
                </div>
              </div>

              {/* Network & Connectivity */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Network & Connectivity</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wiredMac">Wired MAC</Label>
                    <Input
                      id="wiredMac"
                      placeholder="e.g., 00:1A:2B:3C:4D:5E"
                      value={wiredMac}
                      onChange={(e) => setWiredMac(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wirelessMac">Wireless MAC</Label>
                    <Input
                      id="wirelessMac"
                      placeholder="e.g., 00:1A:2B:3C:4D:5F"
                      value={wirelessMac}
                      onChange={(e) => setWirelessMac(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="output1">Output 1</Label>
                    <Input
                      id="output1"
                      placeholder="e.g., HDMI"
                      value={output1}
                      onChange={(e) => setOutput1(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="output2">Output 2</Label>
                    <Input
                      id="output2"
                      placeholder="e.g., USB-C"
                      value={output2}
                      onChange={(e) => setOutput2(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Financial & Administrative */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Financial & Administrative</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="e.g., 1200.00"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="po">PO</Label>
                    <Input id="po" placeholder="Purchase Order #" value={po} onChange={(e) => setPo(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fundingDepartment">
                      Funding Department <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="fundingDepartment"
                      placeholder="e.g., IT Department"
                      value={fundingDepartment}
                      onChange={(e) => setFundingDepartment(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receivedDate">Received Date</Label>
                    <Input
                      id="receivedDate"
                      type="date"
                      value={receivedDate}
                      onChange={(e) => setReceivedDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disposalDate">Disposal Date</Label>
                    <Input
                      id="disposalDate"
                      type="date"
                      value={disposalDate}
                      onChange={(e) => setDisposalDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="disposalType">Disposal Type</Label>
                    <Input
                      id="disposalType"
                      placeholder="e.g., Recycled, Donated"
                      value={disposalType}
                      onChange={(e) => setDisposalType(e.target.value)}
                    />
                  </div>
                </div>
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
              <Button type="submit">Create Asset</Button>
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
