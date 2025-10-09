"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useCreateReservation, useEquipmentAvailability } from "@/hooks/use-reservations"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Plus, Minus, Package } from "lucide-react"
import type { EquipmentAvailability } from "@/types"

export default function NewReservationPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()

  const [requestDate, setRequestDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [requesterName, setRequesterName] = useState("")
  const [requesterEmail, setRequesterEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [selectedItems, setSelectedItems] = useState<
    Map<string, { assetTypeId: string; name: string; quantity: number }>
  >(new Map())

  const { data: availability, isLoading: availabilityLoading } = useEquipmentAvailability()
  const createReservation = useCreateReservation()

  const handleQuantityChange = (equipment: EquipmentAvailability, delta: number) => {
    const newMap = new Map(selectedItems)
    const current = newMap.get(equipment.assetTypeId)

    if (current) {
      const newQuantity = current.quantity + delta
      if (newQuantity <= 0) {
        newMap.delete(equipment.assetTypeId)
      } else if (newQuantity <= equipment.availableCount) {
        newMap.set(equipment.assetTypeId, { ...current, quantity: newQuantity })
      }
    } else if (delta > 0 && equipment.availableCount > 0) {
      newMap.set(equipment.assetTypeId, {
        assetTypeId: equipment.assetTypeId,
        name: equipment.assetTypeName,
        quantity: 1,
      })
    }

    setSelectedItems(newMap)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedItems.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one equipment item.",
        variant: "destructive",
      })
      return
    }

    try {
      const reservationData: any = {
        requestDate,
        returnDate,
        notes: notes || undefined,
        items: Array.from(selectedItems.values()).map((item) => ({
          assetTypeId: item.assetTypeId,
          quantity: item.quantity,
        })),
      }

      // Add requester info if not authenticated
      if (!isAuthenticated) {
        if (!requesterName && !requesterEmail) {
          toast({
            title: "Error",
            description: "Please provide your name or email.",
            variant: "destructive",
          })
          return
        }
        reservationData.requesterName = requesterName || undefined
        reservationData.requesterEmail = requesterEmail || undefined
      }

      const result = await createReservation.mutateAsync(reservationData)

      toast({
        title: "Success",
        description: "Your reservation request has been submitted successfully.",
      })

      router.push(`/reservations/${result.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create reservation. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <PageHeader title="Request Equipment Reservation" description="Reserve equipment for your project or event" />

        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
          {/* Equipment Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Equipment</CardTitle>
              <CardDescription>Choose the equipment you need and specify quantities</CardDescription>
            </CardHeader>
            <CardContent>
              {availabilityLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="space-y-3">
                  {availability?.data?.map((equipment: EquipmentAvailability) => {
                    const selected = selectedItems.get(equipment.assetTypeId)
                    const quantity = selected?.quantity || 0

                    return (
                      <div
                        key={equipment.assetTypeId}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Package className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{equipment.assetTypeName}</p>
                            <p className="text-sm text-muted-foreground">
                              {equipment.availableCount} of {equipment.totalCount} available
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {quantity > 0 && <Badge variant="secondary">Selected: {quantity}</Badge>}
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(equipment, -1)}
                              disabled={quantity === 0}
                              className="bg-transparent"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleQuantityChange(equipment, 1)}
                              disabled={quantity >= equipment.availableCount}
                              className="bg-transparent"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates and Details */}
          <Card>
            <CardHeader>
              <CardTitle>Reservation Details</CardTitle>
              <CardDescription>Specify when you need the equipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestDate">Pickup Date *</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    min={today}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnDate">Return Date *</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={requestDate || today}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any special requirements or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information (for non-authenticated users) */}
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
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requesterEmail">Your Email</Label>
                  <Input
                    id="requesterEmail"
                    type="email"
                    placeholder="you@example.com"
                    value={requesterEmail}
                    onChange={(e) => setRequesterEmail(e.target.value)}
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Please provide at least your name or email so we can contact you about your reservation.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {selectedItems.size > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Reservation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(selectedItems.values()).map((item) => (
                    <div key={item.assetTypeId} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-medium">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={createReservation.isPending} className="flex-1">
              {createReservation.isPending ? "Submitting..." : "Submit Reservation Request"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
