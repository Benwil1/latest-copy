'use client';

import MobileNav from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
	Calendar,
	CheckCircle,
	DollarSign,
	Filter,
	MapPin,
	Search,
	Sparkles,
	Star,
	Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
}

// Sample roommate data
const roommates: Roommate[] = [
	{
		id: 1,
		name: 'Sarah Johnson',
		age: 26,
		image:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1200,
		location: 'Downtown',
		moveIn: 'Immediate',
		compatibility: 92,
		verified: true,
		tags: ['Non-smoker', 'Pet-friendly', 'Early bird', 'Professional'],
		bio: 'Software engineer looking for a clean and quiet space. Love cooking and hiking on weekends.',
	},
	{
		id: 2,
		name: 'Michael Chen',
		age: 28,
		image:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1500,
		location: 'Midtown',
		moveIn: 'Next month',
		compatibility: 85,
		verified: true,
		tags: ['Student', 'Night owl', 'Vegetarian', 'Music lover'],
		bio: 'Graduate student in Computer Science. Clean, respectful, and always up for good conversations.',
	},
	{
		id: 3,
		name: 'Emma Rodriguez',
		age: 24,
		image:
			'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1100,
		location: 'Westside',
		moveIn: 'Flexible',
		compatibility: 78,
		verified: false,
		tags: ['Creative', 'Pet owner', 'Relaxed', 'Social'],
		bio: '',
	},
	{
		id: 4,
		name: 'David Kim',
		age: 29,
		image:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1600,
		location: 'Uptown',
		moveIn: 'Next month',
		compatibility: 73,
		verified: true,
		tags: ['Non-smoker', 'Clean', 'Professional', 'Quiet'],
		bio: '',
	},
	{
		id: 5,
		name: 'Olivia Martinez',
		age: 25,
		image:
			'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1300,
		location: 'Downtown',
		moveIn: 'Immediate',
		compatibility: 88,
		verified: true,
		tags: ['Non-smoker', 'Student', 'Social', 'Clean'],
		bio: '',
	},
];

export default function ExplorePage() {
	const router = useRouter();
	const [showFilters, setShowFilters] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showBoostDialog, setShowBoostDialog] = useState(false);

	const filteredRoommates = roommates.filter(
		(roommate) =>
			roommate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			roommate.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
			roommate.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	return (
		<div className="min-h-screen pb-20 sm:pb-16">
			<header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10">
				<div className="p-4 flex justify-between items-center max-w-7xl mx-auto">
					<div className="text-xl font-bold text-vibrant-orange">
						RoomieMatch
					</div>
					<ModeToggle />
				</div>
			</header>

			<main className="pt-20">
				<div className="container max-w-7xl mx-auto px-4">
					<h1 className="text-2xl font-bold mb-6">Explore Roommates</h1>

					<div className="relative mb-8">
						<div className="flex gap-2 items-center">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									type="text"
									placeholder="Search by name, location, or interests..."
									className="pl-9 pr-4 h-12 w-full rounded-full bg-muted/50 border-0 focus:ring-0 focus:ring-offset-0"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									'h-12 w-12 rounded-full',
									showFilters
										? 'bg-vibrant-orange text-white hover:bg-vibrant-orange/90'
										: 'bg-muted/50 text-muted-foreground hover:bg-muted/70'
								)}
								onClick={() => setShowFilters(!showFilters)}
							>
								<Filter className="h-5 w-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="h-12 w-12 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted/70"
								onClick={() => setShowBoostDialog(true)}
							>
								<Sparkles className="h-5 w-5" />
							</Button>
						</div>
					</div>

					{showFilters && (
						<Card className="mb-4 animate-fade-in">
							<CardHeader className="p-3">
								<CardTitle className="text-base">Filters</CardTitle>
								<CardDescription className="text-xs">
									Refine your search
								</CardDescription>
							</CardHeader>
							<CardContent className="p-3 pt-0 space-y-3">
								<div className="space-y-1">
									<label className="text-xs font-medium">Budget Range</label>
									<div className="flex items-center gap-2">
										<Input
											placeholder="Min"
											type="number"
											className="w-1/2 h-7 text-xs"
										/>
										<span className="text-xs">-</span>
										<Input
											placeholder="Max"
											type="number"
											className="w-1/2 h-7 text-xs"
										/>
									</div>
								</div>

								<div className="space-y-1">
									<label className="text-xs font-medium">Location</label>
									<Input placeholder="Enter location" className="h-7 text-xs" />
								</div>

								<div className="space-y-1">
									<label className="text-xs font-medium">
										Move-in Date Range
									</label>
									<div className="flex items-center gap-2">
										<Input
											type="date"
											className="w-1/2 h-7 text-xs"
											placeholder="From"
										/>
										<span className="text-xs">-</span>
										<Input
											type="date"
											className="w-1/2 h-7 text-xs"
											placeholder="To"
										/>
									</div>
								</div>

								<div className="space-y-1">
									<label className="text-xs font-medium">
										Living Space Type
									</label>
									<div className="flex flex-wrap gap-1">
										<Button
											variant="outline"
											size="sm"
											className="rounded-full h-6 text-[10px] px-2 py-0"
										>
											Private Room
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="rounded-full h-6 text-[10px] px-2 py-0"
										>
											Shared Room
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="rounded-full h-6 text-[10px] px-2 py-0"
										>
											Entire Apartment
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="rounded-full h-6 text-[10px] px-2 py-0"
										>
											Studio
										</Button>
									</div>
								</div>

								<div className="pt-1 flex justify-between">
									<Button variant="outline" className="h-7 text-xs">
										Reset
									</Button>
									<Button variant="orange" className="h-7 text-xs">
										Apply Filters
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					<div className="flex justify-between items-center mb-3">
						<h2 className="text-base font-semibold">Explore Roommates</h2>
					</div>

					<div className="grid grid-cols-1 gap-4">
						{filteredRoommates.map((roommate) => (
							<div
								key={roommate.id}
								className="bg-card rounded-xl overflow-hidden border hover:border-vibrant-orange/20 transition-colors cursor-pointer"
								onClick={() => router.push(`/roommate/${roommate.id}`)}
							>
								<div className="aspect-[4/5] relative">
									<img
										src={roommate.image}
										alt={roommate.name}
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
									<div className="absolute top-2 right-2 flex gap-2">
										{roommate.verified && (
											<Badge
												variant="secondary"
												className="bg-background/80 backdrop-blur-sm"
											>
												Verified
											</Badge>
										)}
										<Badge variant="orange" className="text-xs">
											{roommate.compatibility}% Match
										</Badge>
									</div>
									<div className="absolute bottom-0 left-0 right-0 p-4">
										<h2 className="text-xl font-semibold text-white mb-2">
											{roommate.name}, {roommate.age}
										</h2>
										<div className="flex items-center gap-4 text-sm text-white/90">
											<span>${roommate.budget}/mo</span>
											<span>{roommate.location}</span>
											<span>{roommate.moveIn}</span>
										</div>
										<div className="flex flex-wrap gap-2 mt-3">
											{roommate.tags.map((tag, index) => (
												<Badge
													key={index}
													variant="secondary"
													className="text-xs bg-background/80 backdrop-blur-sm"
												>
													{tag}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</div>
						))}

						{filteredRoommates.length === 0 && (
							<div className="text-center py-12 text-muted-foreground">
								<p className="text-lg mb-2">No roommates found</p>
								<p className="text-sm">
									Try adjusting your filters or search criteria
								</p>
							</div>
						)}
					</div>
				</div>
			</main>

			{showBoostDialog && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
					<Card className="w-full max-w-xs animate-bounce-in">
						<CardHeader className="p-3">
							<CardTitle className="text-base flex items-center gap-1">
								<Zap className="h-4 w-4 text-amber-500" />
								Boost Your Profile
							</CardTitle>
							<CardDescription className="text-xs">
								Get more visibility and matches
							</CardDescription>
						</CardHeader>
						<CardContent className="p-3 pt-0 space-y-3">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
										<Zap className="h-4 w-4 text-amber-500" />
									</div>
									<div>
										<h3 className="text-xs font-medium">24-Hour Boost</h3>
										<p className="text-[10px] text-muted-foreground">
											Your profile will be shown to 10x more people
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									<div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
										<Star className="h-4 w-4 text-amber-500" />
									</div>
									<div>
										<h3 className="text-xs font-medium">Priority Matching</h3>
										<p className="text-[10px] text-muted-foreground">
											Your profile will appear at the top of search results
										</p>
									</div>
								</div>
							</div>

							<div className="flex gap-2">
								<Button
									variant="outline"
									className="flex-1 h-8 text-xs"
									onClick={() => setShowBoostDialog(false)}
								>
									Cancel
								</Button>
								<Button variant="orange" className="flex-1 pulse h-8 text-xs">
									Boost Now
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			<MobileNav />
		</div>
	);
}
