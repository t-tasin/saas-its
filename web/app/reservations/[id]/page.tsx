"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { InfoRow } from "@/components/info-row"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useReservation, useApproveReservation, useDenyReservation, useMarkAsPickedUp, useCompleteReservation } from "@/hooks/use-reservations"
import { useAssets } from "@/hooks/use-assets"
import { reservationApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Package, Calendar, CheckCircle, XCircle, PackageCheck, PackageX } from "lucide-react"

export default function ReservationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isOperator } = useAuth()
  const { toast } = useToast()

  const reservationId = params.id as string
  const { data, isLoading, refetch } = useReservation(reservationId)
  const reservation = data?.data
  const approveReservation = useApproveReservation()
  const denyReservation = useDenyReservation()
  const markAsPickedUp = useMarkAsPickedUp()
  const completeReservation = useCompleteReservation()

  // Fetch available assets for approval
  const { data: assetsResponse } = useAssets()
  const allAssets = assetsResponse?.data || []

  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showDenyDialog, setShowDenyDialog] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([])
  const [approvalNotes, setApprovalNotes] = useState("")
  const [denialReason, setDenialReason] = useState("")
  const [returnNotes, setReturnNotes] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  // Filter available assets by equipment type requested
  const availableAssets = useMemo(() => {
    if (!reservation?.equipmentType) return []
    const requestedType = reservation.equipmentType.toLowerCase()
    return allAssets.filter(
      (asset) => asset.type?.toLowerCase() === requestedType && asset.status === "available"
    )
  }, [allAssets, reservation?.equipmentType])

  const handleApprove = async () => {
    const requiredQuantity = reservation?.quantity || 1
    
    if (selectedAssetIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one asset.",
        variant: "destructive",
      })
      return
    }

    if (selectedAssetIds.length !== requiredQuantity) {
      toast({
        title: "Error",
        description: `Please select exactly ${requiredQuantity} asset${requiredQuantity > 1 ? 's' : ''} (currently selected: ${selectedAssetIds.length})`,
        variant: "destructive",
      })
      return
    }

    try {
      await approveReservation.mutateAsync({
        id: reservationId,
        assetIds: selectedAssetIds,
        notes: approvalNotes || undefined,
      })

      toast({
        title: "Success",
        description: "Reservation approved successfully.",
      })

      setShowApproveDialog(false)
      setSelectedAssetIds([])
      setApprovalNotes("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve reservation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddAsset = (assetId: string) => {
    if (!selectedAssetIds.includes(assetId)) {
      setSelectedAssetIds([...selectedAssetIds, assetId])
    }
  }

  const handleRemoveAsset = (assetId: string) => {
    setSelectedAssetIds(selectedAssetIds.filter((id) => id !== assetId))
  }

  const handlePickup = async () => {
    try {
      await markAsPickedUp.mutateAsync({ id: reservationId })
      refetch()
    } catch (error) {
      // Error already handled by mutation
    }
  }

  const handleReturn = async () => {
    try {
      await completeReservation.mutateAsync({
        id: reservationId,
        returnNotes: returnNotes.trim() || undefined,
      })
      setShowReturnDialog(false)
      setReturnNotes("")
      refetch()
    } catch (error) {
      // Error already handled by mutation
    }
  }

  const handleDeny = async () => {
    if (!denialReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for denial.",
        variant: "destructive",
      })
      return
    }

    try {
      await denyReservation.mutateAsync({
        id: reservationId,
        reason: denialReason,
      })

      toast({
        title: "Success",
        description: "Reservation denied.",
      })

      setShowDenyDialog(false)
      setDenialReason("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deny reservation. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Old handlers removed - now using handlePickup and handleReturn with hooks

  const handleCancel = async () => {
    setActionLoading(true)
    try {
      await reservationApi.cancel(reservationId)
      toast({
        title: "Success",
        description: "Reservation cancelled.",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel reservation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Reservation Not Found</h2>
            <p className="text-muted-foreground mb-4">The reservation you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/reservations")}>Back to Reservations</Button>
          </div>
        </div>
      </div>
    )
  }

  const canApprove = isOperator && reservation.status === "pending"
  const canDeny = isOperator && reservation.status === "pending"
  const canCancel = reservation.status === "pending" || reservation.status === "approved"
  
  // Note: pickup/return conditions are now handled inline in the buttons

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <PageHeader
          title={`Reservation #${reservation.id?.slice(0, 8) || reservation.reservationNumber || "Unknown"}`}
          description={`Requested on ${formatDate(reservation.createdAt)}`}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reservation Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Reservation Details</CardTitle>
                  <StatusBadge status={reservation.status || "pending"} type="reservation" />
                </div>
              </CardHeader>
              <CardContent className="space-y-0">
                <InfoRow label="Status">{reservation.status || "Unknown"}</InfoRow>
                <InfoRow label="Equipment Type">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {reservation.equipmentType || "Not specified"}
                  </span>
                </InfoRow>
                <InfoRow label="Quantity">{reservation.quantity || 1}</InfoRow>
                {reservation.purpose && (
                  <InfoRow label="Purpose">
                    <p className="text-sm">{reservation.purpose}</p>
                  </InfoRow>
                )}
                <InfoRow label="Requester">
                  {reservation.requester?.name ||
                    reservation.requesterName ||
                    reservation.requesterEmail ||
                    "Anonymous"}
                </InfoRow>
                {reservation.requesterEmail && <InfoRow label="Email">{reservation.requesterEmail}</InfoRow>}
                <InfoRow label="Pickup Date">{formatDate(reservation.requestDate)}</InfoRow>
                <InfoRow label="Return Date">{formatDate(reservation.returnDate)}</InfoRow>
                {reservation.actualReturnDate && (
                  <InfoRow label="Actual Return Date">{formatDate(reservation.actualReturnDate)}</InfoRow>
                )}
                {reservation.assignedAssetIds && (
                  <InfoRow label="Assigned Assets">
                    <div className="space-y-1">
                      {reservation.assignedAssetIds.split(',').map((assetId: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                            {assetId.trim()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/assets/${assetId.trim()}`)}
                          >
                            View Asset
                          </Button>
                        </div>
                      ))}
                    </div>
                  </InfoRow>
                )}
                {reservation.notes && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reservation.notes}</p>
                  </div>
                )}
                {reservation.denialReason && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2 text-destructive">Denial Reason</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reservation.denialReason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Equipment List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Requested Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(reservation.items || []).map((item: any, index: number) => (
                    <div key={item.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.assetTypeName || "Unknown Equipment"}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity || 0}</p>
                        </div>
                      </div>
                      {item.assignedAssets && item.assignedAssets.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Assigned: {item.assignedAssets.map((a: any) => a.assetTag).join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            {isOperator && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {canApprove && (
                    <Button onClick={() => setShowApproveDialog(true)} className="w-full">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  )}
                  {reservation?.status === "approved" && !reservation?.pickedUpAt && (
                    <Button onClick={handlePickup} className="w-full" disabled={markAsPickedUp.isPending}>
                      {markAsPickedUp.isPending ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <PackageCheck className="mr-2 h-4 w-4" />
                          Mark as Picked Up
                        </>
                      )}
                    </Button>
                  )}
                  {reservation?.status === "approved" && reservation?.pickedUpAt && !reservation?.actualReturnDate && (
                    <Button onClick={() => setShowReturnDialog(true)} className="w-full bg-green-600 hover:bg-green-700">
                      <PackageX className="mr-2 h-4 w-4" />
                      Mark as Returned
                    </Button>
                  )}
                  {canDeny && (
                    <Button onClick={() => setShowDenyDialog(true)} variant="destructive" className="w-full">
                      <XCircle className="mr-2 h-4 w-4" />
                      Deny
                    </Button>
                  )}
                  {/* Old activate/return buttons removed - using new pickup/return flow above */}
                  {canCancel && (
                    <Button
                      onClick={handleCancel}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      Cancel Reservation
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Reservation ID</p>
                  <p className="font-mono font-medium">
                    #{reservation.id?.slice(0, 8) || reservation.reservationNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Current Status</p>
                  <StatusBadge status={reservation.status || "pending"} type="reservation" />
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Duration</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(reservation.requestDate)} - {formatDate(reservation.returnDate)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approve Reservation</DialogTitle>
            <DialogDescription>
              Select available {reservation?.equipmentType || "equipment"} assets to assign to this reservation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Show requested equipment type */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Equipment Requested</p>
                  <p className="text-lg font-semibold text-blue-600">{reservation?.equipmentType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Quantity Needed</p>
                  <p className="text-lg font-semibold">{reservation?.quantity || 1}</p>
                </div>
              </div>
            </div>

          {/* Available assets dropdown with descriptions */}
          <div className="space-y-2">
            <Label>Select Assets * (Need {reservation?.quantity || 1}, Selected: {selectedAssetIds.length})</Label>
              {availableAssets.length === 0 ? (
                <p className="text-sm text-muted-foreground p-3 border rounded-lg">
                  No available {reservation?.equipmentType || "equipment"} assets found.
                </p>
              ) : (
                <Select
                  onValueChange={(value) => {
                    const asset = availableAssets.find((a) => a.id === value)
                    if (asset) {
                      handleAddAsset(asset.id)
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an asset to add..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAssets
                      .filter((asset) => !selectedAssetIds.includes(asset.id))
                      .map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{asset.assetId || asset.id.slice(0, 8)}</span>
                            <span className="text-xs text-muted-foreground truncate">
                              {asset.description || `${asset.type} - ${asset.model || "No model"}`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Selected assets list */}
            {selectedAssetIds.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Assets ({selectedAssetIds.length})</Label>
                <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                  {selectedAssetIds.map((assetId) => {
                    const asset = allAssets.find((a) => a.id === assetId)
                    return (
                      <div key={assetId} className="p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{asset?.assetId || assetId.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">
                            {asset?.description || `${asset?.type || "Asset"} - ${asset?.model || "N/A"}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAsset(assetId)}
                          className="h-8 w-8 p-0"
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Approval notes */}
            <div className="space-y-2">
              <Label htmlFor="approvalNotes">Notes (Optional)</Label>
              <Textarea
                id="approvalNotes"
                placeholder="Add any notes about the approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={approveReservation.isPending || selectedAssetIds.length === 0}>
              {approveReservation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Approving...
                </>
              ) : (
                "Approve"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deny Dialog */}
      <Dialog open={showDenyDialog} onOpenChange={setShowDenyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deny Reservation</DialogTitle>
            <DialogDescription>Provide a reason for denying this reservation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="denialReason">Reason *</Label>
              <Textarea
                id="denialReason"
                placeholder="Explain why this reservation is being denied..."
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDenyDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleDeny} disabled={denyReservation.isPending} variant="destructive">
              {denyReservation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Denying...
                </>
              ) : (
                "Deny"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Returned</DialogTitle>
            <DialogDescription>
              Confirm that the assets have been returned. This will unassign all assets and make them available again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="returnNotes">Return Notes (Optional)</Label>
              <Textarea
                id="returnNotes"
                placeholder="Add any notes about the return condition..."
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReturnDialog(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleReturn} disabled={completeReservation.isPending} className="bg-green-600 hover:bg-green-700">
              {completeReservation.isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Processing...
                </>
              ) : (
                "Confirm Return"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
