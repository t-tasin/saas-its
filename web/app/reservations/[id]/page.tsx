"use client"

import { useState } from "react"
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
import { useAuth } from "@/contexts/auth-context"
import { useReservation, useApproveReservation, useDenyReservation } from "@/hooks/use-reservations"
import { reservationApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Package, Calendar, CheckCircle, XCircle, PlayCircle, RotateCcw } from "lucide-react"

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

  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showDenyDialog, setShowDenyDialog] = useState(false)
  const [assetIds, setAssetIds] = useState("")
  const [approvalNotes, setApprovalNotes] = useState("")
  const [denialReason, setDenialReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const handleApprove = async () => {
    if (!assetIds.trim()) {
      toast({
        title: "Error",
        description: "Please provide asset IDs.",
        variant: "destructive",
      })
      return
    }

    try {
      const ids = assetIds.split(",").map((id) => id.trim())
      await approveReservation.mutateAsync({
        id: reservationId,
        assetIds: ids,
        notes: approvalNotes || undefined,
      })

      toast({
        title: "Success",
        description: "Reservation approved successfully.",
      })

      setShowApproveDialog(false)
      setAssetIds("")
      setApprovalNotes("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve reservation. Please try again.",
        variant: "destructive",
      })
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

  const handleActivate = async () => {
    setActionLoading(true)
    try {
      await reservationApi.activate(reservationId)
      toast({
        title: "Success",
        description: "Reservation marked as active (picked up).",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate reservation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleReturn = async () => {
    setActionLoading(true)
    try {
      await reservationApi.return(reservationId)
      toast({
        title: "Success",
        description: "Equipment marked as returned.",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as returned. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

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
  const canActivate = isOperator && reservation.status === "approved"
  const canReturn = isOperator && reservation.status === "active"
  const canCancel = reservation.status === "pending" || reservation.status === "approved"

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
                  {canDeny && (
                    <Button onClick={() => setShowDenyDialog(true)} variant="destructive" className="w-full">
                      <XCircle className="mr-2 h-4 w-4" />
                      Deny
                    </Button>
                  )}
                  {canActivate && (
                    <Button onClick={handleActivate} disabled={actionLoading} className="w-full">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Mark as Picked Up
                    </Button>
                  )}
                  {canReturn && (
                    <Button onClick={handleReturn} disabled={actionLoading} className="w-full">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Mark as Returned
                    </Button>
                  )}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Reservation</DialogTitle>
            <DialogDescription>Assign specific assets to this reservation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assetIds">Asset IDs *</Label>
              <Input
                id="assetIds"
                placeholder="Enter asset IDs separated by commas"
                value={assetIds}
                onChange={(e) => setAssetIds(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Example: asset-001, asset-002</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="approvalNotes">Notes (Optional)</Label>
              <Textarea
                id="approvalNotes"
                placeholder="Add any notes..."
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
            <Button onClick={handleApprove} disabled={approveReservation.isPending}>
              {approveReservation.isPending ? "Approving..." : "Approve"}
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
              {denyReservation.isPending ? "Denying..." : "Deny"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
