'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ArrowLeft, CheckCircle, Filter, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Sample roommates data
const roommates = [
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
	},
	// Add more roommate data here
];

export default function ExploreRoommatesPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [showFilters, setShowFilters] = useState(false);
	const [showBoostDialog, setShowBoostDialog] = useState(false);
	const router = useRouter();

	// Filter roommates based on search query
	const filteredRoommates = roommates.filter((roommate) => {
		const searchLower = searchQuery.toLowerCase();
		return (
			roommate.name.toLowerCase().includes(searchLower) ||
			roommate.location.toLowerCase().includes(searchLower) ||
			roommate.tags.some((tag) => tag.toLowerCase().includes(searchLower))
		);
	});

	return (
		<div className="min-h-screen pb-20 sm:pb-16">
			<main className="container max-w-2xl mx-auto px-4">
				<div className="relative">
					<div className="flex gap-2 items-center">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								type="text"
								placeholder="Search by name, location, or interests..."
								className="pl-9 pr-4 w-full h-12 rounded-full bg-muted/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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

				<div className="space-y-4 mt-6">
					{filteredRoommates.map((roommate) => (
						<div
							key={roommate.id}
							className="bg-card rounded-xl overflow-hidden border hover:border-blue-500/20 transition-colors"
							onClick={() => router.push(`/roommate/${roommate.id}`)}
						>
							<div className="p-4">
								<div className="flex items-start gap-4">
									<div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0">
										<img
											src={roommate.image}
											alt={roommate.name}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between mb-2">
											<h2 className="text-lg font-semibold truncate">
												{roommate.name}, {roommate.age}
											</h2>
											<div className="flex items-center gap-2">
												{roommate.verified && (
													<Badge
														variant="secondary"
														className="bg-background/80"
													>
														Verified
													</Badge>
												)}
												<Badge variant="orange" className="text-xs">
													{roommate.compatibility}% Match
												</Badge>
											</div>
										</div>
										<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
											<span>${roommate.budget}/mo</span>
											<span>{roommate.location}</span>
											<span>{roommate.moveIn}</span>
										</div>
										<div className="flex flex-wrap gap-2">
											{roommate.tags.map((tag, index) => (
												<Badge
													key={index}
													variant="secondary"
													className="text-xs"
												>
													{tag}
												</Badge>
											))}
										</div>
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
			</main>
		</div>
	);
}
