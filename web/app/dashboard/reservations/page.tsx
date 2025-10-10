"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import mockData from "@/data/mock-data.json"
import { Plus, Search, Calendar, Package } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { EmptyState } from "@/components/empty-state"
import { ProtectedRoute } from "@/components/protected-route"
import { CreateReservationModal } from "@/components/create-reservation-modal"

function DashboardReservationsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null)
  const [showAssetModal, setShowAssetModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)

  const filteredReservations = mockData.reservations.filter((reservation) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      reservation.id.toLowerCase().includes(query) ||
      reservation.requesterName?.toLowerCase().includes(query) ||
      reservation.items.some((item) => item.assetTypeName.toLowerCase().includes(query))
    )
  })

  const assetsForType = selectedAssetType
    ? mockData.assets.filter((asset) => asset.assetType.name === selectedAssetType)
    : []

  const handleAssetTypeClick = (assetTypeName: string) => {
    setSelectedAssetType(assetTypeName)
    setShowAssetModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-8">
        <PageHeader
          title="Reservation Management"
          description="Manage all equipment reservations"
          action={
            <Button onClick={() => setShowReservationModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Reservation
            </Button>
          }
        />

        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by reservation ID, requester, or equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Reserved Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReservations.length === 0 ? (
              <EmptyState
                icon={<Calendar className="h-12 w-12" />}
                title="No reservations found"
                description="Try adjusting your search or create a new reservation."
                action={{
                  label: "Create Reservation",
                  onClick: () => setShowReservationModal(true),
                }}
              />
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Asset ID</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Summary</TableHead>
                      <TableHead className="font-semibold">Assigned Date</TableHead>
                      <TableHead className="font-semibold">Return Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Approver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow
                        key={reservation.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => (window.location.href = `/reservations/${reservation.id}`)}
                      >
                        <TableCell className="font-mono font-medium">#{reservation.id.slice(0, 8)}</TableCell>
                        <TableCell>{reservation.items.map((item) => item.assetTypeName).join(", ")}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {reservation.items.map((item) => `${item.quantity}x ${item.assetTypeName}`).join(", ")}
                        </TableCell>
                        <TableCell>{formatDate(reservation.requestDate)}</TableCell>
                        <TableCell>{formatDate(reservation.returnDate)}</TableCell>
                        <TableCell>
                          <StatusBadge status={reservation.status} type="reservation" />
                        </TableCell>
                        <TableCell>{reservation.requester?.name || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Available Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockData.equipmentAvailability.map((equipment) => (
                <button
                  key={equipment.assetTypeId}
                  onClick={() => handleAssetTypeClick(equipment.assetTypeName)}
                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{equipment.assetTypeName}</p>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-green-600">{equipment.availableCount}</p>
                    <p className="text-sm text-muted-foreground">/ {equipment.totalCount} available</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Click to view assets</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={showAssetModal} onOpenChange={setShowAssetModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedAssetType} Assets</DialogTitle>
            <DialogDescription>All assets of type {selectedAssetType}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {assetsForType.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No assets found for this type.</p>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Tag</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Assigned To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetsForType.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-mono font-medium">{asset.assetTag}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              asset.status === "available"
                                ? "bg-green-100 text-green-800"
                                : asset.status === "assigned"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {asset.status}
                          </span>
                        </TableCell>
                        <TableCell>{asset.location || "-"}</TableCell>
                        <TableCell>{asset.assignedTo?.name || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CreateReservationModal open={showReservationModal} onOpenChange={setShowReservationModal} />
    </div>
  )
}

export default function DashboardReservationsPage() {
  return (
    <ProtectedRoute roles={["operator", "admin"]}>
      <DashboardReservationsContent />
    </ProtectedRoute>
  )
}
