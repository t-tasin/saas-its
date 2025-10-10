"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Headset, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { OTPInput } from "@/components/otp-input"
import toast from "react-hot-toast"

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes = 300 seconds
  const [canResend, setCanResend] = useState(false)
  const { verifyOTP, resendOTP } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingEmail")
    if (!pendingEmail) {
      router.push("/login")
      return
    }
    setEmail(pendingEmail)
  }, [router])

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return

    setError("")
    setLoading(true)

    try {
      await verifyOTP(otp)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.")
      setOtp("")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    try {
      await resendOTP()
      setTimeLeft(300)
      setCanResend(false)
      setOtp("")
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP")
    }
  }

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Headset className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Mobile Phone Verification</h1>
          <p className="text-muted-foreground mt-2">Enter the 6-digit verification code that was sent to your email</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Enter Verification Code</CardTitle>
            <CardDescription className="text-center">
              Code sent to <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500 bg-green-50 text-green-900">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>Verification successful! Redirecting...</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <OTPInput length={6} value={otp} onChange={setOtp} disabled={loading || success} />

                <div className="text-center">
                  {timeLeft > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Code expires in{" "}
                      <span className="font-mono font-semibold text-foreground">{formatTime(timeLeft)}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-destructive font-medium">Code expired</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full relative overflow-hidden transition-all duration-300"
                disabled={loading || otp.length !== 6 || success || timeLeft <= 0}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {success && <CheckCircle2 className="mr-2 h-4 w-4" />}
                {success ? "Verified!" : loading ? "Verifying..." : "Verify Account"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Didn't receive code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={!canResend || loading}
                    className={`font-medium ${
                      canResend && !loading
                        ? "text-primary hover:underline cursor-pointer"
                        : "text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    Resend
                  </button>
                </p>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push("/login")}
                  className="text-sm"
                  disabled={loading}
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
