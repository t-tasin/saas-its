"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Calendar, Package, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { EmptyState } from "@/components/empty-state"
import { ProtectedRoute } from "@/components/protected-route"
import { CreateReservationModal } from "@/components/create-reservation-modal"
import { useReservations } from "@/hooks/use-reservations"
import { useAssets } from "@/hooks/use-assets"
import { useRouter } from "next/navigation"

function DashboardReservationsContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null)
  const [showAssetModal, setShowAssetModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [status, setStatus] = useState<string>("all")
  const [showCompleted, setShowCompleted] = useState(false)

  // Build query params
  const params: any = { limit: 50 }
  if (status !== "all") params.status = status
  if (!showCompleted) {
    // Exclude completed/returned/denied reservations by default
    params.excludeStatuses = ["completed", "returned", "denied"]
  }

  // Fetch real data from backend
  const { data: reservationsResponse, isLoading: reservationsLoading } = useReservations(params)
  const { data: assetsResponse, isLoading: assetsLoading } = useAssets()

  const reservations = reservationsResponse?.data || []
  const assets = assetsResponse?.data || []

  const assetTypeNameFor = (asset: any) => {
    if (asset?.assetType && typeof asset.assetType === "object" && asset.assetType.name) {
      return asset.assetType.name
    }
    return asset?.type || "Unknown"
  }

  // Calculate availability by category
  const availabilityByType = useMemo(() => {
    const typeMap = new Map<string, { total: number; available: number }>()

    assets.forEach((asset) => {
      const type = assetTypeNameFor(asset)
      const current = typeMap.get(type) || { total: 0, available: 0 }
      
      typeMap.set(type, {
        total: current.total + 1,
        available: current.available + (asset.status === "available" ? 1 : 0),
      })
    })

    return Array.from(typeMap.entries()).map(([type, data]) => ({
      type,
      ...data,
    }))
  }, [assets])

  const filteredReservations = reservations.filter((reservation) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      reservation.reservationNumber?.toLowerCase().includes(query) ||
      reservation.requesterName?.toLowerCase().includes(query) ||
      reservation.requesterEmail?.toLowerCase().includes(query) ||
      reservation.equipmentType?.toLowerCase().includes(query)
    )
  })

  const assetsForType = selectedAssetType
    ? assets.filter((asset) => assetTypeNameFor(asset) === selectedAssetType)
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

        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-completed" 
              checked={showCompleted} 
              onCheckedChange={(checked) => setShowCompleted(checked as boolean)}
            />
            <label
              htmlFor="show-completed"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show completed/returned/denied reservations
            </label>
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
            {reservationsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">Loading reservations...</span>
              </div>
            ) : filteredReservations.length === 0 ? (
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
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold w-[140px]">Reservation #</TableHead>
                      <TableHead className="font-semibold w-[120px]">Equipment</TableHead>
                      <TableHead className="font-semibold w-[80px]">Qty</TableHead>
                      <TableHead className="font-semibold w-[120px]">Request Date</TableHead>
                      <TableHead className="font-semibold w-[120px]">Return Date</TableHead>
                      <TableHead className="font-semibold w-[100px]">Status</TableHead>
                      <TableHead className="font-semibold w-[140px]">Requester</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow
                        key={reservation.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => router.push(`/reservations/${reservation.id}`)}
                      >
                        <TableCell className="font-mono font-medium">{reservation.reservationNumber}</TableCell>
                        <TableCell>{reservation.equipmentType}</TableCell>
                        <TableCell>{reservation.quantity}</TableCell>
                        <TableCell>{formatDate(reservation.requestDate)}</TableCell>
                        <TableCell>{formatDate(reservation.returnDate)}</TableCell>
                        <TableCell>
                          <StatusBadge status={reservation.status} type="reservation" />
                        </TableCell>
                        <TableCell className="text-sm">{reservation.requesterName || reservation.requesterEmail || "-"}</TableCell>
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
            {assetsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">Loading equipment...</span>
              </div>
            ) : availabilityByType.length === 0 ? (
              <EmptyState
                icon={<Package className="h-12 w-12" />}
                title="No equipment available"
                description="Add assets to see equipment availability."
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availabilityByType.map((equipment) => (
                  <button
                    key={equipment.type}
                    onClick={() => handleAssetTypeClick(equipment.type)}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{equipment.type}</p>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-green-600">{equipment.available}</p>
                      <p className="text-sm text-muted-foreground">/ {equipment.total} available</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Click to view assets</p>
                  </button>
                ))}
              </div>
            )}
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
                        <TableCell className="font-mono font-medium">{asset.assetId || asset.id.slice(0, 8)}</TableCell>
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
                            {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{asset.location || "-"}</TableCell>
                        <TableCell>
                          {asset.assignedToId ? (
                            <span className="text-sm">Assigned</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Available</span>
                          )}
                        </TableCell>
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
