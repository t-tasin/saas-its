"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoRow } from "@/components/info-row"
import { PageHeader } from "@/components/page-header"
import { ProtectedRoute } from "@/components/protected-route"
import { ArrowLeft, Edit, Package } from "lucide-react"
import { useAsset } from "@/hooks/use-assets"
import { useUser } from "@/hooks/use-users"

function AssetDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: assetResponse, isLoading } = useAsset(id)
  const asset = assetResponse?.data

  const { data: assignedUser } = useUser(asset?.assignedToId)

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
              <Button>
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

          {/* Assignment Information */}
          {asset.assignedToId && (
            <Card>
              <CardHeader>
                <CardTitle>Assignment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                <InfoRow label="Assigned To">
                  {assignedUser?.data?.name || assignedUser?.data?.email || "Loading..."}
                </InfoRow>
                {asset.assignedDate && (
                  <InfoRow label="Assigned Date">
                    {new Date(asset.assignedDate).toLocaleDateString()}
                  </InfoRow>
                )}
              </CardContent>
            </Card>
          )}

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

