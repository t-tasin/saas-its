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
import { useAuth } from "@/contexts/auth-context"
import { useTicket, useTicketComments, useAddComment, useUpdateTicketStatus } from "@/hooks/use-tickets"
import { useUser } from "@/hooks/use-users"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import { ArrowLeft, MessageSquare, Paperclip, Download, UserPlus, Package } from "lucide-react"
import Link from "next/link"
import { ticketApi } from "@/lib/api-client"
import { TechnicianBadge } from "@/components/technician-badge"

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isOperator } = useAuth()
  const { toast } = useToast()

  const ticketId = params.id as string
  const { data: ticket, isLoading: ticketLoading } = useTicket(ticketId)
  const { data: comments, isLoading: commentsLoading } = useTicketComments(ticketId)
  const addComment = useAddComment()
  const updateStatus = useUpdateTicketStatus()
  
  // Fetch assigned user details if ticket has assignedTo
  const { data: assignedUser } = useUser(ticket?.data?.assignedTo)

  const [commentBody, setCommentBody] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [showAddTechModal, setShowAddTechModal] = useState(false)
  const [newTechId, setNewTechId] = useState("")

  // Update newStatus when ticket data loads
  useEffect(() => {
    if (ticket?.data?.status) {
      setNewStatus(ticket.data.status)
    }
  }, [ticket?.data?.status])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentBody.trim()) return

    try {
      await addComment.mutateAsync({
        ticketId,
        body: commentBody,
        authorName: !isAuthenticated ? authorName : undefined,
      })

      setCommentBody("")
      setAuthorName("")

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
                        <Label htmlFor="techId">Technician User ID</Label>
                        <Input
                          id="techId"
                          value={newTechId}
                          onChange={(e) => setNewTechId(e.target.value)}
                          placeholder="Enter technician user ID"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">Assign</Button>
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
            {ticketData.assetId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Associated Asset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/dashboard/assets/${ticketData.assetId}`}>
                    <Button variant="outline" className="w-full">
                      View Asset Details →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {ticketData.attachments && ticketData.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    Attachments ({ticketData.attachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
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
                </CardContent>
              </Card>
            )}

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
                    <Label htmlFor="status">Current Status</Label>
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
