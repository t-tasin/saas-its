import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as HotToaster } from "react-hot-toast"
import { AuthProvider } from "@/contexts/auth-context"
import { QueryProvider } from "@/lib/query-provider"
import { Navbar } from "@/components/navbar"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "IT Helpdesk & Asset Management",
  description: "Complete IT support ticketing and equipment reservation system",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <QueryProvider>
            <AuthProvider>
              <Navbar />
              {children}
              <Toaster />
              <HotToaster position="top-right" />
            </AuthProvider>
          </QueryProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
