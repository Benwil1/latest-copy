"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, Loader2, Phone, Clock } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function VerifyPhonePage() {
  const router = useRouter()
  const { user, verifyPhone, resendVerificationCode, isLoading } = useAuth()
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Redirect if no user or if phone already verified
  useEffect(() => {
    if (!user) {
      router.push("/signup")
    } else if (user.phoneVerified) {
      router.push("/verify-email")
    }
  }, [user, router])

  // Countdown timer for resend code
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!verificationCode) {
      setError("Please enter the verification code")
      return
    }

    try {
      const success = await verifyPhone(verificationCode)
      if (success) {
        router.push("/verify-email")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setError("Failed to verify phone number. Please try again.")
    }
  }

  const handleResendCode = async () => {
    try {
      await resendVerificationCode("phone")
      setCanResend(false)
      setCountdown(60)
    } catch (error) {
      console.error("Resend code error:", error)
    }
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verify Your Phone</CardTitle>
            <CardDescription className="text-center">We've sent a verification code to {user.phone}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                </div>

                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value)
                    setError("")
                  }}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
                {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              </div>

              <Button type="submit" className="w-full" variant="default" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Phone Number"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              Didn't receive a code?{" "}
              {canResend ? (
                <Button
                  variant="link"
                  className="p-0 h-auto text-vibrant-orange hover:text-vibrant-orange/80"
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
              ) : (
                <span className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Resend in {countdown}s
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
