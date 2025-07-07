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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
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
import { useMemo, useState } from 'react';
import { roommates, Roommate } from './roommates-data';

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

export default function ExplorePage() {
	const router = useRouter();
	const { toast } = useToast();
	const { user, updateProfile } = useAuth();
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
			const budgetMatch =
				roommate.budget >= filters.budgetRange[0] &&
							   roommate.budget <= filters.budgetRange[1];

			// Age filter
			const ageMatch =
				roommate.age >= filters.ageRange[0] &&
							roommate.age <= filters.ageRange[1];

			// Location filter
			const locationMatch =
				!filters.location ||
				roommate.location
					.toLowerCase()
					.includes(filters.location.toLowerCase());

			// Move-in date filter (if specified)
			const moveInMatch =
				!filters.moveInDate ||
				(roommate.moveInDate &&
					new Date(roommate.moveInDate) <= new Date(filters.moveInDate));

			// Room type filter
			const roomTypeMatch =
				filters.roomType.length === 0 ||
				filters.roomType.some((type) => roommate.roomType.includes(type));

			// Lifestyle filter
			const lifestyleMatch =
				filters.lifestyle.length === 0 ||
				filters.lifestyle.every((lifestyle) =>
					roommate.tags.includes(lifestyle)
				);

			// Verified filter
			const verifiedMatch = !filters.verified || roommate.verified;

			// Has photos filter
			const photosMatch = !filters.hasPhotos || roommate.hasPhotos;

			return (
				budgetMatch &&
				ageMatch &&
				locationMatch &&
				moveInMatch &&
				roomTypeMatch &&
				lifestyleMatch &&
				verifiedMatch &&
				photosMatch
			);
		});
	}, [filters]);

	const handleFiltersChange = (newFilters: SearchFilters) => {
		setFilters(newFilters);
	};

	const handleContact = (roommateId: number) => {
		// Navigate to matches page or direct message
		router.push(`/matches?contact=${roommateId}`);
	};

	const handleSaveSearch = () => {
		if (!user) return;
		const savedSearches = user.savedSearches || [];
		const exists = savedSearches.some(
			(s) => JSON.stringify(s.filters) === JSON.stringify(filters)
		);
		if (exists) {
			toast({
				title: 'Already Saved',
				description: 'This search is already in your saved searches.',
			});
			return;
		}
		const name =
			[
				filters.location && filters.location,
				filters.budgetRange &&
					`$${filters.budgetRange[0]}-${filters.budgetRange[1]}`,
				filters.roomType.length > 0 && filters.roomType.join(', '),
				filters.lifestyle.length > 0 && filters.lifestyle.join(', '),
			]
				.filter(Boolean)
				.join(', ') || 'Custom Search';
		const newSearch = {
			id: Date.now().toString(),
			name,
			filters: { ...filters },
			createdAt: new Date().toISOString().slice(0, 10),
			notificationEnabled: false,
		};
		updateProfile({ savedSearches: [...savedSearches, newSearch] });
		toast({
			title: 'Search Saved',
			description: 'You can manage saved searches in your settings.',
		});
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
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
						<div>
							<h2 className="text-xl font-semibold">
								{filteredRoommates.length} Roommate
								{filteredRoommates.length !== 1 ? 's' : ''} Found
							</h2>
							<p className="text-sm text-muted-foreground">
								Find your perfect roommate match
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleSaveSearch}
							className="whitespace-nowrap"
						>
							Save Search
						</Button>
					</div>

					{/* Roommate Grid */}
					{filteredRoommates.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredRoommates.map((roommate) => (
								<Card
									key={roommate.id}
									className="group overflow-hidden border hover:border-vibrant-orange/20 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full min-h-0"
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
														<DollarSign className="h-3 w-3" />${roommate.budget}
														/mo
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
									<CardContent className="flex flex-col flex-1 min-h-0 overflow-y-auto p-4">
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

										<div className="flex w-full justify-between items-center gap-2 mt-auto">
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															size="icon"
															variant={
																user?.likedUserIds?.includes(
																	roommate.id.toString()
																)
																	? 'default'
																	: 'outline'
															}
															onClick={(e) => {
																e.stopPropagation();
																if (!user) return;
																if (
																	user.likedUserIds?.includes(
																		roommate.id.toString()
																	)
																)
																	return;
																updateProfile({
																	likedUserIds: [
																		...(user.likedUserIds || []),
																		roommate.id.toString(),
																	],
																});
															}}
															disabled={user?.likedUserIds?.includes(
																roommate.id.toString()
															)}
															aria-label="Like"
														>
															<span role="img" aria-label="Like">
																❤️
															</span>
														</Button>
													</TooltipTrigger>
													<TooltipContent>Like</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
														<span className="mx-auto">
											<Button
																size="icon"
																className="bg-vibrant-orange hover:bg-orange-600"
																disabled={
																	!(
																		user?.likedUserIds?.includes(
																			roommate.id.toString()
																		) &&
																		roommate.likedUserIds?.includes(user.id)
																	)
																}
												onClick={(e) => {
													e.stopPropagation();
													handleContact(roommate.id);
												}}
																aria-label="Message"
											>
																<span role="img" aria-label="Message">
																	💬
																</span>
											</Button>
														</span>
													</TooltipTrigger>
													<TooltipContent>Message</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
											<Button
															size="icon"
												variant="outline"
												onClick={(e) => {
													e.stopPropagation();
													router.push(`/roommate/${roommate.id}`);
												}}
															aria-label="View Profile"
											>
															<span role="img" aria-label="View Profile">
																👁️
															</span>
											</Button>
													</TooltipTrigger>
													<TooltipContent>View Profile</TooltipContent>
												</Tooltip>
											</TooltipProvider>
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
									onClick={() =>
										setFilters({
										budgetRange: [500, 3000],
										ageRange: [18, 65],
										location: '',
										moveInDate: '',
										roomType: [],
										lifestyle: [],
										verified: false,
										hasPhotos: false,
										})
									}
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
									<p>
										• Use lifestyle filters to find roommates with compatible
										habits
									</p>
									<p>• Set a realistic budget range to see more options</p>
									<p>• Consider roommates in nearby areas for more choices</p>
									<p>
										• Verified profiles have gone through our identity
										verification process
									</p>
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
