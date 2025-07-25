'use client';

import MobileNav from '@/components/mobile-nav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth-context';
import {
	ArrowLeft,
	CheckCircle,
	Edit,
	Eye,
	Lock,
	Settings,
	Shield,
	Star,
	Trash2,
	Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProfileCompletenessMeter } from '@/components/profile/profile-completeness-meter';

export default function ProfilePage() {
	const router = useRouter();
	const { user } = useAuth();

	if (!user)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);

	return (
		<div className="min-h-screen pb-16">
			<main className="container max-w-2xl mx-auto px-3 py-6 sm:py-8">
				<div className="flex flex-col items-center mb-6 sm:mb-8">
					<div className="relative">
						<Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-background">
							<AvatarImage
								src={
									user.profilePicture ||
									'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80'
								}
								alt={user.name}
							/>
							<AvatarFallback>{user.name?.charAt(0) || '?'}</AvatarFallback>
						</Avatar>
						<Button
							variant="default"
							size="icon"
							className="absolute bottom-0 right-0 rounded-full h-6 w-6"
							asChild
						>
							<Link href="/profile/edit">
								<Edit className="h-3 w-3" />
							</Link>
						</Button>
					</div>
					<div className="mt-4 text-center">
						<div className="flex items-center justify-center gap-1">
							<h1 className="text-xl font-bold">{user.name}</h1>
							<CheckCircle className="h-4 w-4 text-vibrant-orange" />
						</div>
						<p className="text-muted-foreground text-sm">
							{user.occupation || 'Member'}
							{user.location ? ` • ${user.location}` : ''}
						</p>
					</div>

					<ProfileCompletenessMeter user={user} />

					<div className="flex gap-2 mt-4">
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1 h-8 text-xs"
							asChild
						>
							<Link href="/profile/edit">
								<Edit className="h-3 w-3" />
								<span>Edit Profile</span>
							</Link>
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="flex items-center gap-1 h-8 text-xs"
							asChild
						>
							<Link href="/settings">
								<Settings className="h-3 w-3" />
								<span>Settings</span>
							</Link>
						</Button>
					</div>
				</div>

				<Tabs defaultValue="about" className="w-full">
					<TabsList className="grid w-full grid-cols-3 mb-6 h-9 sm:h-10">
						<TabsTrigger value="about" className="text-xs">
							About
						</TabsTrigger>
						<TabsTrigger value="preferences" className="text-xs">
							Preferences
						</TabsTrigger>
						<TabsTrigger value="premium" className="text-xs">
							Premium
						</TabsTrigger>
					</TabsList>

					<TabsContent value="about" className="space-y-3">
						<Card>
							<CardHeader className="p-4">
								<CardTitle className="text-base sm:text-lg">Bio</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-0">
								<p className="text-sm">{user.bio || 'No bio yet.'}</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="p-4">
								<CardTitle className="text-base sm:text-lg">
									Interests
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-0">
								<div className="flex flex-wrap gap-2">
									<Badge variant="gray" className="text-xs">
										Hiking
									</Badge>
									<Badge variant="gray" className="text-xs">
										Cooking
									</Badge>
									<Badge variant="gray" className="text-xs">
										Reading
									</Badge>
									<Badge variant="gray" className="text-xs">
										Photography
									</Badge>
									<Badge variant="gray" className="text-xs">
										Travel
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="p-4">
								<CardTitle className="text-base sm:text-lg">
									Verification
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-0 space-y-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-500" />
										<span className="text-xs">Email Verified</span>
									</div>
									<Badge variant="success" className="text-[10px]">
										{user.emailVerified ? 'Completed' : 'Pending'}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<CheckCircle className="h-4 w-4 text-green-500" />
										<span className="text-xs">Phone Verified</span>
									</div>
									<Badge variant="success" className="text-[10px]">
										{user.phoneVerified ? 'Completed' : 'Pending'}
									</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Shield className="h-4 w-4 text-muted-foreground" />
										<span className="text-xs">ID Verification</span>
									</div>
									<Button variant="outline" size="sm" className="h-7 text-xs">
										Verify Now
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="preferences" className="space-y-3">
						<Card>
							<CardHeader className="p-4">
								<CardTitle className="text-base sm:text-lg">
									Housing Preferences
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-0 space-y-3">
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">Budget</span>
									<span className="text-xs font-medium">
										{user.budget ? `${user.budget}/month` : '—'}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">
										Location
									</span>
									<span className="text-xs font-medium">
										{user.preferredLocation || '—'}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">
										Move-in Date
									</span>
									<span className="text-xs font-medium">
										{user.moveInDate || '—'}
									</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="p-4">
								<CardTitle className="text-base sm:text-lg">
									Lifestyle Preferences
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-0 space-y-3">
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">Smoking</span>
									<span className="text-xs font-medium">
										{user.lifestyle?.smoking || '—'}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">Pets</span>
									<span className="text-xs font-medium">
										{user.lifestyle?.pets || '—'}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">
										Cleanliness
									</span>
									<span className="text-xs font-medium">
										{user.lifestyle?.cleanliness || '—'}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">
										Schedule
									</span>
									<span className="text-xs font-medium">
										{user.lifestyle?.work || '—'}
									</span>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="p-4">
								<CardTitle className="text-base sm:text-lg">
									Roommate Preferences
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-0 space-y-3">
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">
										Age Range
									</span>
									<span className="text-xs font-medium">
										{user.roommatePreferences?.ageRange || '—'}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">
										Gender Preference
									</span>
									<span className="text-xs font-medium">
										{user.roommatePreferences?.gender || '—'}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-xs text-muted-foreground">
										Occupation
									</span>
									<span className="text-xs font-medium">
										{user.roommatePreferences?.occupation || '—'}
									</span>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="premium" className="space-y-3">
						<Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/50">
							<CardHeader className="p-4">
								<CardTitle className="text-base sm:text-lg flex items-center gap-2">
									<Star className="h-4 w-4 text-amber-500 fill-amber-500" />
									Premium Features
								</CardTitle>
								<CardDescription className="text-xs">
									Upgrade to unlock premium features
								</CardDescription>
							</CardHeader>
							<CardContent className="p-4 pt-0 space-y-4">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
											<Zap className="h-4 w-4 text-amber-500" />
										</div>
										<div>
											<h3 className="text-xs font-medium">
												Boost Your Profile
											</h3>
											<p className="text-[10px] text-muted-foreground">
												Get up to 10x more matches
											</p>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
											<Eye className="h-4 w-4 text-amber-500" />
										</div>
										<div>
											<h3 className="text-xs font-medium">See Who Liked You</h3>
											<p className="text-[10px] text-muted-foreground">
												View profiles of people who liked you
											</p>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
											<Lock className="h-4 w-4 text-amber-500" />
										</div>
										<div>
											<h3 className="text-xs font-medium">Advanced Filters</h3>
											<p className="text-[10px] text-muted-foreground">
												Filter by more specific preferences
											</p>
										</div>
									</div>
								</div>

								<Button variant="default" className="w-full h-8 text-xs">
									Upgrade to Premium
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="p-4">
								<CardTitle className="text-base sm:text-lg">
									Current Plan
								</CardTitle>
							</CardHeader>
							<CardContent className="p-4 pt-0">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="text-xs font-medium">Free Plan</h3>
										<p className="text-[10px] text-muted-foreground">
											Basic features
										</p>
									</div>
									<Badge variant="gray" className="text-[10px]">
										Active
									</Badge>
								</div>

								<div className="mt-3 space-y-1">
									<div className="flex items-center gap-2">
										<CheckCircle className="h-3 w-3 text-green-500" />
										<span className="text-xs">10 swipes per day</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="h-3 w-3 text-green-500" />
										<span className="text-xs">Basic matching algorithm</span>
									</div>
									<div className="flex items-center gap-2">
										<CheckCircle className="h-3 w-3 text-green-500" />
										<span className="text-xs">Standard profile visibility</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>

			<MobileNav />
		</div>
	);
}
