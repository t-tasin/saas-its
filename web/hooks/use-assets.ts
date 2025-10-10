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

        const response = await assetApi.get(`/assets/${id}`)

        const asset = response.data
        return {
          data: {
            ...asset,
            status: transformAssetStatus(asset.status),
            type: transformAssetType(asset.assetType),
            assetType: {
              id: asset.assetType.toLowerCase(),
              name: transformAssetType(asset.assetType),
            },
          },
        }
      } catch (error: any) {
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
        const backendData = {
          serialNumber: data.serialNumber,
          assetType: data.type?.toUpperCase() || "OTHER",
          brand: data.brand,
          model: data.model,
          purchaseDate: data.purchaseDate,
          warrantyExpiry: data.warrantyExpiry || undefined,
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

export function useAssignAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, personId }: { id: string; personId: string }) => {
      try {
        const response = await assetApi.post(`/assets/${id}/assign`, {
          userId: personId,
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
        const response = await assetApi.patch(`/assets/${id}`, {
          status: "AVAILABLE",
          assignedToId: null,
        })
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
