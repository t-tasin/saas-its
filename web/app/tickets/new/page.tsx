"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useCreateTicket, useCategories, useSubcategories } from "@/hooks/use-tickets"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function NewTicketPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"incident" | "request">("incident")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium")
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryId, setSubcategoryId] = useState("")
  const [requestedBy, setRequestedBy] = useState("")

  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: subcategories, isLoading: subcategoriesLoading } = useSubcategories(categoryId)
  const createTicket = useCreateTicket()

  // Reset subcategory when category changes
  useEffect(() => {
    setSubcategoryId("")
  }, [categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const ticketData: any = {
        title,
        description: description || undefined,
        type,
        priority,
        categoryId: categoryId || undefined,
        subcategoryId: subcategoryId || undefined,
      }

      // Add requestedBy if user is not authenticated
      if (!isAuthenticated && requestedBy) {
        ticketData.requestedBy = requestedBy
      }

      const result = await createTicket.mutateAsync(ticketData)

      toast({
        title: "Success",
        description: `Ticket ${result.number} has been created successfully.`,
      })

      router.push(`/tickets/${result.id}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create ticket. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <PageHeader title="Create New Ticket" description="Submit a support request or report an issue" />

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>Provide information about your request or issue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{title.length}/200 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about your request..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground">{description.length}/2000 characters</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={type} onValueChange={(value: any) => setType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incident">Incident</SelectItem>
                        <SelectItem value="request">Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center h-10">
                        <LoadingSpinner size="sm" />
                      </div>
                    ) : (
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.data?.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    {subcategoriesLoading ? (
                      <div className="flex items-center justify-center h-10">
                        <LoadingSpinner size="sm" />
                      </div>
                    ) : (
                      <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={!categoryId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {subcategories?.data?.map((subcategory: any) => (
                            <SelectItem key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                {!isAuthenticated && (
                  <div className="space-y-2">
                    <Label htmlFor="requestedBy">Your Name or Email</Label>
                    <Input
                      id="requestedBy"
                      placeholder="How should we contact you?"
                      value={requestedBy}
                      onChange={(e) => setRequestedBy(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional: Provide your contact information so we can follow up
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={createTicket.isPending} className="flex-1">
                    {createTicket.isPending ? "Creating..." : "Create Ticket"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
