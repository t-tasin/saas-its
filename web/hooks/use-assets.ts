import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { assetApi } from "@/lib/api"
import type { CreateAssetData } from "@/types"

export function useAssets(params?: any) {
  return useQuery({
    queryKey: ["assets", params],
    queryFn: async () => {
      const response = await assetApi.list(params)
      return response.data
    },
  })
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ["asset", id],
    queryFn: async () => {
      const response = await assetApi.get(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateAsset() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateAssetData) => {
      const response = await assetApi.create(data)
      return response.data
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
      const response = await assetApi.assign(id, personId)
      return response.data
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
      const response = await assetApi.unassign(id)
      return response.data
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
      const response = await assetApi.getTypes()
      return response.data
    },
  })
}

export function useAssetAnalytics() {
  return useQuery({
    queryKey: ["analytics", "assets"],
    queryFn: async () => {
      const response = await assetApi.getAnalytics()
      return response.data
    },
  })
}
