"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCreateReservation } from "@/hooks/use-reservations"
import { useAuth } from "@/contexts/auth-context"
import mockData from "@/data/mock-data.json"
import { Loader2, Plus, Minus, CheckCircle2 } from "lucide-react"
import { toast } from "react-hot-toast"

interface CreateReservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateReservationModal({ open, onOpenChange }: CreateReservationModalProps) {
  const { user } = useAuth()
  const createReservation = useCreateReservation()
  const [formData, setFormData] = useState({
    purpose: "",
    startDate: "",
    endDate: "",
    assetType: "",
    quantity: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Get unique asset types
  const assetTypes = Array.from(new Set(mockData.assets.map((a) => a.assetType.name)))

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      await createReservation.mutateAsync({
        equipmentType: formData.assetType, // Backend expects equipmentType, not items array
        quantity: formData.quantity,
        purpose: formData.purpose,
        requestDate: formData.startDate, // Backend expects requestDate
        returnDate: formData.endDate, // Backend expects returnDate
      })

      setIsSuccess(true)
      toast.success("Reservation request submitted successfully!")

      setTimeout(() => {
        setFormData({ purpose: "", startDate: "", endDate: "", assetType: "", quantity: 1 })
        setIsSuccess(false)
        onOpenChange(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to create reservation:", error)
      toast.error("Failed to create reservation. Please try again.")
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
    </Dialog>
  )
}
