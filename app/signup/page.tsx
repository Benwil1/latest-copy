"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      valid = false
    } else if (!/^\+?[0-9\s\-()]{10,15}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Phone number is invalid"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      valid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        await signup(formData.name, formData.email, formData.phone, formData.password)
        // The auth context will handle navigation to verification page
      } catch (error) {
        console.error("Signup error:", error)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-xl font-bold text-vibrant-orange">RoomieMatch</div>
        <ModeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
            <CardDescription className="text-center">Enter your details to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="name"
                    placeholder="Full Name"
                    className="pl-9"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="pl-9"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    className="pl-9"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-9"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="pl-9"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <Button type="submit" className="w-full" variant="default" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link href="#" className="underline text-vibrant-orange hover:text-vibrant-orange/80">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline text-vibrant-orange hover:text-vibrant-orange/80">
                Privacy Policy
              </Link>
            </div>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-vibrant-orange hover:text-vibrant-orange/80 font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
