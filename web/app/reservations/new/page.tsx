"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useCreateReservation } from "@/hooks/use-reservations"
import { useAssetTypes } from "@/hooks/use-assets"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AlertCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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

export default function NewReservationPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const createReservation = useCreateReservation()
  const { data: assetTypesResponse, isLoading: assetsLoading } = useAssetTypes()

  const [formData, setFormData] = useState({
    purpose: "",
    requestDate: "",
    returnDate: "",
    equipmentType: "",
    quantity: 1,
    notes: "",
    requesterName: "",
    requesterEmail: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showInsufficientAssetDialog, setShowInsufficientAssetDialog] = useState(false)
  const [pendingReservationData, setPendingReservationData] = useState<any>(null)
  const [maxReturnDate, setMaxReturnDate] = useState("")

  // Get asset types from public endpoint
  const assetTypes = (assetTypesResponse?.data || []).map((item: any) => item.type).filter(Boolean)

  useEffect(() => {
    if (formData.requestDate) {
      const request = new Date(formData.requestDate)
      const maxReturn = new Date(request)
      maxReturn.setDate(maxReturn.getDate() + 14)
      setMaxReturnDate(maxReturn.toISOString().split("T")[0])

      if (formData.returnDate) {
        const returnDateObj = new Date(formData.returnDate)
        if (returnDateObj > maxReturn) {
          setFormData(prev => ({ ...prev, returnDate: "" }))
          toast({
            title: "Date Adjusted",
            description: "Return date cannot be more than 14 days from pickup date.",
            variant: "destructive",
          })
        }
      }
    }
  }, [formData.requestDate])

  const handleSubmit = async (e: React.FormEvent, forceRequest = false) => {
    e.preventDefault()

    if (!formData.equipmentType || !formData.purpose) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!isAuthenticated && !formData.requesterName && !formData.requesterEmail) {
      toast({
        title: "Error",
        description: "Please provide your name or email.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const reservationData: any = {
        equipmentType: formData.equipmentType,
        quantity: formData.quantity,
        purpose: formData.purpose,
        requestDate: new Date(formData.requestDate).toISOString(),
        returnDate: new Date(formData.returnDate).toISOString(),
        notes: formData.notes || undefined,
        forceRequest,
      }

      if (!isAuthenticated) {
        reservationData.requesterName = formData.requesterName || undefined
        reservationData.requesterEmail = formData.requesterEmail || undefined
      }

      const result = await createReservation.mutateAsync(reservationData)

      toast({
        title: "Success",
        description: "Your reservation request has been submitted successfully.",
      })

      router.push(isAuthenticated ? "/dashboard" : "/")
    } catch (error: any) {
      const errorMessage = error.message?.toLowerCase() || ""
      
      // Check if it's an insufficient asset error
      if (errorMessage.includes("insufficient") || errorMessage.includes("not available")) {
        setPendingReservationData(reservationData)
        setShowInsufficientAssetDialog(true)
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create reservation. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSpecialRequest = async () => {
    setShowInsufficientAssetDialog(false)
    setIsSubmitting(true)

    try {
      const result = await createReservation.mutateAsync({
        ...pendingReservationData,
        forceRequest: true,
      })

      toast({
        title: "Special Request Submitted",
        description: "Your special request has been submitted and will be reviewed by an administrator.",
      })

      router.push(isAuthenticated ? "/dashboard" : "/")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit special request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PageHeader title="Request Equipment Reservation" description="Reserve equipment for your project or event" />

        <form onSubmit={(e) => handleSubmit(e, false)} className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Details</CardTitle>
              <CardDescription>Select the equipment type and quantity you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assetsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="equipmentType">Equipment Type *</Label>
                    <Select
                      value={formData.equipmentType}
                      onValueChange={(value) => setFormData({ ...formData, equipmentType: value })}
                    >
                      <SelectTrigger id="equipmentType">
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
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose *</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Describe why you need this equipment..."
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reservation Dates</CardTitle>
              <CardDescription>When do you need the equipment? (Maximum 14 days)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Reservations are limited to a maximum of 14 days. Return date must be within 2 weeks of pickup date.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestDate">Pickup Date *</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => setFormData({ ...formData, requestDate: e.target.value })}
                    min={today}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date *</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    min={formData.requestDate || today}
                    max={maxReturnDate || undefined}
                    required
                  />
                  {formData.requestDate && formData.returnDate && (
                    <p className="text-xs text-muted-foreground">
                      Duration:{" "}
                      {Math.ceil(
                        (new Date(formData.returnDate).getTime() - new Date(formData.requestDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special requirements or notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {!isAuthenticated && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How should we reach you about this reservation?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requesterName">Your Name</Label>
                  <Input
                    id="requesterName"
                    placeholder="Enter your full name"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requesterEmail">Your Email</Label>
                  <Input
                    id="requesterEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.requesterEmail}
                    onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Please provide at least your name or email so we can contact you about your reservation.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting || assetsLoading} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Reservation Request"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(isAuthenticated ? "/dashboard" : "/")}
              className="bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Insufficient Asset Dialog */}
        <AlertDialog open={showInsufficientAssetDialog} onOpenChange={setShowInsufficientAssetDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Item Not Available
              </AlertDialogTitle>
              <AlertDialogDescription>
                The equipment you requested is not available for the selected dates. However, you can submit this as a
                special request, and an administrator will review it. They may be able to reassign equipment or make
                other arrangements.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSpecialRequest}>Submit Special Request</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
