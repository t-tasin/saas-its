"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTicket } from "@/hooks/use-tickets"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, Upload, X, FileIcon, CheckCircle2 } from "lucide-react"
import { toast } from "react-hot-toast"

interface CreateTicketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTicketModal({ open, onOpenChange }: CreateTicketModalProps) {
  const { user } = useAuth()
  const createTicket = useCreateTicket()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: user?.email || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

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
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx"]

    if (file.size > maxSize) {
      return { valid: false, error: "File size must be less than 10MB" }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "File type not allowed. Only JPG, PNG, GIF, PDF, DOC, DOCX are supported." }
    }

    const extension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!allowedExtensions.includes(extension)) {
      return { valid: false, error: "File extension not allowed" }
    }

    return { valid: true }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    for (const file of files) {
      const validation = validateFile(file)
      if (!validation.valid) {
        toast.error(validation.error || "Invalid file")
        return
      }
    }

    setSelectedFiles((prev) => [...prev, ...files])
    e.target.value = "" // Reset input
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.title.length < 3 || formData.title.length > 200) {
      toast.error("Title must be 3-200 characters")
      return
    }

    if (formData.description.length < 10 || formData.description.length > 2000) {
      toast.error("Description must be 10-2000 characters")
      return
    }

    setIsSubmitting(true)
    setIsSuccess(false)

    try {
      await createTicket.mutateAsync({
        title: formData.title,
        description: formData.description,
        requestedBy: formData.email,
        status: "open",
        priority: "medium",
        attachments: selectedFiles, // Pass files to mutation
      })

      setIsSuccess(true)
      // Toast is shown by the mutation hook

      setTimeout(() => {
        setFormData({ title: "", description: "", email: user?.email || "" })
        setSelectedFiles([])
        setIsSuccess(false)
        onOpenChange(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to create ticket:", error)
      // Toast error is shown by the mutation hook
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
          <DialogDescription>
            Submit a new support ticket. Provide a clear title and detailed description of your issue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
              minLength={3}
              maxLength={200}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed information about your issue"
              minLength={10}
              maxLength={2000}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachments"
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                multiple
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("attachments")?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Files
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Max 10MB per file. Supported: JPG, PNG, GIF, PDF, DOC, DOCX</p>

            {selectedFiles.length > 0 && (
              <div className="space-y-2 mt-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{formatFileSize(file.size)}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isSuccess}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSuccess && <CheckCircle2 className="mr-2 h-4 w-4" />}
              {isSuccess ? "Submitted!" : isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
