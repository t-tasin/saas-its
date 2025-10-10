"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Headset, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { register } = useAuth()
  const { toast } = useToast()

  const passwordValidations = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  }

  const isPasswordValid = Object.values(passwordValidations).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Name is required.")
      return
    }

    if (!isEmailValid) {
      setError("Please enter a valid email address.")
      return
    }

    if (!isPasswordValid) {
      setError("Password does not meet all requirements.")
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      await register({ email, password, name })
      setSuccess(true)
      // Router push is handled in AuthContext
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
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
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-muted-foreground mt-2">Sign up to get started with IT Helpdesk</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Fill in your details to create a new account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {email && (
                    <p
                      className={`text-xs flex items-center gap-1 ${isEmailValid ? "text-green-600" : "text-red-600"}`}
                    >
                      {isEmailValid ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      {isEmailValid ? "Valid email format" : "Invalid email format"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {password && (
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
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || success || !name.trim() || !isEmailValid || !isPasswordValid || !passwordsMatch}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {success && <CheckCircle2 className="mr-2 h-4 w-4" />}
                  {success ? "Account Created!" : loading ? "Creating account..." : "Create Account"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
