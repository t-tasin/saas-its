"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { PriorityBadge } from "@/components/priority-badge"
import { InfoRow } from "@/components/info-row"
import { CommentItem } from "@/components/comment-item"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import {
  useTicket,
  useTicketComments,
  useAddComment,
  useUpdateTicketStatus,
  useCategories,
} from "@/hooks/use-tickets"
import { useUser, useAssignableUsers } from "@/hooks/use-users"
import { useAssets } from "@/hooks/use-assets"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, cn } from "@/lib/utils"
import { ArrowLeft, MessageSquare, Paperclip, Download, UserPlus, Package, Check, ChevronsUpDown, Upload, X, FileIcon } from "lucide-react"
import Link from "next/link"
import { ticketApi } from "@/lib/api-client"
import { TechnicianBadge } from "@/components/technician-badge"
import { toast as hotToast } from "react-hot-toast"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isOperator } = useAuth()
  const { toast } = useToast()

  const ticketId = params.id as string
  const { data: ticket, isLoading: ticketLoading, refetch: refetchTicket } = useTicket(ticketId)
  const { data: comments, isLoading: commentsLoading } = useTicketComments(ticketId)
  const { data: assetsData } = useAssets({ limit: 100 })
  const assets = assetsData?.data || []
  const { data: assignableUsersData } = useAssignableUsers()
  const assignableUsers = assignableUsersData?.data || []
  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.data || []
  const addComment = useAddComment()
  const updateStatus = useUpdateTicketStatus()
  
  // Fetch assigned user details if ticket has assignedTo
  const { data: assignedUser } = useUser(ticket?.data?.assignedTo)

  const [commentBody, setCommentBody] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [showAddTechModal, setShowAddTechModal] = useState(false)
  const [newTechId, setNewTechId] = useState("")
  const [selectedAssetId, setSelectedAssetId] = useState("")
  const [isUpdatingAsset, setIsUpdatingAsset] = useState(false)
  const [assetSearchOpen, setAssetSearchOpen] = useState(false)
  const [newPriority, setNewPriority] = useState("")
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [commentFiles, setCommentFiles] = useState<File[]>([])
  const [isUploadingAttachments, setIsUploadingAttachments] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState("")
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("")
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false)

  // Update newStatus when ticket data loads
  useEffect(() => {
    if (ticket?.data?.status) {
      setNewStatus(ticket.data.status)
    }
  }, [ticket?.data?.status])

  // Initialize selected asset when ticket data loads
  useEffect(() => {
    if (ticket?.data?.assetId) {
      setSelectedAssetId(ticket.data.assetId)
    }
  }, [ticket?.data?.assetId])

  // Initialize priority when ticket data loads
  useEffect(() => {
    if (ticket?.data?.priority) {
      setNewPriority(ticket.data.priority)
    }
  }, [ticket?.data?.priority])

  useEffect(() => {
    if (ticket?.data) {
      const initialCategoryId =
        ticket.data.categoryId ??
        (typeof ticket.data.category === "object" ? ticket.data.category?.id : "") ??
        ""
      const initialSubcategoryId =
        ticket.data.subcategoryId ??
        (typeof ticket.data.subcategory === "object" ? ticket.data.subcategory?.id : "") ??
        ""

      setSelectedCategoryId(initialCategoryId || "")
      setSelectedSubcategoryId(initialSubcategoryId || "")
    }
  }, [
    ticket?.data?.categoryId,
    ticket?.data?.subcategoryId,
    ticket?.data?.category,
    ticket?.data?.subcategory,
  ])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentBody.trim()) return

    try {
      // First upload attachments if any
      if (commentFiles.length > 0) {
        await uploadAttachments(commentFiles)
      }

      // Then add the comment
      await addComment.mutateAsync({
        ticketId,
        body: commentBody,
        authorName: !isAuthenticated ? authorName : undefined,
      })

      setCommentBody("")
      setAuthorName("")
      setCommentFiles([])

      toast({
        title: "Success",
        description: "Comment added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = async () => {
    if (!newStatus) return

    try {
      await updateStatus.mutateAsync({ id: ticketId, status: newStatus })

      toast({
        title: "Success",
        description: "Ticket status updated successfully.",
      })

      setNewStatus("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddTechnician = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTechId) return

    try {
      await ticketApi.post(`/tickets/${ticketId}/assign-technician`, {
        technicianId: newTechId,
      })

      toast({
        title: "Success",
        description: "Technician assigned successfully.",
      })

      setShowAddTechModal(false)
      setNewTechId("")
      
      // Refresh ticket data
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign technician. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateAsset = async () => {
    if (!selectedAssetId || selectedAssetId === "none") {
      // Remove asset association
      setIsUpdatingAsset(true)
      try {
        await ticketApi.patch(`/tickets/${ticketId}`, {
          assetId: null,
        })

        toast({
          title: "Success",
          description: "Asset association removed.",
        })

        // Refresh ticket data
        window.location.reload()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove asset. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUpdatingAsset(false)
      }
      return
    }

    setIsUpdatingAsset(true)
    try {
      await ticketApi.patch(`/tickets/${ticketId}`, {
        assetId: selectedAssetId,
      })

      toast({
        title: "Success",
        description: "Asset association updated successfully.",
      })

      // Refresh ticket data
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update asset. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingAsset(false)
    }
  }

  const handleCategorySelect = (value: string) => {
    if (value === "none") {
      setSelectedCategoryId("")
      setSelectedSubcategoryId("")
      return
    }

    setSelectedCategoryId(value)

    const category = categories.find((cat: any) => cat.id === value)
    if (!category?.subcategories?.some((sub: any) => sub.id === selectedSubcategoryId)) {
      setSelectedSubcategoryId("")
    }
  }

  const handleSubcategorySelect = (value: string) => {
    if (value === "none") {
      setSelectedSubcategoryId("")
      return
    }
    setSelectedSubcategoryId(value)
  }

  const handleUpdateCategory = async () => {
    setIsUpdatingCategory(true)
    try {
      await ticketApi.patch(`/tickets/${ticketId}`, {
        categoryId: selectedCategoryId || null,
        subcategoryId: selectedSubcategoryId || null,
      })
      await refetchTicket()
      toast({
        title: "Success",
        description: "Category updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingCategory(false)
    }
  }

  const handleUpdatePriority = async () => {
    if (!newPriority || newPriority === ticketData.priority) return

    setIsUpdatingPriority(true)
    try {
      await ticketApi.patch(`/tickets/${ticketId}`, {
        priority: newPriority,
      })

      toast({
        title: "Success",
        description: "Ticket priority updated successfully.",
      })

      // Refresh ticket data
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update priority. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingPriority(false)
    }
  }

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (file.size > maxSize) {
      return { valid: false, error: "File size must be less than 10MB" }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "File type not allowed. Only JPG, PNG, GIF, PDF, DOC, DOCX are supported." }
    }

    return { valid: true }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isComment: boolean = false) => {
    const files = Array.from(e.target.files || [])

    for (const file of files) {
      const validation = validateFile(file)
      if (!validation.valid) {
        hotToast.error(validation.error || "Invalid file")
        return
      }
    }

    if (isComment) {
      setCommentFiles((prev) => [...prev, ...files])
    } else {
      setSelectedFiles((prev) => [...prev, ...files])
    }
    e.target.value = "" // Reset input
  }

  const removeFile = (index: number, isComment: boolean = false) => {
    if (isComment) {
      setCommentFiles((prev) => prev.filter((_, i) => i !== index))
    } else {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const uploadAttachments = async (files: File[]) => {
    for (const file of files) {
      try {
        // Get presigned URL
        const urlResponse = await ticketApi.post(`/tickets/${ticketId}/attachments/upload-url`, {
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
        })

        const { uploadUrl, key } = urlResponse.data

        // Upload to S3
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error)
        throw error
      }
    }
  }

  const handleUploadNewAttachments = async () => {
    if (selectedFiles.length === 0) return

    setIsUploadingAttachments(true)
    try {
      await uploadAttachments(selectedFiles)

      toast({
        title: "Success",
        description: `${selectedFiles.length} file(s) uploaded successfully.`,
      })

      setSelectedFiles([])
      // Refresh ticket data
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload attachments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploadingAttachments(false)
    }
  }

  if (ticketLoading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  if (!ticket?.data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
            <p className="text-muted-foreground mb-4">The ticket you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/tickets")}>Back to Tickets</Button>
          </div>
        </div>
      </div>
    )
  }

  const ticketData = ticket.data
  const currentCategoryId =
    ticketData.categoryId ??
    (typeof ticketData.category === "object" ? ticketData.category?.id : "") ??
    ""
  const currentSubcategoryId =
    ticketData.subcategoryId ??
    (typeof ticketData.subcategory === "object" ? ticketData.subcategory?.id : "") ??
    ""

  const selectedCategory = categories.find((cat: any) => cat.id === selectedCategoryId)
  const availableSubcategories = selectedCategory?.subcategories || []
  const hasCategoryChanged =
    (selectedCategoryId || "") !== (currentCategoryId || "") ||
    (selectedSubcategoryId || "") !== (currentSubcategoryId || "")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <PageHeader
          title={`${ticketData.number}: ${ticketData.title}`}
          description={`Created ${formatDateTime(ticketData.createdAt)}`}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Ticket Details</CardTitle>
                  <StatusBadge status={ticketData.status} type="ticket" />
                  <PriorityBadge priority={ticketData.priority} />
                </div>
              </CardHeader>
              <CardContent className="space-y-0">
                <InfoRow label="Type">{ticketData.type || "General"}</InfoRow>
                <InfoRow label="Status">{ticketData.status?.replace(/_/g, " ") || "Unknown"}</InfoRow>
                <InfoRow label="Priority">{ticketData.priority || "Medium"}</InfoRow>
                {ticketData.category && <InfoRow label="Category">{ticketData.category.name}</InfoRow>}
                {ticketData.subcategory && <InfoRow label="Subcategory">{ticketData.subcategory.name}</InfoRow>}
                {ticketData.requestedBy && <InfoRow label="Requested By">{ticketData.requestedBy}</InfoRow>}
                {ticketData.assignedTo && (
                  <InfoRow label="Assigned To">
                    {assignedUser?.data?.name || assignedUser?.data?.email || "Loading..."}
                  </InfoRow>
                )}
                <InfoRow label="Created">{formatDateTime(ticketData.createdAt)}</InfoRow>
                <InfoRow label="Last Updated">{formatDateTime(ticketData.updatedAt)}</InfoRow>
                {isOperator && categories.length > 0 && (
                  <div className="pt-4 border-t mt-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <Label htmlFor="ticket-category-select" className="text-xs font-medium text-muted-foreground">
                          Category
                        </Label>
                        <Select
                          value={selectedCategoryId || "none"}
                          onValueChange={handleCategorySelect}
                        >
                          <SelectTrigger id="ticket-category-select">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No category</SelectItem>
                            {categories.map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="ticket-subcategory-select"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Subcategory
                        </Label>
                        <Select
                          value={selectedSubcategoryId || "none"}
                          onValueChange={handleSubcategorySelect}
                          disabled={availableSubcategories.length === 0 || !selectedCategoryId}
                        >
                          <SelectTrigger id="ticket-subcategory-select">
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No subcategory</SelectItem>
                            {availableSubcategories.map((subcategory: any) => (
                              <SelectItem key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <Button
                        size="sm"
                        onClick={handleUpdateCategory}
                        disabled={!hasCategoryChanged || isUpdatingCategory}
                      >
                        {isUpdatingCategory ? "Saving..." : "Save Category"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCategoryId(currentCategoryId || "")
                          setSelectedSubcategoryId(currentSubcategoryId || "")
                        }}
                        disabled={!hasCategoryChanged || isUpdatingCategory}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
                {ticketData.description && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticketData.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Assigned Technicians */}
            {(ticketData.assignedTechnicians?.length > 0 || isOperator) && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Assigned Technicians</CardTitle>
                    {isOperator && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowAddTechModal(!showAddTechModal)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Technician
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ticketData.assignedTechnicians?.map((techId: string) => (
                    <TechnicianBadge key={techId} userId={techId} />
                  ))}
                  
                  {ticketData.assignedTechnicians?.length === 0 && !showAddTechModal && (
                    <p className="text-sm text-muted-foreground">No additional technicians assigned</p>
                  )}

                  {showAddTechModal && isOperator && (
                    <form onSubmit={handleAddTechnician} className="space-y-3 pt-3 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="techId">Select Technician</Label>
                        <Select value={newTechId} onValueChange={setNewTechId}>
                          <SelectTrigger id="techId">
                            <SelectValue placeholder="Choose an operator or admin" />
                          </SelectTrigger>
                          <SelectContent>
                            {assignableUsers.map((user: any) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name || user.email} ({user.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Only operators and admins can be assigned
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" disabled={!newTechId}>
                          Assign
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowAddTechModal(false)
                            setNewTechId("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Associated Asset */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Associated Asset
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isOperator && (
                  <div className="space-y-2">
                    <Label htmlFor="asset-select">Search & Select Asset</Label>
                    <Popover open={assetSearchOpen} onOpenChange={setAssetSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={assetSearchOpen}
                          className="w-full justify-between"
                        >
                          {selectedAssetId && selectedAssetId !== "none"
                            ? assets.find((asset: any) => asset.id === selectedAssetId)?.name || "Select asset..."
                            : "Select asset..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search assets by name or tag..." />
                          <CommandEmpty>No asset found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            <CommandItem
                              value="none"
                              onSelect={() => {
                                setSelectedAssetId("none")
                                setAssetSearchOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedAssetId === "none" ? "opacity-100" : "opacity-0"
                                )}
                              />
                              No asset
                            </CommandItem>
                            {assets.map((asset: any) => (
                              <CommandItem
                                key={asset.id}
                                value={`${asset.name} ${asset.serialNumber || ""} ${asset.type || ""}`}
                                onSelect={() => {
                                  setSelectedAssetId(asset.id)
                                  setAssetSearchOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedAssetId === asset.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">{asset.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {asset.type} {asset.serialNumber ? `• ${asset.serialNumber}` : ""}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-muted-foreground">
                      Search by asset name, serial number, or type
                    </p>
                    {selectedAssetId && selectedAssetId !== "none" && selectedAssetId !== ticketData.assetId && (
                      <Button
                        onClick={handleUpdateAsset}
                        disabled={isUpdatingAsset}
                        className="w-full"
                      >
                        {isUpdatingAsset ? "Updating..." : "Update Asset"}
                      </Button>
                    )}
                    {selectedAssetId === "none" && ticketData.assetId && (
                      <Button
                        onClick={handleUpdateAsset}
                        disabled={isUpdatingAsset}
                        variant="destructive"
                        className="w-full"
                      >
                        {isUpdatingAsset ? "Removing..." : "Remove Asset Association"}
                      </Button>
                    )}
                  </div>
                )}
                {ticketData.assetId && (
                  <Link href={`/dashboard/assets/${ticketData.assetId}`}>
                    <Button variant="outline" className="w-full">
                      View Asset Details →
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* Attachments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5" />
                  Attachments ({ticketData.attachments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Attachments */}
                {ticketData.attachments && ticketData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Existing Files</Label>
                    {ticketData.attachments.map((attachment: any) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Paperclip className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {(attachment.fileSize / 1024).toFixed(1)} KB • {attachment.mimeType}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              const { ticketApi } = await import("@/lib/api-client")
                              const response = await ticketApi.get(`/tickets/${ticketData.id}/attachments/${attachment.id}/download-url`)
                              window.open(response.data.downloadUrl, "_blank")
                            } catch (error) {
                              console.error("Failed to get download URL:", error)
                            }
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload New Attachments (Operators only) */}
                {isOperator && (
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="new-attachments">Add New Attachments</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="new-attachments"
                        type="file"
                        onChange={(e) => handleFileChange(e, false)}
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                        multiple
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("new-attachments")?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Files
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Max 10MB per file. Supported: JPG, PNG, GIF, PDF, DOC, DOCX
                    </p>

                    {selectedFiles.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="text-sm truncate">{file.name}</span>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {formatFileSize(file.size)}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index, false)}
                              className="flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          onClick={handleUploadNewAttachments}
                          disabled={isUploadingAttachments}
                          className="w-full"
                        >
                          {isUploadingAttachments ? "Uploading..." : `Upload ${selectedFiles.length} File(s)`}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {!ticketData.attachments?.length && !isOperator && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No attachments yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({comments?.data?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {commentsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : comments?.data?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {comments?.data?.map((comment: any) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                )}

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="comment">Add a Comment</Label>
                    <Textarea
                      id="comment"
                      placeholder="Write your comment here..."
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  {!isAuthenticated && (
                    <div className="space-y-2">
                      <Label htmlFor="authorName">Your Name</Label>
                      <Input
                        id="authorName"
                        placeholder="Enter your name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Comment Attachments (Optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="comment-attachments">Attachments (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="comment-attachments"
                        type="file"
                        onChange={(e) => handleFileChange(e, true)}
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                        multiple
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("comment-attachments")?.click()}
                      >
                        <Paperclip className="mr-2 h-4 w-4" />
                        Attach Files
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Max 10MB per file. Supported: JPG, PNG, GIF, PDF, DOC, DOCX
                    </p>

                    {commentFiles.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {commentFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileIcon className="h-4 w-4 flex-shrink-0" />
                              <span className="text-sm truncate">{file.name}</span>
                              <span className="text-xs text-muted-foreground flex-shrink-0">
                                {formatFileSize(file.size)}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index, true)}
                              className="flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={addComment.isPending}>
                    {addComment.isPending ? "Adding..." : "Add Comment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Operator Actions */}
            {isOperator && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Update Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue>
                          {newStatus ? newStatus.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Select status"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={!newStatus || updateStatus.isPending || newStatus === ticket?.data?.status}
                    className="w-full"
                  >
                    {updateStatus.isPending ? "Updating..." : "Update Status"}
                  </Button>

                  <div className="space-y-2 pt-2 border-t">
                    <Label htmlFor="priority">Update Priority</Label>
                    <Select value={newPriority} onValueChange={setNewPriority}>
                      <SelectTrigger>
                        <SelectValue>
                          {newPriority ? newPriority.charAt(0).toUpperCase() + newPriority.slice(1) : "Select priority"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleUpdatePriority}
                    disabled={!newPriority || isUpdatingPriority || newPriority === ticketData.priority}
                    className="w-full"
                  >
                    {isUpdatingPriority ? "Updating..." : "Update Priority"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Ticket Number</p>
                  <p className="font-mono font-medium">{ticketData.number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Current Status</p>
                  <StatusBadge status={ticketData.status} type="ticket" />
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Priority Level</p>
                  <PriorityBadge priority={ticketData.priority} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
