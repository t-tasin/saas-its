"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
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
import { useToast } from "@/hooks/use-toast"
import { formatDateTime } from "@/lib/utils"
import { ArrowLeft, MessageSquare } from "lucide-react"

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

  const [commentBody, setCommentBody] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [newStatus, setNewStatus] = useState("")

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

  if (ticketLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LoadingSpinner fullScreen />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <PageHeader
          title={`${ticket.number}: ${ticket.title}`}
          description={`Created ${formatDateTime(ticket.createdAt)}`}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Ticket Details</CardTitle>
                  <StatusBadge status={ticket.status} type="ticket" />
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </CardHeader>
              <CardContent className="space-y-0">
                <InfoRow label="Type">{ticket.type}</InfoRow>
                <InfoRow label="Status">{ticket.status.replace("_", " ")}</InfoRow>
                <InfoRow label="Priority">{ticket.priority}</InfoRow>
                {ticket.category && <InfoRow label="Category">{ticket.category.name}</InfoRow>}
                {ticket.subcategory && <InfoRow label="Subcategory">{ticket.subcategory.name}</InfoRow>}
                {ticket.requestedBy && <InfoRow label="Requested By">{ticket.requestedBy}</InfoRow>}
                {ticket.assignedTo && <InfoRow label="Assigned To">{ticket.assignedTo.name}</InfoRow>}
                <InfoRow label="Created">{formatDateTime(ticket.createdAt)}</InfoRow>
                <InfoRow label="Last Updated">{formatDateTime(ticket.updatedAt)}</InfoRow>
                {ticket.description && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-sm mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
                  </div>
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
                        <SelectValue placeholder="Select new status" />
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
                    disabled={!newStatus || updateStatus.isPending}
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
                  <p className="font-mono font-medium">{ticket.number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Current Status</p>
                  <StatusBadge status={ticket.status} type="ticket" />
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Priority Level</p>
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
