"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, ArrowRight, Camera, Upload, Check } from "lucide-react"
import { VideoUpload } from "@/components/video-upload"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const totalSteps = 7 // Increased to include video profile step
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      router.push("/home")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={handleBack} disabled={step === 1}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-xl font-bold text-vibrant-orange">RoommieSwipe</div>
        <ModeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="w-full">
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Let's start with some basic details about you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="age" className="text-sm font-medium">
                      Age
                    </label>
                    <Input id="age" type="number" placeholder="Enter your age" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="nationality" className="text-sm font-medium">
                      Nationality
                    </label>
                    <select
                      id="nationality"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select your nationality</option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="ca">Canada</option>
                      <option value="au">Australia</option>
                      <option value="fr">France</option>
                      <option value="de">Germany</option>
                      <option value="jp">Japan</option>
                      <option value="cn">China</option>
                      <option value="in">India</option>
                      <option value="br">Brazil</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="gender" className="text-sm font-medium">
                      Gender
                    </label>
                    <select
                      id="gender"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select your gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </CardContent>
              </>
            )}

            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Upload Photos</CardTitle>
                  <CardDescription>Add some photos to your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-vibrant-orange/50 transition-colors">
                      <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Add Photo</span>
                    </div>
                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-vibrant-orange/50 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Upload</span>
                    </div>
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                      <span className="text-xs">+3 More</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Add at least 2 photos to continue. Your first photo will be your main profile picture.</p>
                  </div>
                </CardContent>
              </>
            )}

            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Video Introduction</CardTitle>
                  <CardDescription>Add a short video to introduce yourself to potential roommates</CardDescription>
                </CardHeader>
                <CardContent>
                  <VideoUpload />
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Adding a video introduction increases your chances of finding a roommate by 70%.</p>
                  </div>
                </CardContent>
              </>
            )}

            {step === 4 && (
              <>
                <CardHeader>
                  <CardTitle>Housing Preferences</CardTitle>
                  <CardDescription>Tell us about your housing needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="budget" className="text-sm font-medium">
                      Monthly Budget (USD)
                    </label>
                    <Input id="budget" type="number" placeholder="Enter your maximum budget" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Preferred Location
                    </label>
                    <Input id="location" placeholder="Enter city or neighborhood" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="move-in-date" className="text-sm font-medium">
                      Preferred Move-in Date
                    </label>
                    <Input id="move-in-date" type="date" />
                  </div>
                </CardContent>
              </>
            )}

            {step === 5 && (
              <>
                <CardHeader>
                  <CardTitle>Living Space Preferences</CardTitle>
                  <CardDescription>Tell us about your ideal living arrangement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Space Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="h-auto py-2">
                        Private Room
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Shared Room
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Entire Apartment
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Studio
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bathroom Preference</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="h-auto py-2">
                        Private Bathroom
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Shared Bathroom
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Furnished Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="h-auto py-2">
                        Fully Furnished
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Partially Furnished
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Unfurnished
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Required Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="rounded-full">
                        WiFi
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Laundry
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Parking
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        AC
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Heating
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Gym
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Pool
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {step === 6 && (
              <>
                <CardHeader>
                  <CardTitle>Lifestyle Preferences</CardTitle>
                  <CardDescription>Help us find compatible roommates for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Smoking Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="h-auto py-2">
                        Non-smoker
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Occasional
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Smoker
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pet Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="h-auto py-2">
                        No pets
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Has pets
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Pet friendly
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cleanliness Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="h-auto py-2">
                        Very neat
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Average
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Relaxed
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Noise Tolerance</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="h-auto py-2">
                        Very quiet
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Moderate
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Don't mind noise
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Guest Preferences</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="h-auto py-2">
                        No guests
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Occasional
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Frequent OK
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Work Schedule</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="h-auto py-2">
                        Day worker
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Night worker
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Remote worker
                      </Button>
                      <Button variant="outline" className="h-auto py-2">
                        Student
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {step === 7 && (
              <>
                <CardHeader>
                  <CardTitle>Almost Done!</CardTitle>
                  <CardDescription>Tell us a bit more about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      placeholder="Write a short bio about yourself..."
                      className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Interests (Select up to 5)</label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="rounded-full">
                        Reading
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Cooking
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Fitness
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Gaming
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Movies
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Music
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Travel
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Art
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Sports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
                Back
              </Button>
              <Button variant="default" onClick={handleNext}>
                {step === totalSteps ? (
                  <>
                    Complete <Check className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
