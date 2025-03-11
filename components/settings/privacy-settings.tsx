"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Loader2, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PrivacySettingsProps {
  onSave: () => void
}

export default function PrivacySettings({ onSave }: PrivacySettingsProps) {
  // Mock privacy settings - in a real app, this would come from an API or context
  const [settings, setSettings] = useState({
    profileVisibility: "public", // public, matches, private
    showOnlineStatus: true,
    showLastActive: true,
    allowLocationSharing: "approximate", // precise, approximate, none
    dataUsage: {
      allowPersonalization: true,
      allowAnalytics: true,
      allowThirdPartySharing: false,
    },
    blockList: [] as string[], // Would contain user IDs in a real app
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleToggle = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleDataUsageToggle = (setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      dataUsage: {
        ...prev.dataUsage,
        [setting]: value,
      },
    }))
  }

  const handleRadioChange = (setting: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      onSave()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>Control who can see your profile and how your data is used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Visibility */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Profile Visibility</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Control who can see your profile information on RoomieMatch</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Who can see my profile</Label>
                <RadioGroup
                  value={settings.profileVisibility}
                  onValueChange={(value) => handleRadioChange("profileVisibility", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="visibility-public" />
                    <Label htmlFor="visibility-public" className="font-normal">
                      Everyone (Public)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="matches" id="visibility-matches" />
                    <Label htmlFor="visibility-matches" className="font-normal">
                      Only my matches
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="visibility-private" />
                    <Label htmlFor="visibility-private" className="font-normal">
                      Private (Only visible to people I like)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-online-status" className="flex-1">
                  Show online status
                  <p className="text-sm font-normal text-muted-foreground">
                    Let others see when you're active on RoomieMatch
                  </p>
                </Label>
                <Switch
                  id="show-online-status"
                  checked={settings.showOnlineStatus}
                  onCheckedChange={(checked) => handleToggle("showOnlineStatus", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-last-active" className="flex-1">
                  Show last active status
                  <p className="text-sm font-normal text-muted-foreground">
                    Let others see when you were last active on RoomieMatch
                  </p>
                </Label>
                <Switch
                  id="show-last-active"
                  checked={settings.showLastActive}
                  onCheckedChange={(checked) => handleToggle("showLastActive", checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Location Sharing */}
          <div>
            <h3 className="text-lg font-medium mb-4">Location Sharing</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Location sharing level</Label>
                <RadioGroup
                  value={settings.allowLocationSharing}
                  onValueChange={(value) => handleRadioChange("allowLocationSharing", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="precise" id="location-precise" />
                    <Label htmlFor="location-precise" className="font-normal">
                      Precise location (exact address)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approximate" id="location-approximate" />
                    <Label htmlFor="location-approximate" className="font-normal">
                      Approximate location (neighborhood/area only)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="location-none" />
                    <Label htmlFor="location-none" className="font-normal">
                      Don't share my location
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Usage */}
          <div>
            <h3 className="text-lg font-medium mb-4">Data Usage</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-personalization" className="flex-1">
                  Personalized recommendations
                  <p className="text-sm font-normal text-muted-foreground">
                    Allow us to use your data to provide personalized roommate recommendations
                  </p>
                </Label>
                <Switch
                  id="allow-personalization"
                  checked={settings.dataUsage.allowPersonalization}
                  onCheckedChange={(checked) => handleDataUsageToggle("allowPersonalization", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-analytics" className="flex-1">
                  Analytics and improvements
                  <p className="text-sm font-normal text-muted-foreground">
                    Allow us to collect usage data to improve our services
                  </p>
                </Label>
                <Switch
                  id="allow-analytics"
                  checked={settings.dataUsage.allowAnalytics}
                  onCheckedChange={(checked) => handleDataUsageToggle("allowAnalytics", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="allow-third-party" className="flex-1">
                  Third-party data sharing
                  <p className="text-sm font-normal text-muted-foreground">
                    Allow us to share your data with trusted third parties
                  </p>
                </Label>
                <Switch
                  id="allow-third-party"
                  checked={settings.dataUsage.allowThirdPartySharing}
                  onCheckedChange={(checked) => handleDataUsageToggle("allowThirdPartySharing", checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Blocked Users */}
          <div>
            <h3 className="text-lg font-medium mb-4">Blocked Users</h3>
            {settings.blockList.length > 0 ? (
              <div className="space-y-2">
                {/* List of blocked users would go here */}
                <p>You have blocked {settings.blockList.length} users.</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">You haven't blocked any users yet.</p>
            )}
            <Button variant="outline" size="sm" className="mt-2">
              Manage Blocked Users
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
  )
}

