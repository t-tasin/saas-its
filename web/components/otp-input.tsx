"use client"

import type React from "react"

import { useRef, useState, useEffect, type KeyboardEvent } from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function OTPInput({ length = 6, value, onChange, disabled = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setOtp(value.split("").concat(Array(length).fill("")).slice(0, length))
    }
  }, [value, length])

  const handleChange = (index: number, digit: string) => {
    if (disabled) return

    // Only allow digits
    if (digit && !/^\d$/.test(digit)) return

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    // Call onChange with the complete OTP
    onChange(newOtp.join(""))

    // Move to next input if digit was entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Handle backspace
    if (e.key === "Backspace") {
      e.preventDefault()
      const newOtp = [...otp]

      if (otp[index]) {
        // Clear current box
        newOtp[index] = ""
        setOtp(newOtp)
        onChange(newOtp.join(""))
      } else if (index > 0) {
        // Move to previous box and clear it
        newOtp[index - 1] = ""
        setOtp(newOtp)
        onChange(newOtp.join(""))
        inputRefs.current[index - 1]?.focus()
      }
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length)
    const digits = pastedData.split("").filter((char) => /^\d$/.test(char))

    if (digits.length > 0) {
      const newOtp = [...otp]
      digits.forEach((digit, index) => {
        if (index < length) {
          newOtp[index] = digit
        }
      })
      setOtp(newOtp)
      onChange(newOtp.join(""))

      // Focus the next empty input or the last input
      const nextIndex = Math.min(digits.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-2xl font-semibold",
            "border-2 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "transition-all duration-200",
            disabled ? "bg-muted cursor-not-allowed" : "bg-background",
            digit ? "border-primary" : "border-input",
          )}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
