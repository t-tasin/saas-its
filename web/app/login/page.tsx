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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Headset, AlertCircle, Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"user" | "operator" | "admin">("user")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"email" | "otp">("email")
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [resetOtp, setResetOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const { requestOTP, loginWithPassword, forgotPassword, resetPassword } = useAuth()
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

  // Password validation - same as register page
  const passwordValidations = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  }

  const isPasswordValid = Object.values(passwordValidations).every(Boolean)
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (forgotPasswordStep === "email") {
      setForgotPasswordLoading(true)
      try {
        await forgotPassword(forgotPasswordEmail)
        setForgotPasswordStep("otp")
      } catch (err: any) {
        // Error handled in forgotPassword
      } finally {
        setForgotPasswordLoading(false)
      }
    } else {
      // OTP step - reset password
      if (!isPasswordValid) {
        setError("Password does not meet all requirements")
        return
      }

      if (!passwordsMatch) {
        setError("Passwords do not match")
        return
      }

      setForgotPasswordLoading(true)
      try {
        await resetPassword(forgotPasswordEmail, resetOtp, newPassword)
        setShowForgotPassword(false)
        setForgotPasswordStep("email")
        setForgotPasswordEmail("")
        setResetOtp("")
        setNewPassword("")
        setConfirmPassword("")
        setError("") // Clear any errors
      } catch (err: any) {
        // Error handled in resetPassword
      } finally {
        setForgotPasswordLoading(false)
      }
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="operator-password">Password</Label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(true)
                            setForgotPasswordEmail(email)
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-password">Password</Label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgotPassword(true)
                            setForgotPasswordEmail(email)
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
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

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {forgotPasswordStep === "email" 
                ? "Enter your email to receive a password reset OTP"
                : "Enter the OTP sent to your email and your new password"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            {forgotPasswordStep === "email" ? (
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email *</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reset-otp">OTP *</Label>
                  <Input
                    id="reset-otp"
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Check your email for the OTP</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password *</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  {newPassword && (
                    <div className="space-y-1 text-xs">
                      <p
                        className={
                          passwordValidations.minLength
                            ? "text-green-600 flex items-center gap-1"
                            : "text-muted-foreground flex items-center gap-1"
                        }
                      >
                        {passwordValidations.minLength ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        At least 8 characters
                      </p>
                      <p
                        className={
                          passwordValidations.hasUpperCase
                            ? "text-green-600 flex items-center gap-1"
                            : "text-muted-foreground flex items-center gap-1"
                        }
                      >
                        {passwordValidations.hasUpperCase ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        One uppercase letter
                      </p>
                      <p
                        className={
                          passwordValidations.hasLowerCase
                            ? "text-green-600 flex items-center gap-1"
                            : "text-muted-foreground flex items-center gap-1"
                        }
                      >
                        {passwordValidations.hasLowerCase ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        One lowercase letter
                      </p>
                      <p
                        className={
                          passwordValidations.hasNumber
                            ? "text-green-600 flex items-center gap-1"
                            : "text-muted-foreground flex items-center gap-1"
                        }
                      >
                        {passwordValidations.hasNumber ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        One number
                      </p>
                      <p
                        className={
                          passwordValidations.hasSpecialChar
                            ? "text-green-600 flex items-center gap-1"
                            : "text-muted-foreground flex items-center gap-1"
                        }
                      >
                        {passwordValidations.hasSpecialChar ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        One special character (!@#$%^&*...)
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirm Password *</Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                  {confirmPassword && (
                    <p
                      className={`text-xs flex items-center gap-1 ${passwordsMatch ? "text-green-600" : "text-red-600"}`}
                    >
                      {passwordsMatch ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotPasswordStep("email")
                  setForgotPasswordEmail("")
                  setResetOtp("")
                  setNewPassword("")
                  setConfirmPassword("")
                }}
                disabled={forgotPasswordLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={
                  forgotPasswordLoading || 
                  (forgotPasswordStep === "otp" && (!isPasswordValid || !passwordsMatch))
                }
              >
                {forgotPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {forgotPasswordStep === "email" 
                  ? (forgotPasswordLoading ? "Sending..." : "Send OTP")
                  : (forgotPasswordLoading ? "Resetting..." : "Reset Password")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
