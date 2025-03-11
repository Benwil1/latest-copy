"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, Eye, EyeOff, AlertTriangle, Shield, Lock, Smartphone, LogOut, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface SecuritySettingsProps {
  onSave: () => void
}

export default function SecuritySettings({ onSave }: SecuritySettingsProps) {
  const { user, updatePassword, logout, deleteAccount } = useAuth()

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Account deletion state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // 2FA state
  const [settings, setSettings] = useState({
    twoFactorEnabled: user?.twoFactorEnabled || false,
    loginNotifications: true,
    sessionTimeout: "30", // minutes
  })

  const handleToggle = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleSelectChange = (setting: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))

    // Clear any previous errors
    if (passwordError) {
      setPasswordError("")
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    setIsChangingPassword(true)

    try {
      const success = await updatePassword(passwordData.currentPassword, passwordData.newPassword)
      if (success) {
        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        onSave()
      }
    } catch (error) {
      console.error("Password update failed", error)
      setPasswordError("Failed to update password. Please try again.")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      onSave()
    }, 1000)
  }

  const handleLogout = async () => {
    try {
      await logout()
      // The auth context will handle navigation and toast
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      return
    }

    setIsDeleting(true)
    try {
      await deleteAccount()
      // The auth context will handle navigation and toast
    } catch (error) {
      console.error("Account deletion failed", error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <form onSubmit={handlePasswordSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters and include a mix of letters, numbers, and symbols.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isChangingPassword} className="ml-auto">
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Security Settings */}
      <form onSubmit={handleSecuritySubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your account security settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Two-Factor Authentication */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                </div>
                <Switch
                  id="two-factor-auth"
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(checked) => handleToggle("twoFactorEnabled", checked)}
                />
              </div>

              {settings.twoFactorEnabled ? (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-4">
                    <Smartphone className="h-10 w-10 text-primary shrink-0" />
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication is enabled</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your account is protected with an additional layer of security. You'll need to enter a
                        verification code from your authenticator app when signing in.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Reconfigure 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-4">
                    <Lock className="h-10 w-10 text-muted-foreground shrink-0" />
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication is disabled</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enable two-factor authentication for an additional layer of security. You'll need to enter a
                        verification code from your authenticator app when signing in.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Set Up 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Login Notifications */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="login-notifications" className="flex-1">
                  Login notifications
                  <p className="text-sm font-normal text-muted-foreground">
                    Receive email notifications when someone logs into your account
                  </p>
                </Label>
                <Switch
                  id="login-notifications"
                  checked={settings.loginNotifications}
                  onCheckedChange={(checked) => handleToggle("loginNotifications", checked)}
                />
              </div>
            </div>

            {/* Session Timeout */}
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <select
                id="session-timeout"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={settings.sessionTimeout}
                onChange={(e) => handleSelectChange("sessionTimeout", e.target.value)}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4 hours</option>
              </select>
              <p className="text-xs text-muted-foreground">Automatically log out after a period of inactivity</p>
            </div>

            <Separator />

            {/* Active Sessions */}
            <div>
              <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">New York, United States • Chrome on macOS</p>
                  </div>
                  <Badge>Current</Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4">
                Log Out of All Other Sessions
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Account Management */}
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account access and data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logout */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">Log Out</h3>
              <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>

          <Separator />

          {/* Delete Account */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium text-destructive">Delete Account</h3>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all your data</p>
            </div>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      All your profile information, matches, messages, and preferences will be permanently deleted.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="delete-confirmation">
                      Type <span className="font-bold">DELETE</span> to confirm
                    </Label>
                    <Input
                      id="delete-confirmation"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmation !== "DELETE" || isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Account"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

