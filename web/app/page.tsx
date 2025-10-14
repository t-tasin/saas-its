"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Ticket, Calendar, Package, Headset, ArrowRight, Sparkles, Loader2, CheckCircle2 } from "lucide-react"
import { CreateTicketModal } from "@/components/create-ticket-modal"
import { CreateReservationModal } from "@/components/create-reservation-modal"
import { WeekAvailabilityPicker } from "@/components/week-availability-picker"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"

export default function HomePage() {
  const { user } = useAuth()
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  
  // NL Ticket Creation State
  const [nlText, setNlText] = useState("")
  const [nlName, setNlName] = useState("")
  const [nlEmail, setNlEmail] = useState("")
  const [nlLoading, setNlLoading] = useState(false)
  const [nlSuccess, setNlSuccess] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [showAvailabilityPicker, setShowAvailabilityPicker] = useState(false)
  const [correlationId, setCorrelationId] = useState<string | null>(null)
  const [weekAvailabilitySpec, setWeekAvailabilitySpec] = useState<any>(null)

  // Email validation function (RFC 5322 compliant)
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    return emailRegex.test(email)
  }

  // Handle email input with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setNlEmail(email)
    
    if (email.trim() === "") {
      setEmailError("")
    } else if (!validateEmail(email.trim())) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const handleNLSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!nlText.trim()) {
      toast.error("Please describe your issue")
      return
    }

    if (!nlName.trim()) {
      toast.error("Please provide your name")
      return
    }

    const trimmedEmail = nlEmail.trim()
    if (!trimmedEmail) {
      toast.error("Please provide your email")
      return
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error("Please provide a valid email address")
      return
    }

    setNlLoading(true)
    setNlSuccess(false)

    try {
      const nlGatewayUrl = process.env.NEXT_PUBLIC_NL_GATEWAY_API || "https://nl-gateway-production.up.railway.app"
      
      // Step 1: Analyze the ticket
      const response = await fetch(`${nlGatewayUrl}/nl/tickets/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: nlText,
          fallback: {
            name: nlName.trim(),
            email: trimmedEmail,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to analyze ticket" }))
        throw new Error(error.error || error.message || "Failed to analyze ticket")
      }

      const analyzeResult = await response.json()
      
      // Check if we need to ask for availability
      if (analyzeResult.needsFollowup && analyzeResult.followupKind === "availability_week") {
        // Hardware issue - show availability picker
        setCorrelationId(analyzeResult.correlationId)
        setWeekAvailabilitySpec(analyzeResult.weekAvailabilitySpec)
        setShowAvailabilityPicker(true)
        setNlLoading(false)
        toast.success(analyzeResult.followupQuestion || "Please select your availability for the appointment")
      } else {
        // Non-hardware issue or has availability - finalize immediately
        await finalizeTicket(analyzeResult.correlationId, [])
      }
    } catch (error: any) {
      console.error("Failed to create ticket:", error)
      toast.error(error.message || "Failed to create ticket. Please try again.")
      setNlLoading(false)
    }
  }

  const finalizeTicket = async (corrId: string, availability: any[]) => {
    try {
      const nlGatewayUrl = process.env.NEXT_PUBLIC_NL_GATEWAY_API || "https://nl-gateway-production.up.railway.app"
      
      const response = await fetch(`${nlGatewayUrl}/nl/tickets/finalize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correlationId: corrId,
          availability,
          fallback: {
            name: nlName.trim(),
            email: nlEmail.trim(),
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Failed to create ticket" }))
        throw new Error(error.error || error.message || "Failed to create ticket")
      }

      const result = await response.json()
      
      setNlSuccess(true)
      
      if (result.appointment) {
        toast.success(
          `Ticket created! Appointment scheduled for ${new Date(result.appointment.start).toLocaleString()}`,
          { duration: 6000 }
        )
      } else {
        toast.success(`Ticket created successfully! Ticket #${result.ticket.number || result.ticket.id}`)
      }
      
      // Reset form
      setNlText("")
      setNlName("")
      setNlEmail("")
      setEmailError("")
      setShowAvailabilityPicker(false)
      setCorrelationId(null)
      setWeekAvailabilitySpec(null)
      
      // Reset success message after 5 seconds
      setTimeout(() => setNlSuccess(false), 5000)
    } catch (error: any) {
      console.error("Failed to finalize ticket:", error)
      toast.error(error.message || "Failed to finalize ticket. Please try again.")
    } finally {
      setNlLoading(false)
    }
  }

  const handleAvailabilitySubmit = async (windows: any[]) => {
    if (!correlationId) return
    
    setNlLoading(true)
    await finalizeTicket(correlationId, windows)
  }

  const handleAvailabilityCancel = () => {
    setShowAvailabilityPicker(false)
    setCorrelationId(null)
    setWeekAvailabilitySpec(null)
    setNlLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">IT Helpdesk & Asset Management</h1>
          <p className="text-xl text-muted-foreground text-balance">
            Get help quickly with our ticketing system or reserve equipment for your projects. Simple, fast, and
            efficient.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => setShowTicketModal(true)}>
              <Ticket className="mr-2 h-5 w-5" />
              Submit a Ticket
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={() => setShowReservationModal(true)}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Request Equipment
            </Button>
          </div>
        </div>
      </section>

      {/* AI-Powered Quick Ticket Creation */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl">Describe Your Issue in Plain English</CardTitle>
              <CardDescription className="text-base">
                Our AI will understand your problem and create a ticket automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNLSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nl-description" className="text-base">
                    What do you need help with?
                  </Label>
                  <Textarea
                    id="nl-description"
                    placeholder="Example: My laptop keeps overheating during Zoom meetings. It gets very hot and the fans are loud. I need this fixed urgently as I have important client calls this week."
                    value={nlText}
                    onChange={(e) => setNlText(e.target.value)}
                    className="min-h-[120px] text-base"
                    disabled={nlLoading || nlSuccess}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Be specific about the problem, when it happens, and how urgent it is
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="nl-name">Your Name *</Label>
                    <Input
                      id="nl-name"
                      type="text"
                      placeholder="John Doe"
                      value={nlName}
                      onChange={(e) => setNlName(e.target.value)}
                      disabled={nlLoading || nlSuccess || showAvailabilityPicker}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nl-email">Your Email *</Label>
                    <Input
                      id="nl-email"
                      type="email"
                      placeholder="john@example.com"
                      value={nlEmail}
                      onChange={handleEmailChange}
                      disabled={nlLoading || nlSuccess || showAvailabilityPicker}
                      required
                      className={emailError ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {emailError && (
                      <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>
                    )}
                    {nlEmail.trim() && !emailError && (
                      <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Valid email
                      </p>
                    )}
                  </div>
                </div>

                {/* Show availability picker if hardware issue detected */}
                {showAvailabilityPicker && weekAvailabilitySpec && (
                  <div className="mt-4">
                    <WeekAvailabilityPicker
                      spec={weekAvailabilitySpec}
                      onSubmit={handleAvailabilitySubmit}
                      onCancel={handleAvailabilityCancel}
                    />
                  </div>
                )}

                {nlSuccess && (
                  <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Ticket created successfully! We'll get back to you soon.
                    </p>
                  </div>
                )}

                {/* Only show submit button if not showing availability picker */}
                {!showAvailabilityPicker && (
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={nlLoading || nlSuccess || !nlText.trim() || !nlName.trim() || !nlEmail.trim() || !!emailError}
                  >
                    {nlLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : nlSuccess ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Ticket Created!
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Create Ticket with AI
                      </>
                    )}
                  </Button>
                )}

                <p className="text-center text-xs text-muted-foreground">
                  Or use the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(true)}
                    className="text-primary hover:underline"
                  >
                    traditional form
                  </button>{" "}
                  for more control
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                  <Headset className="h-6 w-6" />
                </div>
                <CardTitle>IT Support Tickets</CardTitle>
                <CardDescription>
                  Submit support requests for technical issues, software problems, or general IT assistance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  className="w-full justify-between bg-transparent"
                  onClick={() => setShowTicketModal(true)}
                >
                  Create Ticket
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <CardTitle>Equipment Reservations</CardTitle>
                <CardDescription>
                  Reserve laptops, monitors, projectors, and other equipment for your work or events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  className="w-full justify-between bg-transparent"
                  onClick={() => setShowReservationModal(true)}
                >
                  Reserve Equipment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle>Track Your Requests</CardTitle>
                <CardDescription>
                  View the status of your tickets and reservations in real-time with our tracking system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tickets">
                  <Button variant="ghost" className="w-full justify-between bg-transparent">
                    View All Tickets
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Already Have an Account?</h2>
          <p className="text-lg text-muted-foreground">
            Log in to your account to track your tickets, reservations, or assigned devices.
          </p>
          <div className="flex justify-center pt-4">
            <Link href="/login">
              <Button size="lg">Login to Your Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} IT Helpdesk. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <CreateTicketModal open={showTicketModal} onOpenChange={setShowTicketModal} />
      <CreateReservationModal open={showReservationModal} onOpenChange={setShowReservationModal} />
    </div>
  )
}
