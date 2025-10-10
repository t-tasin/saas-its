"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Headset, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"user" | "operator" | "admin">("user")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { requestOTP, loginWithPassword } = useAuth()
  const router = useRouter()

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setSuccess(false)

    try {
      await requestOTP(email)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setSuccess(false)

    try {
      await loginWithPassword(email, password)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Headset className="h-8 w-8" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Select your account type and enter your credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="user">User</TabsTrigger>
                  <TabsTrigger value="operator">Operator</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                {/* User Tab - Email Only */}
                <TabsContent value="user">
                  <form onSubmit={handleUserLogin} className="space-y-4 mt-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">We'll send you an OTP to verify your identity</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || success}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {success && <CheckCircle2 className="mr-2 h-4 w-4" />}
                      {success ? "OTP Sent!" : loading ? "Sending..." : "Submit"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Operator Tab - Email + Password */}
                <TabsContent value="operator">
                  <form onSubmit={handleStaffLogin} className="space-y-4 mt-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="operator-email">Email</Label>
                      <Input
                        id="operator-email"
                        type="email"
                        placeholder="operator@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="operator-password">Password</Label>
                      <Input
                        id="operator-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || success}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {success && <CheckCircle2 className="mr-2 h-4 w-4" />}
                      {success ? "Verified!" : loading ? "Verifying..." : "Continue to OTP"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Admin Tab - Email + Password */}
                <TabsContent value="admin">
                  <form onSubmit={handleStaffLogin} className="space-y-4 mt-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || success}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {success && <CheckCircle2 className="mr-2 h-4 w-4" />}
                      {success ? "Verified!" : loading ? "Verifying..." : "Continue to OTP"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Register here
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
