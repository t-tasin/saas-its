"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateReservation } from "@/hooks/use-reservations"
import { useAuth } from "@/contexts/auth-context"
import { useAssetTypes } from "@/hooks/use-assets"
import { Loader2, Plus, Minus, CheckCircle2, AlertTriangle } from "lucide-react"
import { toast } from "react-hot-toast"

interface CreateReservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateReservationModal({ open, onOpenChange }: CreateReservationModalProps) {
  const { user } = useAuth()
  const createReservation = useCreateReservation()
  const { data: assetTypesResponse } = useAssetTypes()
  const [formData, setFormData] = useState({
    purpose: "",
    startDate: "",
    endDate: "",
    assetType: "",
    quantity: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showInsufficientAssetDialog, setShowInsufficientAssetDialog] = useState(false)
  const [pendingReservationData, setPendingReservationData] = useState<any>(null)

  // Get asset types from public endpoint
  const assetTypes = (assetTypesResponse?.data || []).map((item: any) => item.type).filter(Boolean)

  const handleSubmit = async (e: React.FormEvent, forceRequest = false) => {
    e.preventDefault()

    if (formData.purpose.length < 5 || formData.purpose.length > 500) {
      toast.error("Purpose must be 5-500 characters")
      return
    }

    // Validate dates
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Start of today
    
    // Check if start date is in the past
    if (start < now) {
      toast.error("Pickup date must be today or in the future")
      return
    }

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays > 14) {
      toast.error("Reservation period cannot exceed 14 days")
      return
    }

    if (diffDays < 1) {
      toast.error("Return date must be after pickup date")
      return
    }

    if (!formData.assetType) {
      toast.error("Please select an equipment type")
      return
    }

    setIsSubmitting(true)
    setIsSuccess(false)

    const reservationData = {
      equipmentType: formData.assetType,
      quantity: formData.quantity,
      purpose: formData.purpose,
      requestDate: formData.startDate,
      returnDate: formData.endDate,
      forceRequest, // Add flag to indicate special request
    }

    try {
      await createReservation.mutateAsync(reservationData)

      setIsSuccess(true)
      // Toast is shown by the mutation hook

      setTimeout(() => {
        setFormData({ purpose: "", startDate: "", endDate: "", assetType: "", quantity: 1 })
        setIsSuccess(false)
        setPendingReservationData(null)
        onOpenChange(false)
      }, 1500)
    } catch (error: any) {
      console.error("Failed to create reservation:", error)
      
      // Check if the error is due to insufficient assets
      const errorMsg = error.response?.data?.message || error.response?.data?.error?.message || error.message || ""
      if (errorMsg.toLowerCase().includes("insufficient") || errorMsg.toLowerCase().includes("not available") || errorMsg.toLowerCase().includes("no available")) {
        // Show the insufficient asset dialog
        setPendingReservationData(reservationData)
        setShowInsufficientAssetDialog(true)
      }
      // Toast error is shown by the mutation hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSpecialRequest = async () => {
    setShowInsufficientAssetDialog(false)
    setIsSubmitting(true)
    
    try {
      // Retry with force request flag
      if (pendingReservationData) {
        await createReservation.mutateAsync({
          ...pendingReservationData,
          forceRequest: true,
        })

        setIsSuccess(true)
        toast.success("Special request submitted successfully!")

        setTimeout(() => {
          setFormData({ purpose: "", startDate: "", endDate: "", assetType: "", quantity: 1 })
          setIsSuccess(false)
          setPendingReservationData(null)
          onOpenChange(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Failed to submit special request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate max end date (14 days from start)
  const getMaxEndDate = () => {
    if (!formData.startDate) return ""
    const start = new Date(formData.startDate)
    start.setDate(start.getDate() + 14)
    return start.toISOString().split("T")[0]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Reservation Request</DialogTitle>
          <DialogDescription>
            Request equipment for up to 14 days. Your request will be reviewed by an operator.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Describe why you need this equipment"
              minLength={5}
              maxLength={500}
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground">{formData.purpose.length}/500 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Return Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate || new Date().toISOString().split("T")[0]}
                max={getMaxEndDate()}
                required
              />
              <p className="text-xs text-muted-foreground">Maximum 14 days</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assetType">Equipment Type *</Label>
            <Select
              value={formData.assetType}
              onValueChange={(value) => setFormData({ ...formData, assetType: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select equipment type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) })}
                disabled={isSubmitting}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                min={1}
                className="text-center w-20"
                required
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isSuccess}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSuccess && <CheckCircle2 className="mr-2 h-4 w-4" />}
              {isSuccess ? "Submitted!" : isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>

      {/* Insufficient Asset Alert Dialog */}
      <AlertDialog open={showInsufficientAssetDialog} onOpenChange={setShowInsufficientAssetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <AlertDialogTitle>Item Not Available</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              The requested equipment is not available at this moment. However, you can submit a special request and an operator may be able to reassign devices to fulfill your request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowInsufficientAssetDialog(false)
              setPendingReservationData(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSpecialRequest} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Special Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  )
}
