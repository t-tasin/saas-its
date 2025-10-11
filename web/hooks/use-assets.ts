import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { assetApi } from "@/lib/api-client"
import type { CreateAssetData } from "@/types"
import toast from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context"

const transformAssetStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    AVAILABLE: "available",
    IN_USE: "assigned",
    MAINTENANCE: "maintenance",
    RETIRED: "retired",
  }
  return statusMap[status] || status.toLowerCase()
}

const transformAssetStatusToBackend = (status: string): string => {
  const statusMap: Record<string, string> = {
    available: "AVAILABLE",
    assigned: "IN_USE",
    maintenance: "MAINTENANCE",
    retired: "RETIRED",
  }
  return statusMap[status] || status.toUpperCase()
}

const transformAssetType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

export function useAssets(params?: any) {
  const { isAuthenticated, loading, token } = useAuth()
  
  return useQuery({
    queryKey: ["assets", params],
    queryFn: async () => {
      try {
        const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
        if (!authToken) {
          return { data: [], total: 0 }
        }

        const response = await assetApi.get("/assets", { params })
        
        // Backend returns { items: [], nextCursor: string }
        const assets = response.data.items || response.data.data || []

        const transformedData = assets.map((asset: any) => ({
          ...asset,
          status: transformAssetStatus(asset.status),
          type: transformAssetType(asset.assetType || asset.type),
          assetType: {
            id: (asset.assetType || asset.type || 'other').toLowerCase(),
            name: transformAssetType(asset.assetType || asset.type),
          },
        }))

        return {
          data: transformedData,
          total: assets.length,
        }
      } catch (error: any) {
        console.error("Failed to load assets:", error)
        throw error
      }
    },
    enabled: !loading && isAuthenticated && !!token,
    retry: false,
    staleTime: 30000,
  })
}

export function useAsset(id: string) {
  const { isAuthenticated, loading, token } = useAuth()
  
  return useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      try {
        const authToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
        if (!authToken) {
          throw new Error("No auth token available")
        }

        const response = await assetApi.get(`/${id}`)

        const asset = response.data
        return {
          data: {
            ...asset,
            status: transformAssetStatus(asset.status),
            type: asset.type, // Use type directly, not assetType
          },
        }
      } catch (error: any) {
        console.error("Failed to load asset:", error)
        toast.error(error.message || "Failed to load asset")
        throw error
      }
    },
    enabled: !!id && !loading && isAuthenticated && !!token,
    retry: false,
  })
}

export function useCreateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAssetData) => {
      try {
        // Backend requires: assetId, type, description, fundingDepartment as mandatory
        const backendData = {
          assetId: data.assetId || data.serialNumber || `ASSET-${Date.now()}`,
          type: data.type || "Laptop",
          description: data.description || `${data.type} - ${data.model || "Unknown Model"}`,
          fundingDepartment: data.fundingDepartment || "IT Department",
          // Optional fields
          manufacturer: data.brand || data.manufacturer,
          model: data.model,
          serialNumber: data.serialNumber,
          receivedDate: data.purchaseDate || data.receivedDate,
          cost: data.cost,
          // Additional optional fields
          memory: data.memory,
          hddSize: data.hddSize,
          location: data.location,
          status: data.status ? transformAssetStatusToBackend(data.status) : undefined,
        }

        const response = await assetApi.post("/assets", backendData)
        toast.success("Asset created successfully")
        return response.data
      } catch (error: any) {
        toast.error(error.message || "Failed to create asset")
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] })
    },
  })
}

export function useUpdateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAssetData> }) => {
      try {
        // Transform frontend data to backend format
        const backendData: any = {}
        
        if (data.assetId) backendData.assetId = data.assetId
        if (data.type) backendData.type = data.type
        if (data.description) backendData.description = data.description
        if (data.fundingDepartment) backendData.fundingDepartment = data.fundingDepartment
        if (data.manufacturer) backendData.manufacturer = data.manufacturer
        if (data.model) backendData.model = data.model
        if (data.modelGeneration) backendData.modelGeneration = data.modelGeneration
        if (data.serialNumber) backendData.serialNumber = data.serialNumber
        if (data.vendor) backendData.vendor = data.vendor
        if (data.memory) backendData.memory = data.memory
        if (data.hddSize) backendData.hddSize = data.hddSize
        if (data.hddType) backendData.hddType = data.hddType
        if (data.cpuGeneration) backendData.cpuGeneration = data.cpuGeneration
        if (data.cpuSpeed) backendData.cpuSpeed = data.cpuSpeed
        if (data.gpuModel) backendData.gpuModel = data.gpuModel
        if (data.videoCard) backendData.videoCard = data.videoCard
        if (data.wiredMac) backendData.wiredMac = data.wiredMac
        if (data.wirelessMac) backendData.wirelessMac = data.wirelessMac
        if (data.output1) backendData.output1 = data.output1
        if (data.output2) backendData.output2 = data.output2
        if (data.receivedDate) backendData.receivedDate = data.receivedDate
        if (data.cost !== undefined) backendData.cost = data.cost
        if (data.po) backendData.po = data.po
        if (data.disposalDate) backendData.disposalDate = data.disposalDate
        if (data.disposalType) backendData.disposalType = data.disposalType
        if (data.location) backendData.location = data.location
        if (data.status) backendData.status = transformAssetStatusToBackend(data.status)

        const response = await assetApi.patch(`/${id}`, backendData)
        toast.success("Asset updated successfully")
        return response.data
      } catch (error: any) {
        toast.error(error.message || "Failed to update asset")
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["asset", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["assets"] })
    },
  })
}

export function useAssignAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, personId }: { id: string; personId: string }) => {
      try {
        // Backend expects "personId" field
        const response = await assetApi.post(`/${id}/assign`, {
          personId: personId,
        })
        toast.success("Asset assigned successfully")
        return response.data
      } catch (error: any) {
        toast.error(error.message || "Failed to assign asset")
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["asset", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["assets"] })
    },
  })
}

export function useUnassignAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // Use the dedicated unassign endpoint
        const response = await assetApi.post(`/${id}/unassign`, {})
        toast.success("Asset unassigned successfully")
        return response.data
      } catch (error: any) {
        toast.error(error.message || "Failed to unassign asset")
        throw error
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["asset", id] })
      queryClient.invalidateQueries({ queryKey: ["assets"] })
    },
  })
}

export function useAssetTypes() {
  return useQuery({
    queryKey: ["asset-types"],
    queryFn: async () => {
      const types = ["LAPTOP", "DESKTOP", "MONITOR", "PHONE", "TABLET", "OTHER"]
      return {
        data: types.map((type) => ({
          id: type.toLowerCase(),
          name: transformAssetType(type),
        })),
      }
    },
  })
}

export function useAssetAnalytics() {
  const { isAuthenticated, loading } = useAuth()
  
  return useQuery({
    queryKey: ["analytics", "assets"],
    queryFn: async () => {
      try {
        const response = await assetApi.get("/assets", {
          params: { limit: 1000 },
        })

        const assets = response.data.data
        const byType: Record<string, number> = {}

        assets.forEach((asset: any) => {
          const type = transformAssetType(asset.assetType)
          byType[type] = (byType[type] || 0) + 1
        })

        return {
          data: {
            total: assets.length,
            available: assets.filter((a: any) => a.status === "AVAILABLE").length,
            assigned: assets.filter((a: any) => a.status === "IN_USE").length,
            maintenance: assets.filter((a: any) => a.status === "MAINTENANCE").length,
            byType,
          },
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load asset analytics")
        throw error
      }
    },
    enabled: !loading && isAuthenticated,
  })
}
