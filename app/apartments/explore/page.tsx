'use client';

import {
	ApartmentFilters,
	type FilterValues,
} from '@/app/apartments/components/apartment-filters';
import { BoostDialog } from '@/components/boost-dialog';
import MobileNav from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
	ArrowLeft,
	CheckCircle,
	Filter,
	Search,
	Sparkles,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Sample apartment listings data
const apartments = [
	{
		id: 1,
		title: 'Modern Studio in Downtown',
		image:
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		price: 1200,
		location: 'Downtown',
		moveIn: 'Immediate',
		isVerified: true,
		tags: ['Furnished', 'Pet-friendly', 'Utilities Included'],
	},
	{
		id: 2,
		title: 'Spacious 2-Bed in Midtown',
		image:
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		price: 1500,
		location: 'Midtown',
		moveIn: 'Next month',
		isVerified: true,
		tags: ['Parking', 'Gym', 'Balcony'],
	},
	{
		id: 3,
		title: 'Cozy 1-Bedroom with View',
		image:
			'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		price: 1100,
		location: 'Westside',
		moveIn: 'Flexible',
		isVerified: false,
		tags: ['City View', 'Dishwasher', 'Storage'],
	},
	{
		id: 4,
		title: 'Luxury Loft Apartment',
		image:
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		price: 1600,
		location: 'Uptown',
		moveIn: 'Next month',
		isVerified: true,
		tags: ['High Ceiling', 'Modern', 'Security'],
	},
];

const initialFilters: FilterValues = {
	budgetRange: ['', ''],
	location: '',
	moveInDateRange: ['', ''],
	livingSpaceType: [],
};

export default function ExplorePage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [showFilters, setShowFilters] = useState(false);
	const [showBoostDialog, setShowBoostDialog] = useState(false);
	const [filters, setFilters] = useState<FilterValues>(initialFilters);
	const router = useRouter();

	// Filter apartments based on search term and filters
	const filteredApartments = apartments.filter((apt) => {
		// Search term filter
		const matchesSearch =
			apt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			apt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
			apt.tags.some((tag) =>
				tag.toLowerCase().includes(searchQuery.toLowerCase())
			);

		// Budget range filter
		const minBudget = filters.budgetRange[0]
			? Number(filters.budgetRange[0])
			: 0;
		const maxBudget = filters.budgetRange[1]
			? Number(filters.budgetRange[1])
			: Infinity;
		const matchesBudget = apt.price >= minBudget && apt.price <= maxBudget;

		// Location filter
		const matchesLocation =
			!filters.location ||
			apt.location.toLowerCase().includes(filters.location.toLowerCase());

		return matchesSearch && matchesBudget && matchesLocation;
	});

	return (
		<div className="min-h-screen pb-20 sm:pb-16">
			<main>
				{/* Segmented Navigation */}
				<div className="px-4 mb-6 pt-4">
					<div className="max-w-2xl mx-auto">
						<div className="flex rounded-full bg-muted p-1 shadow-sm">
							<Link
								href="/apartments/explore"
								className="flex-1 flex items-center justify-center px-4 py-3 rounded-full bg-background text-foreground font-medium shadow-sm"
							>
								Explore Apartments
							</Link>
							<Link
								href="/apartments/post"
								className="flex-1 flex items-center justify-center px-4 py-3 rounded-full text-muted-foreground hover:text-foreground transition-colors"
							>
								Post an Apartment
							</Link>
						</div>
					</div>
				</div>

				<div className="container max-w-7xl mx-auto px-4">
					<div className="relative mb-8">
						<div className="flex gap-2 items-center">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									type="text"
									placeholder="Search by location, amenities, or tags..."
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

						{showFilters && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border shadow-lg z-50">
								<div className="p-4">
									<h3 className="text-lg font-semibold mb-4">Filters</h3>

									{/* Price Range */}
									<div className="mb-4">
										<label className="text-sm font-medium mb-2 block">
											Price Range
										</label>
										<div className="flex gap-2">
											<Input
												type="number"
												placeholder="Min"
												value={filters.budgetRange[0]}
												onChange={(e) =>
													setFilters({
														...filters,
														budgetRange: [
															e.target.value,
															filters.budgetRange[1],
														],
													})
												}
												className="flex-1"
											/>
											<Input
												type="number"
												placeholder="Max"
												value={filters.budgetRange[1]}
												onChange={(e) =>
													setFilters({
														...filters,
														budgetRange: [
															filters.budgetRange[0],
															e.target.value,
														],
													})
												}
												className="flex-1"
											/>
										</div>
									</div>

									{/* Location */}
									<div className="mb-4">
										<label className="text-sm font-medium mb-2 block">
											Location
										</label>
										<Input
											placeholder="Enter location"
											value={filters.location}
											onChange={(e) =>
												setFilters({
													...filters,
													location: e.target.value,
												})
											}
										/>
									</div>

									{/* Action Buttons */}
									<div className="flex justify-end gap-2 mt-6">
										<Button
											variant="outline"
											onClick={() => {
												setFilters(initialFilters);
												setShowFilters(false);
											}}
										>
											Reset
										</Button>
										<Button
											className="bg-vibrant-orange hover:bg-orange-600"
											onClick={() => setShowFilters(false)}
										>
											Apply Filters
										</Button>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{filteredApartments.map((apartment) => (
							<div
								key={apartment.id}
								className="bg-card rounded-xl overflow-hidden border hover:border-blue-500/20 transition-colors"
							>
								<div className="aspect-video relative">
									<img
										src={apartment.image}
										alt={apartment.title}
										className="w-full h-full object-cover"
									/>
									{apartment.isVerified && (
										<Badge
											variant="secondary"
											className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
										>
											Verified
										</Badge>
									)}
								</div>
								<div className="p-4">
									<div className="mb-2">
										<h2 className="text-lg font-semibold line-clamp-1 flex items-center gap-1">
											{apartment.title}
											{apartment.isVerified && (
												<CheckCircle className="h-4 w-4 text-vibrant-orange shrink-0" />
											)}
										</h2>
										<div className="flex items-center gap-4 text-sm text-muted-foreground">
											<span>${apartment.price}/mo</span>
											<span>{apartment.location}</span>
											<span>{apartment.moveIn}</span>
										</div>
									</div>

									<div className="flex flex-wrap gap-2 mb-4">
										{apartment.tags.map((tag, index) => (
											<Badge key={index} variant="outline" className="text-xs">
												{tag}
											</Badge>
										))}
									</div>

									<Button
										className="w-full bg-vibrant-orange hover:bg-orange-600"
										asChild
									>
										<Link href={`/apartments/${apartment.id}`}>
											View Listing
										</Link>
									</Button>
								</div>
							</div>
						))}

						{filteredApartments.length === 0 && (
							<div className="col-span-full text-center py-12 text-muted-foreground">
								<p className="text-lg mb-2">No apartments found</p>
								<p className="text-sm">
									Try adjusting your filters or search criteria
								</p>
							</div>
						)}
					</div>
				</div>
			</main>

			<MobileNav />

			<BoostDialog
				isOpen={showBoostDialog}
				onClose={() => setShowBoostDialog(false)}
			/>
		</div>
	);
}
