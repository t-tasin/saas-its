"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InfoRow } from "@/components/info-row"
import { PageHeader } from "@/components/page-header"
import { ProtectedRoute } from "@/components/protected-route"
import { ArrowLeft, Edit, Package, Save, UserPlus, UserMinus } from "lucide-react"
import { useAsset, useUpdateAsset, useAssignAsset, useUnassignAsset } from "@/hooks/use-assets"
import { useUser, useAllUsers } from "@/hooks/use-users"
import { toast } from "@/hooks/use-toast"

function AssetDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: assetResponse, isLoading, refetch } = useAsset(id)
  const asset = assetResponse?.data
  const updateAsset = useUpdateAsset()
  const assignAsset = useAssignAsset()
  const unassignAsset = useUnassignAsset()

  const { data: assignedUser } = useUser(asset?.assignedToId)
  const { data: allUsersResponse } = useAllUsers()
  const allUsers = allUsersResponse?.data || []

  const [showEditModal, setShowEditModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")
  const [editFormData, setEditFormData] = useState<any>({})
  const [newStatus, setNewStatus] = useState(asset?.status || "")

  const handleEditClick = () => {
    setEditFormData({
      assetId: asset?.assetId || "",
      type: asset?.type || "",
      description: asset?.description || "",
      status: asset?.status || "available",
      location: asset?.location || "",
      fundingDepartment: asset?.fundingDepartment || "",
      manufacturer: asset?.manufacturer || "",
      model: asset?.model || "",
      modelGeneration: asset?.modelGeneration || "",
      serialNumber: asset?.serialNumber || "",
      vendor: asset?.vendor || "",
      memory: asset?.memory || "",
      hddSize: asset?.hddSize || "",
      hddType: asset?.hddType || "",
      cpuGeneration: asset?.cpuGeneration || "",
      cpuSpeed: asset?.cpuSpeed || "",
      gpuModel: asset?.gpuModel || "",
      videoCard: asset?.videoCard || "",
      wiredMac: asset?.wiredMac || "",
      wirelessMac: asset?.wirelessMac || "",
      output1: asset?.output1 || "",
      output2: asset?.output2 || "",
      receivedDate: asset?.receivedDate || "",
      cost: asset?.cost || "",
      po: asset?.po || "",
      disposalDate: asset?.disposalDate || "",
      disposalType: asset?.disposalType || "",
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    await updateAsset.mutateAsync({
      id,
      data: editFormData,
    })
    setShowEditModal(false)
  }

  const handleAssignAsset = async () => {
    if (!selectedUserId) {
      toast({ title: "Error", description: "Please select a user", variant: "destructive" })
      return
    }
    try {
      await assignAsset.mutateAsync({ id, personId: selectedUserId })
      setShowAssignModal(false)
      setSelectedUserId("")
      refetch()
    } catch (error) {
      // Error already handled by mutation
    }
  }

  const handleUnassignAsset = async () => {
    try {
      await unassignAsset.mutateAsync(id)
      refetch()
    } catch (error) {
      // Error already handled by mutation
    }
  }

  const handleStatusChange = async () => {
    if (!newStatus || newStatus === asset?.status) return
    
    try {
      await updateAsset.mutateAsync({
        id,
        data: { status: newStatus },
      })
      // Success message is handled by the mutation hook (toast.success)
      refetch()
    } catch (error) {
      // Error is already handled by the mutation hook
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading asset...</span>
          </div>
        </main>
      </div>
    )
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-8">
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Asset not found</h3>
            <p className="text-muted-foreground">The asset you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/dashboard/assets")} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Assets
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8 max-w-5xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard/assets")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assets
          </Button>
          
          <PageHeader
            title={asset.assetId || `Asset ${asset.id.slice(0, 8)}`}
            description={asset.type}
            action={
              <Button onClick={handleEditClick}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Asset
              </Button>
            }
          />
        </div>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <InfoRow label="Asset ID">{asset.assetId}</InfoRow>
              <InfoRow label="Type">{asset.type}</InfoRow>
              <InfoRow label="Description">{asset.description || "-"}</InfoRow>
              <InfoRow label="Status">
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
              </InfoRow>
              <InfoRow label="Location">{asset.location || "-"}</InfoRow>
              <InfoRow label="Funding Department">{asset.fundingDepartment}</InfoRow>
            </CardContent>
          </Card>

          {/* Hardware Details */}
          <Card>
            <CardHeader>
              <CardTitle>Hardware Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <InfoRow label="Manufacturer">{asset.manufacturer || "-"}</InfoRow>
              <InfoRow label="Model">{asset.model || "-"}</InfoRow>
              <InfoRow label="Model Generation">{asset.modelGeneration || "-"}</InfoRow>
              <InfoRow label="Serial Number">{asset.serialNumber || "-"}</InfoRow>
              <InfoRow label="Vendor">{asset.vendor || "-"}</InfoRow>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          {(asset.memory || asset.hddSize || asset.cpuGeneration || asset.gpuModel) && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {asset.memory && <InfoRow label="Memory">{asset.memory}</InfoRow>}
                {asset.hddSize && <InfoRow label="Storage Size">{asset.hddSize}</InfoRow>}
                {asset.hddType && <InfoRow label="Storage Type">{asset.hddType}</InfoRow>}
                {asset.cpuGeneration && <InfoRow label="CPU Generation">{asset.cpuGeneration}</InfoRow>}
                {asset.cpuSpeed && <InfoRow label="CPU Speed">{asset.cpuSpeed}</InfoRow>}
                {asset.gpuModel && <InfoRow label="GPU Model">{asset.gpuModel}</InfoRow>}
                {asset.videoCard && <InfoRow label="Video Card">{asset.videoCard}</InfoRow>}
              </CardContent>
            </Card>
          )}

          {/* Network & Connectivity */}
          {(asset.wiredMac || asset.wirelessMac || asset.output1 || asset.output2) && (
            <Card>
              <CardHeader>
                <CardTitle>Network & Connectivity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {asset.wiredMac && <InfoRow label="Wired MAC">{asset.wiredMac}</InfoRow>}
                {asset.wirelessMac && <InfoRow label="Wireless MAC">{asset.wirelessMac}</InfoRow>}
                {asset.output1 && <InfoRow label="Output 1">{asset.output1}</InfoRow>}
                {asset.output2 && <InfoRow label="Output 2">{asset.output2}</InfoRow>}
              </CardContent>
            </Card>
          )}

          {/* Quick Status Change */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Current Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue>
                      {newStatus ? newStatus.charAt(0).toUpperCase() + newStatus.slice(1) : "Select status"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleStatusChange}
                disabled={!newStatus || updateAsset.isPending || newStatus === asset?.status}
                className="w-full"
              >
                {updateAsset.isPending ? "Updating..." : "Update Status"}
              </Button>
            </CardContent>
          </Card>

          {/* Assignment Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Assignment Information</CardTitle>
              <div className="flex gap-2">
                {asset.assignedToId ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleUnassignAsset}
                    disabled={unassignAsset.isPending}
                  >
                    <UserMinus className="mr-2 h-4 w-4" />
                    {unassignAsset.isPending ? "Unassigning..." : "Unassign"}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAssignModal(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign to User
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-0">
              {asset.assignedToId ? (
                <>
                  <InfoRow label="Assigned To">
                    {assignedUser?.data?.name || assignedUser?.data?.email || "Loading..."}
                  </InfoRow>
                  {asset.assignedDate && (
                    <InfoRow label="Assigned Date">
                      {new Date(asset.assignedDate).toLocaleDateString()}
                    </InfoRow>
                  )}
                </>
              ) : (
                <InfoRow label="Status">
                  <span className="text-muted-foreground">Not assigned to any user</span>
                </InfoRow>
              )}
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {asset.cost && <InfoRow label="Cost">${asset.cost.toFixed(2)}</InfoRow>}
              {asset.po && <InfoRow label="Purchase Order">{asset.po}</InfoRow>}
              {asset.receivedDate && (
                <InfoRow label="Received Date">
                  {new Date(asset.receivedDate).toLocaleDateString()}
                </InfoRow>
              )}
              {asset.disposalDate && (
                <InfoRow label="Disposal Date">
                  {new Date(asset.disposalDate).toLocaleDateString()}
                </InfoRow>
              )}
              {asset.disposalType && <InfoRow label="Disposal Type">{asset.disposalType}</InfoRow>}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Assign Asset Dialog */}
      <Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Asset to User</DialogTitle>
            <DialogDescription>
              Select a user to assign this asset to. The asset will be marked as assigned.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="selectUser">Select User</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="selectUser">
                  <SelectValue placeholder="Choose a user..." />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {user.email} • {user.role}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {allUsers.length === 0 && (
                <p className="text-sm text-muted-foreground">No users available</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignAsset} disabled={!selectedUserId || assignAsset.isPending}>
              {assignAsset.isPending ? "Assigning..." : "Assign Asset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update asset information</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetId">Asset ID *</Label>
                  <Input
                    id="assetId"
                    value={editFormData.assetId || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, assetId: e.target.value })}
                    placeholder="e.g. LAPTOP-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select value={editFormData.type || ""} onValueChange={(value) => setEditFormData({ ...editFormData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Monitor">Monitor</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Printer">Printer</SelectItem>
                      <SelectItem value="Server">Server</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editFormData.description || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    placeholder="Asset description..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={editFormData.status || ""} onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="disposed">Disposed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editFormData.location || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    placeholder="e.g. Room 301"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fundingDepartment">Funding Department *</Label>
                  <Input
                    id="fundingDepartment"
                    value={editFormData.fundingDepartment || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, fundingDepartment: e.target.value })}
                    placeholder="e.g. IT Department"
                  />
                </div>
              </div>
            </div>

            {/* Hardware Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">Hardware Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={editFormData.manufacturer || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, manufacturer: e.target.value })}
                    placeholder="e.g. Dell, HP, Apple"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={editFormData.model || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, model: e.target.value })}
                    placeholder="e.g. Latitude 5420"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelGeneration">Model Generation</Label>
                  <Input
                    id="modelGeneration"
                    value={editFormData.modelGeneration || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, modelGeneration: e.target.value })}
                    placeholder="e.g. Gen 11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={editFormData.serialNumber || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, serialNumber: e.target.value })}
                    placeholder="Serial number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input
                    id="vendor"
                    value={editFormData.vendor || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, vendor: e.target.value })}
                    placeholder="Vendor name"
                  />
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">Technical Specifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="memory">Memory</Label>
                  <Input
                    id="memory"
                    value={editFormData.memory || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, memory: e.target.value })}
                    placeholder="e.g. 16GB DDR4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hddSize">Storage Size</Label>
                  <Input
                    id="hddSize"
                    value={editFormData.hddSize || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, hddSize: e.target.value })}
                    placeholder="e.g. 512GB"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hddType">Storage Type</Label>
                  <Input
                    id="hddType"
                    value={editFormData.hddType || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, hddType: e.target.value })}
                    placeholder="e.g. SSD, HDD"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpuGeneration">CPU Generation</Label>
                  <Input
                    id="cpuGeneration"
                    value={editFormData.cpuGeneration || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, cpuGeneration: e.target.value })}
                    placeholder="e.g. Intel i7 11th Gen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpuSpeed">CPU Speed</Label>
                  <Input
                    id="cpuSpeed"
                    value={editFormData.cpuSpeed || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, cpuSpeed: e.target.value })}
                    placeholder="e.g. 2.8 GHz"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpuModel">GPU Model</Label>
                  <Input
                    id="gpuModel"
                    value={editFormData.gpuModel || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, gpuModel: e.target.value })}
                    placeholder="e.g. NVIDIA RTX 3060"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="videoCard">Video Card</Label>
                  <Input
                    id="videoCard"
                    value={editFormData.videoCard || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, videoCard: e.target.value })}
                    placeholder="Video card details"
                  />
                </div>
              </div>
            </div>

            {/* Network & Connectivity */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">Network & Connectivity</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wiredMac">Wired MAC Address</Label>
                  <Input
                    id="wiredMac"
                    value={editFormData.wiredMac || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, wiredMac: e.target.value })}
                    placeholder="e.g. 00:1A:2B:3C:4D:5E"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wirelessMac">Wireless MAC Address</Label>
                  <Input
                    id="wirelessMac"
                    value={editFormData.wirelessMac || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, wirelessMac: e.target.value })}
                    placeholder="e.g. 00:1A:2B:3C:4D:5F"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="output1">Output 1</Label>
                  <Input
                    id="output1"
                    value={editFormData.output1 || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, output1: e.target.value })}
                    placeholder="e.g. HDMI"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="output2">Output 2</Label>
                  <Input
                    id="output2"
                    value={editFormData.output2 || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, output2: e.target.value })}
                    placeholder="e.g. DisplayPort"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase">Financial Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={editFormData.cost || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, cost: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="po">Purchase Order</Label>
                  <Input
                    id="po"
                    value={editFormData.po || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, po: e.target.value })}
                    placeholder="PO number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receivedDate">Received Date</Label>
                  <Input
                    id="receivedDate"
                    type="date"
                    value={editFormData.receivedDate || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, receivedDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disposalDate">Disposal Date</Label>
                  <Input
                    id="disposalDate"
                    type="date"
                    value={editFormData.disposalDate || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, disposalDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disposalType">Disposal Type</Label>
                  <Input
                    id="disposalType"
                    value={editFormData.disposalType || ""}
                    onChange={(e) => setEditFormData({ ...editFormData, disposalType: e.target.value })}
                    placeholder="e.g. Recycled, Donated"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateAsset.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateAsset.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute roles={["operator", "admin"]}>
      <AssetDetailContent params={params} />
    </ProtectedRoute>
  )
}
