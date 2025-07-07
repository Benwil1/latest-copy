'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { ProfileImageCarousel } from '@/components/profile/profile-image-carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	ArrowLeft,
	CheckCircle,
	Clock,
	Flag,
	Heart,
	Home,
	Info,
	MapPin,
	MessageSquare,
	Play,
	Sparkles,
	Star,
	Users,
	Volume2,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

// Sample roommate data - in a real app, this would come from an API
const roommates = [
	{
		id: 1,
		name: 'Sarah Johnson',
		age: 26,
		nationality: 'United States',
		image:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		videoProfile:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1200,
		location: 'Downtown',
		moveIn: 'Immediate',
		compatibility: 92,
		verified: true,
		tags: ['Non-smoker', 'Pet-friendly', 'Early riser', 'Clean'],
		bio: 'Software engineer who loves hiking and cooking. Looking for a quiet and clean roommate.',
		occupation: 'Software Engineer',
		lifestyle: {
			cleanliness: 'Very clean',
			noise: 'Quiet',
			schedule: 'Early riser',
			guests: 'Occasional guests',
			smoking: 'Non-smoker',
			pets: 'Pet-friendly',
		},
		preferences: {
			roommate: 'Professional or student',
			gender: 'Any',
			ageRange: '23-35',
			spaceType: 'Private room',
			bathroom: 'Private preferred',
			furnished: 'Fully furnished',
		},
		interests: ['Hiking', 'Cooking', 'Reading', 'Photography', 'Travel'],
		languages: ['English', 'Spanish'],
		reviews: [
			{
				name: 'Michael',
				image:
					'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
				rating: 5,
				text: 'Sarah was an amazing roommate. Always clean, respectful, and friendly.',
			},
			{
				name: 'Emma',
				image:
					'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
				rating: 4,
				text: 'Great roommate! We got along really well and she was always considerate.',
			},
		],
		gallery: [
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		],
		photos: [
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		],
	},
	{
		id: 2,
		name: 'Alex Chen',
		age: 24,
		nationality: 'Canada',
		image:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		videoProfile:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1000,
		location: 'Midtown',
		moveIn: 'Next month',
		compatibility: 88,
		verified: true,
		tags: ['Non-smoker', 'Quiet', 'Student', 'Clean'],
		bio: 'Graduate student studying computer science. Enjoys gaming and outdoor activities.',
		occupation: 'Graduate Student',
		lifestyle: {
			cleanliness: 'Clean',
			noise: 'Quiet',
			schedule: 'Night owl',
			guests: 'Rare guests',
			smoking: 'Non-smoker',
			pets: 'No pets',
		},
		preferences: {
			roommate: 'Student or young professional',
			gender: 'Any',
			ageRange: '20-30',
			spaceType: 'Private room',
			bathroom: 'Shared okay',
			furnished: 'Partially furnished',
		},
		interests: ['Gaming', 'Hiking', 'Technology', 'Movies', 'Cooking'],
		languages: ['English', 'Mandarin'],
		reviews: [
			{
				name: 'Jessica',
				image:
					'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
				rating: 5,
				text: 'Alex is a great roommate. Very respectful and clean.',
			},
		],
		gallery: [
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		],
		photos: [
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		],
	},
];

interface PageProps {
	params: Promise<{ id: string }>;
}

export default function RoommateProfilePage({ params }: PageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const resolvedParams = use(params);
	const roommateId = Number.parseInt(resolvedParams.id);
	const [activeTab, setActiveTab] = useState('about');
	const [roommate, setRoommate] = useState(
		roommates.find((r) => r.id === roommateId)
	);

	useEffect(() => {
		const loadData = async () => {
			try {
				// Simulate API call
				await new Promise((resolve) => setTimeout(resolve, 500));
				const data = roommates.find((r) => r.id === roommateId);
				setRoommate(data);
			} catch (error) {
				console.error('Error loading roommate data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [roommateId]);

	// Show loading state
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vibrant-orange mx-auto mb-4"></div>
					<p className="text-sm text-muted-foreground">Loading profile...</p>
				</div>
			</div>
		);
	}

	// Show not found state
	if (!roommate) {
		return (
			<div className="min-h-screen bg-background">
				<div className="container py-8 text-center">
					<h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
					<p className="mb-6 text-muted-foreground">
						The profile you're looking for doesn't exist or has been removed.
					</p>
					<Button onClick={() => router.push('/home')}>Back to Home</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
			<main className="container max-w-6xl mx-auto px-2 sm:px-4 mt-4 grid grid-cols-1 md:grid-cols-[minmax(320px,400px)_1fr] gap-8 md:gap-12">
				{/* Profile Header (Sticky, animated, elevated) */}
				<div className="relative mb-8 md:mb-0 flex flex-col items-center md:items-stretch lg:sticky lg:top-12 h-fit animate-fade-in">
					{roommate.photos && roommate.photos.length > 1 ? (
						<ProfileImageCarousel
							photos={roommate.photos}
							alt={roommate.name}
						/>
					) : (
						<div className="relative w-full max-w-xs md:max-w-full aspect-[4/5] rounded-2xl overflow-hidden mb-6 mx-auto md:mx-0 shadow-2xl border border-border bg-card transition-transform duration-300 hover:scale-105">
							<img
								src={roommate.image || '/placeholder.svg'}
								alt={roommate.name}
								className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
							<div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
								<div className="flex flex-col gap-2">
									<h1
										className="font-bold text-white"
										style={{ fontSize: 'clamp(1.5rem, 2vw, 2.5rem)' }}
									>
										{roommate.name}, {roommate.age}
									</h1>
									<div className="flex items-center text-white/90 text-sm sm:text-base mt-1">
										<MapPin className="h-4 w-4 mr-1" />
										<span>{roommate.location}</span>
										{roommate.verified && (
											<div
												className="flex items-center ml-2 group"
												tabIndex={0}
												title="Verified profile"
											>
												<CheckCircle className="h-4 w-4 mr-1 text-vibrant-orange" />
												<span>Verified</span>
											</div>
										)}
									</div>
									<Badge
										variant="secondary"
										className="text-xs sm:text-sm md:text-base w-fit mt-2"
										tabIndex={0}
										title="Match score"
									>
									{roommate.compatibility}% Match
								</Badge>
							</div>
						</div>
					</div>
					)}
				</div>
				{/* Tabs and Details */}
				<div className="w-full max-w-2xl md:max-w-3xl mx-auto md:mx-0 animate-fade-in">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
						<TabsList className="flex gap-2 overflow-x-auto whitespace-nowrap rounded-lg bg-muted p-1 mb-4 relative">
							<TabsTrigger
								value="about"
								className="flex-1 min-w-[120px] px-4 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none flex items-center gap-2 transition-colors"
							>
								<Info className="h-4 w-4" /> About
						</TabsTrigger>
							<TabsTrigger
								value="preferences"
								className="flex-1 min-w-[120px] px-4 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none flex items-center gap-2 transition-colors"
							>
								<Star className="h-4 w-4" /> Preferences
						</TabsTrigger>
							<TabsTrigger
								value="reviews"
								className="flex-1 min-w-[120px] px-4 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white focus:outline-none flex items-center gap-2 transition-colors"
							>
								<Users className="h-4 w-4" /> Reviews
						</TabsTrigger>
							{/* Pill indicator for active tab (pseudo-element or absolute) can be added with Tailwind plugin or custom CSS if desired */}
					</TabsList>
						<TabsContent
							value="about"
							className="space-y-4 mt-2 animate-fade-in"
						>
							<Card className="p-3 sm:p-4 md:p-6 shadow-md">
							<CardHeader>
									<CardTitle className="text-base sm:text-lg md:text-2xl">
										Bio
									</CardTitle>
							</CardHeader>
							<CardContent>
									<p className="text-sm md:text-base">{roommate.bio}</p>
							</CardContent>
						</Card>
							<Card className="p-3 sm:p-4 md:p-6 shadow-md">
							<CardHeader>
									<CardTitle className="text-base sm:text-lg md:text-2xl">
										Basic Info
									</CardTitle>
							</CardHeader>
								<CardContent>
									<dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm md:text-base">
										<dt className="font-semibold text-muted-foreground">
										Occupation
										</dt>
										<dd>{roommate.occupation}</dd>
										<dt className="font-semibold text-muted-foreground">
										Nationality
										</dt>
										<dd>{roommate.nationality}</dd>
										<dt className="font-semibold text-muted-foreground">
										Languages
										</dt>
										<dd>{roommate.languages.join(', ')}</dd>
										<dt className="font-semibold text-muted-foreground">
											Budget
										</dt>
										<dd>${roommate.budget}/month</dd>
										<dt className="font-semibold text-muted-foreground">
										Move-in Date
										</dt>
										<dd>{roommate.moveIn}</dd>
									</dl>
							</CardContent>
						</Card>
							<Card className="p-3 sm:p-4 md:p-6 shadow-md">
							<CardHeader>
									<CardTitle className="text-base sm:text-lg md:text-2xl">
										Lifestyle
									</CardTitle>
							</CardHeader>
								<CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm md:text-base">
								<div className="flex items-start gap-2">
										<Home className="h-4 w-4 text-vibrant-orange mt-0.5" />
									<div>
											<p className="text-xs md:text-sm text-muted-foreground">
												Cleanliness
											</p>
											<p className="text-sm md:text-base font-medium">
											{roommate.lifestyle.cleanliness}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Volume2 className="h-4 w-4 text-vibrant-orange mt-0.5" />
									<div>
											<p className="text-xs md:text-sm text-muted-foreground">
												Noise Level
											</p>
											<p className="text-sm md:text-base font-medium">
											{roommate.lifestyle.noise}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Clock className="h-4 w-4 text-vibrant-orange mt-0.5" />
									<div>
											<p className="text-xs md:text-sm text-muted-foreground">
												Schedule
											</p>
											<p className="text-sm md:text-base font-medium">
											{roommate.lifestyle.schedule}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2">
									<Flag className="h-4 w-4 text-vibrant-orange mt-0.5" />
									<div>
											<p className="text-xs md:text-sm text-muted-foreground">
												Pets
											</p>
											<p className="text-sm md:text-base font-medium">
											{roommate.lifestyle.pets}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
							<Card className="p-3 sm:p-4 md:p-6 shadow-md">
							<CardHeader>
									<CardTitle className="text-base sm:text-lg md:text-2xl">
										Interests
									</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{roommate.interests.map((interest, index) => (
											<Badge
												key={index}
												variant="secondary"
												className="text-xs md:text-base"
											>
											{interest}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
						<TabsContent
							value="preferences"
							className="space-y-4 mt-2 animate-fade-in"
						>
							<Card className="p-3 sm:p-4 md:p-6 shadow-md">
							<CardHeader>
									<CardTitle className="text-base sm:text-lg md:text-2xl">
										Roommate Preferences
									</CardTitle>
							</CardHeader>
								<CardContent>
									<dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm md:text-base">
										<dt className="font-semibold text-muted-foreground">
										Looking for
										</dt>
										<dd>{roommate.preferences.roommate}</dd>
										<dt className="font-semibold text-muted-foreground">
										Gender Preference
										</dt>
										<dd>{roommate.preferences.gender}</dd>
										<dt className="font-semibold text-muted-foreground">
										Age Range
										</dt>
										<dd>{roommate.preferences.ageRange}</dd>
									</dl>
							</CardContent>
						</Card>
					</TabsContent>
						<TabsContent
							value="reviews"
							className="space-y-4 mt-2 animate-fade-in"
						>
							<Card className="p-3 sm:p-4 md:p-6 shadow-md">
							<CardHeader>
									<CardTitle className="text-base sm:text-lg md:text-2xl">
										Roommate Reviews
									</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{roommate.reviews.length > 0 ? (
									roommate.reviews.map((review, index) => (
										<div
											key={index}
											className="border-b pb-4 last:border-0 last:pb-0"
										>
											<div className="flex items-center gap-2 mb-2">
												<Avatar className="h-8 w-8">
													<AvatarImage src={review.image} alt={review.name} />
													<AvatarFallback>{review.name[0]}</AvatarFallback>
												</Avatar>
												<div>
														<p className="text-sm md:text-base font-medium">
															{review.name}
														</p>
													<div className="flex items-center">
														{Array.from({ length: 5 }).map((_, i) => (
															<Star
																key={i}
																	className={`h-3 w-3 md:h-4 md:w-4 ${
																	i < review.rating
																		? 'text-yellow-500 fill-yellow-500'
																		: 'text-gray-300'
																}`}
															/>
														))}
													</div>
												</div>
											</div>
												<p className="text-sm md:text-base">{review.text}</p>
										</div>
									))
								) : (
										<p className="text-sm md:text-base text-muted-foreground">
										No reviews yet.
									</p>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
				</div>
			</main>
		</div>
	);
}
