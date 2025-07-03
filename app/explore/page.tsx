'use client';

import { EnhancedSearch } from '@/components/enhanced-search';
import MobileNav from '@/components/mobile-nav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
	Calendar,
	CheckCircle,
	DollarSign,
	MapPin,
	MessageSquare,
	Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';

interface Roommate {
	id: number;
	name: string;
	age: number;
	image: string;
	budget: number;
	location: string;
	moveIn: string;
	compatibility: number;
	verified: boolean;
	tags: string[];
	bio: string;
	nationality: string;
	hasPhotos: boolean;
	roomType: string[];
	moveInDate?: string;
}

interface SearchFilters {
	budgetRange: [number, number];
	ageRange: [number, number];
	location: string;
	moveInDate: string;
	roomType: string[];
	lifestyle: string[];
	verified: boolean;
	hasPhotos: boolean;
}

// Sample roommate data with enhanced properties
const roommates: Roommate[] = [
	{
		id: 1,
		name: 'Sarah Johnson',
		age: 26,
		nationality: 'United States',
		image:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1200,
		location: 'Downtown',
		moveIn: 'Immediate',
		moveInDate: '2024-02-01',
		compatibility: 92,
		verified: true,
		hasPhotos: true,
		roomType: ['Private Room', 'Entire Apartment'],
		tags: ['Non-smoker', 'Pet-friendly', 'Early riser', 'Professional', 'Clean'],
		bio: 'Software engineer who loves hiking and cooking. Looking for a quiet and clean roommate.',
	},
	{
		id: 2,
		name: 'Michael Chen',
		age: 28,
		nationality: 'Canada',
		image:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1500,
		location: 'Midtown',
		moveIn: 'Next month',
		moveInDate: '2024-03-01',
		compatibility: 85,
		verified: true,
		hasPhotos: true,
		roomType: ['Shared Room', 'Studio'],
		tags: ['Non-smoker', 'Night owl', 'Social', 'Professional'],
		bio: "Marketing professional who enjoys fitness and weekend adventures. I'm tidy and respectful of shared spaces.",
	},
	{
		id: 3,
		name: 'Emma Rodriguez',
		age: 24,
		nationality: 'Spain',
		image:
			'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1100,
		location: 'Westside',
		moveIn: 'Flexible',
		moveInDate: '2024-04-01',
		compatibility: 78,
		verified: false,
		hasPhotos: true,
		roomType: ['Private Room', 'House'],
		tags: ['Pet-friendly', 'Student', 'Quiet', 'Vegetarian'],
		bio: "Graphic designer with a small cat. I'm creative, laid-back, and enjoy having friends over occasionally.",
	},
	{
		id: 4,
		name: 'Raj Patel',
		age: 27,
		nationality: 'India',
		image:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1300,
		location: 'Downtown',
		moveIn: 'Next month',
		moveInDate: '2024-03-15',
		compatibility: 81,
		verified: true,
		hasPhotos: true,
		roomType: ['Entire Apartment', 'Studio'],
		tags: ['Non-smoker', 'Vegetarian', 'Early riser', 'Professional', 'Clean'],
		bio: "Software developer who loves cooking Indian food. I'm clean, quiet, and respectful of shared spaces.",
	},
	{
		id: 5,
		name: 'Sophia Kim',
		age: 25,
		nationality: 'South Korea',
		image:
			'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1400,
		location: 'Eastside',
		moveIn: 'Immediate',
		moveInDate: '2024-02-15',
		compatibility: 89,
		verified: true,
		hasPhotos: true,
		roomType: ['Private Room', 'Shared Room'],
		tags: ['Non-smoker', 'Student', 'Clean', 'Early riser'],
		bio: 'Graduate student studying business. I enjoy trying new restaurants, watching movies, and keeping a tidy home.',
	},
	{
		id: 6,
		name: 'Alex Thompson',
		age: 30,
		nationality: 'United Kingdom',
		image:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1800,
		location: 'Downtown',
		moveIn: 'Next month',
		moveInDate: '2024-03-01',
		compatibility: 87,
		verified: true,
		hasPhotos: false,
		roomType: ['Entire Apartment', 'House'],
		tags: ['Night owl', 'Social', 'Professional', 'Pet-friendly'],
		bio: 'Financial analyst who enjoys nightlife and social events. Looking for someone who shares similar interests.',
	},
	{
		id: 7,
		name: 'Maya Singh',
		age: 23,
		nationality: 'India',
		image:
			'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 900,
		location: 'Uptown',
		moveIn: 'Flexible',
		moveInDate: '2024-05-01',
		compatibility: 75,
		verified: false,
		hasPhotos: true,
		roomType: ['Shared Room', 'Studio'],
		tags: ['Student', 'Quiet', 'Vegetarian', 'Early riser'],
		bio: 'Medical student looking for a quiet study environment. I keep to myself but am friendly.',
	},
	{
		id: 8,
		name: 'James Wilson',
		age: 29,
		nationality: 'Australia',
		image:
			'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1600,
		location: 'Midtown',
		moveIn: 'Immediate',
		moveInDate: '2024-02-01',
		compatibility: 83,
		verified: true,
		hasPhotos: true,
		roomType: ['Private Room', 'Entire Apartment'],
		tags: ['Non-smoker', 'Social', 'Professional', 'Clean'],
		bio: 'Software architect who enjoys cooking and outdoor activities. Looking for a responsible roommate.',
	},
];

export default function ExplorePage() {
	const router = useRouter();
	const [filters, setFilters] = useState<SearchFilters>({
		budgetRange: [500, 3000],
		ageRange: [18, 65],
		location: '',
		moveInDate: '',
		roomType: [],
		lifestyle: [],
		verified: false,
		hasPhotos: false,
	});

	// Filter roommates based on all criteria
	const filteredRoommates = useMemo(() => {
		return roommates.filter((roommate) => {
			// Budget filter
			const budgetMatch = roommate.budget >= filters.budgetRange[0] && 
							   roommate.budget <= filters.budgetRange[1];

			// Age filter
			const ageMatch = roommate.age >= filters.ageRange[0] && 
							roommate.age <= filters.ageRange[1];

			// Location filter
			const locationMatch = !filters.location || 
								 roommate.location.toLowerCase().includes(filters.location.toLowerCase());

			// Move-in date filter (if specified)
			const moveInMatch = !filters.moveInDate || 
							   (roommate.moveInDate && new Date(roommate.moveInDate) <= new Date(filters.moveInDate));

			// Room type filter
			const roomTypeMatch = filters.roomType.length === 0 || 
								 filters.roomType.some(type => roommate.roomType.includes(type));

			// Lifestyle filter
			const lifestyleMatch = filters.lifestyle.length === 0 || 
								  filters.lifestyle.every(lifestyle => roommate.tags.includes(lifestyle));

			// Verified filter
			const verifiedMatch = !filters.verified || roommate.verified;

			// Has photos filter
			const photosMatch = !filters.hasPhotos || roommate.hasPhotos;

			return budgetMatch && ageMatch && locationMatch && moveInMatch && 
				   roomTypeMatch && lifestyleMatch && verifiedMatch && photosMatch;
		});
	}, [filters]);

	const handleFiltersChange = (newFilters: SearchFilters) => {
		setFilters(newFilters);
	};

	const handleContact = (roommateId: number) => {
		// Navigate to matches page or direct message
		router.push(`/matches?contact=${roommateId}`);
	};

	return (
		<div className="min-h-screen pb-20 sm:pb-16">
			<main className="pt-6">
				<div className="container max-w-7xl mx-auto px-4">
					{/* Enhanced Search Component */}
					<EnhancedSearch 
						onFiltersChange={handleFiltersChange}
						className="mb-8"
					/>

					{/* Results Header */}
					<div className="flex justify-between items-center mb-6">
						<div>
							<h2 className="text-xl font-semibold">
								{filteredRoommates.length} Roommate{filteredRoommates.length !== 1 ? 's' : ''} Found
							</h2>
							<p className="text-sm text-muted-foreground">
								Find your perfect roommate match
							</p>
						</div>
					</div>

					{/* Roommate Grid */}
					{filteredRoommates.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredRoommates.map((roommate) => (
								<Card
									key={roommate.id}
									className="group overflow-hidden border hover:border-vibrant-orange/20 transition-all duration-300 hover:shadow-lg cursor-pointer"
									onClick={() => router.push(`/roommate/${roommate.id}`)}
								>
									<div className="relative aspect-[4/5] overflow-hidden">
										<img
											src={roommate.image}
											alt={roommate.name}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
										
										{/* Overlay Badges */}
										<div className="absolute top-3 right-3 flex flex-col gap-2">
											{roommate.verified && (
												<Badge
													variant="secondary"
													className="text-xs bg-background/90 backdrop-blur-sm"
												>
													<CheckCircle className="h-3 w-3 mr-1" />
													Verified
												</Badge>
											)}
											<Badge 
												variant="default" 
												className="text-xs bg-vibrant-orange hover:bg-vibrant-orange/90"
											>
												{roommate.compatibility}% Match
											</Badge>
										</div>

										{/* Bottom Info Overlay */}
										<div className="absolute bottom-0 left-0 right-0 p-4">
											<div className="text-white">
												<h3 className="text-lg font-semibold mb-1">
													{roommate.name}, {roommate.age}
												</h3>
												<div className="flex items-center gap-4 text-sm text-white/90 mb-2">
													<div className="flex items-center gap-1">
														<DollarSign className="h-3 w-3" />
														${roommate.budget}/mo
													</div>
													<div className="flex items-center gap-1">
														<MapPin className="h-3 w-3" />
														{roommate.location}
													</div>
												</div>
												<div className="flex items-center gap-1 text-sm text-white/90">
													<Calendar className="h-3 w-3" />
													{roommate.moveIn}
												</div>
											</div>
										</div>
									</div>

									{/* Card Content */}
									<CardContent className="p-4">
										<div className="flex flex-wrap gap-1 mb-3">
											{roommate.tags.slice(0, 3).map((tag, index) => (
												<Badge
													key={index}
													variant="outline"
													className="text-xs"
												>
													{tag}
												</Badge>
											))}
											{roommate.tags.length > 3 && (
												<Badge variant="outline" className="text-xs">
													+{roommate.tags.length - 3}
												</Badge>
											)}
										</div>

										<p className="text-sm text-muted-foreground line-clamp-2 mb-4">
											{roommate.bio}
										</p>

										<div className="flex gap-2">
											<Button
												size="sm"
												className="flex-1 bg-vibrant-orange hover:bg-orange-600"
												onClick={(e) => {
													e.stopPropagation();
													handleContact(roommate.id);
												}}
											>
												<MessageSquare className="h-3 w-3 mr-1" />
												Message
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={(e) => {
													e.stopPropagation();
													router.push(`/roommate/${roommate.id}`);
												}}
											>
												View Profile
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<Card className="text-center py-12">
							<CardHeader>
								<CardTitle className="text-xl">No roommates found</CardTitle>
								<CardDescription>
									Try adjusting your search filters to find more matches
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									variant="outline"
									onClick={() => setFilters({
										budgetRange: [500, 3000],
										ageRange: [18, 65],
										location: '',
										moveInDate: '',
										roomType: [],
										lifestyle: [],
										verified: false,
										hasPhotos: false,
									})}
								>
									Clear All Filters
								</Button>
							</CardContent>
						</Card>
					)}

					{/* Search Tips */}
					{filteredRoommates.length > 0 && (
						<Card className="mt-8 bg-gradient-to-r from-vibrant-orange/5 to-purple-500/5 border-vibrant-orange/20">
							<CardContent className="p-6">
								<h3 className="font-semibold mb-2 text-vibrant-orange">
									💡 Search Tips
								</h3>
								<div className="text-sm text-muted-foreground space-y-1">
									<p>• Use lifestyle filters to find roommates with compatible habits</p>
									<p>• Set a realistic budget range to see more options</p>
									<p>• Consider roommates in nearby areas for more choices</p>
									<p>• Verified profiles have gone through our identity verification process</p>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</main>

			<MobileNav />
		</div>
	);
}