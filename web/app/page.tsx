"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket, Calendar, Package, Headset, ArrowRight } from "lucide-react"
import { CreateTicketModal } from "@/components/create-ticket-modal"
import { CreateReservationModal } from "@/components/create-reservation-modal"

export default function HomePage() {
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)

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
