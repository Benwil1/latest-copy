'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
	Filter,
	MapPin,
	Search,
	X,
	DollarSign,
	Calendar,
	Home,
	Users,
	Sparkles,
} from 'lucide-react';
import { useState } from 'react';

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

interface EnhancedSearchProps {
	onFiltersChange: (filters: SearchFilters) => void;
	className?: string;
}

export function EnhancedSearch({ onFiltersChange, className }: EnhancedSearchProps) {
	const [showFilters, setShowFilters] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
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

	const roomTypes = [
		'Private Room',
		'Shared Room',
		'Entire Apartment',
		'Studio',
		'House',
	];

	const lifestyleOptions = [
		'Non-smoker',
		'Pet-friendly',
		'Early riser',
		'Night owl',
		'Social',
		'Quiet',
		'Clean',
		'Vegetarian',
		'Student',
		'Professional',
	];

	const toggleArrayFilter = (array: string[], value: string) => {
		return array.includes(value)
			? array.filter(item => item !== value)
			: [...array, value];
	};

	const updateFilters = (newFilters: Partial<SearchFilters>) => {
		const updatedFilters = { ...filters, ...newFilters };
		setFilters(updatedFilters);
		onFiltersChange(updatedFilters);
	};

	const clearFilters = () => {
		const clearedFilters: SearchFilters = {
			budgetRange: [500, 3000],
			ageRange: [18, 65],
			location: '',
			moveInDate: '',
			roomType: [],
			lifestyle: [],
			verified: false,
			hasPhotos: false,
		};
		setFilters(clearedFilters);
		onFiltersChange(clearedFilters);
		setSearchQuery('');
	};

	const activeFiltersCount = 
		(filters.roomType.length > 0 ? 1 : 0) +
		(filters.lifestyle.length > 0 ? 1 : 0) +
		(filters.location ? 1 : 0) +
		(filters.moveInDate ? 1 : 0) +
		(filters.verified ? 1 : 0) +
		(filters.hasPhotos ? 1 : 0) +
		(filters.budgetRange[0] !== 500 || filters.budgetRange[1] !== 3000 ? 1 : 0) +
		(filters.ageRange[0] !== 18 || filters.ageRange[1] !== 65 ? 1 : 0);

	return (
		<div className={cn('space-y-4', className)}>
			{/* Search Bar */}
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
							'h-12 w-12 rounded-full relative',
							showFilters
								? 'bg-vibrant-orange text-white hover:bg-vibrant-orange/90'
								: 'bg-muted/50 text-muted-foreground hover:bg-muted/70'
						)}
						onClick={() => setShowFilters(!showFilters)}
					>
						<Filter className="h-5 w-5" />
						{activeFiltersCount > 0 && (
							<Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-600">
								{activeFiltersCount}
							</Badge>
						)}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-12 w-12 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted/70"
						title="Premium Search Coming Soon"
					>
						<Sparkles className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* Advanced Filters */}
			{showFilters && (
				<Card className="animate-in slide-in-from-top-2 duration-200 shadow-lg">
					<CardContent className="p-6 space-y-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold">Advanced Filters</h3>
							<div className="flex gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={clearFilters}
									className="text-muted-foreground hover:text-foreground"
								>
									Clear All
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setShowFilters(false)}
									className="h-8 w-8"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Budget Range */}
						<div className="space-y-3">
							<Label className="text-sm font-medium flex items-center gap-2">
								<DollarSign className="h-4 w-4 text-vibrant-orange" />
								Budget Range
							</Label>
							<div className="px-3">
								<Slider
									value={filters.budgetRange}
									onValueChange={(value) => updateFilters({ budgetRange: value as [number, number] })}
									max={5000}
									min={0}
									step={50}
									className="w-full"
								/>
								<div className="flex justify-between text-sm text-muted-foreground mt-1">
									<span>${filters.budgetRange[0]}</span>
									<span>${filters.budgetRange[1]}</span>
								</div>
							</div>
						</div>

						{/* Age Range */}
						<div className="space-y-3">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Users className="h-4 w-4 text-vibrant-orange" />
								Age Range
							</Label>
							<div className="px-3">
								<Slider
									value={filters.ageRange}
									onValueChange={(value) => updateFilters({ ageRange: value as [number, number] })}
									max={65}
									min={18}
									step={1}
									className="w-full"
								/>
								<div className="flex justify-between text-sm text-muted-foreground mt-1">
									<span>{filters.ageRange[0]} years</span>
									<span>{filters.ageRange[1]} years</span>
								</div>
							</div>
						</div>

						{/* Location */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<MapPin className="h-4 w-4 text-vibrant-orange" />
								Location
							</Label>
							<Input
								placeholder="Enter preferred location"
								value={filters.location}
								onChange={(e) => updateFilters({ location: e.target.value })}
							/>
						</div>

						{/* Move-in Date */}
						<div className="space-y-2">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Calendar className="h-4 w-4 text-vibrant-orange" />
								Move-in Date (by)
							</Label>
							<Input
								type="date"
								value={filters.moveInDate}
								onChange={(e) => updateFilters({ moveInDate: e.target.value })}
							/>
						</div>

						{/* Room Type */}
						<div className="space-y-3">
							<Label className="text-sm font-medium flex items-center gap-2">
								<Home className="h-4 w-4 text-vibrant-orange" />
								Room Type
							</Label>
							<div className="flex flex-wrap gap-2">
								{roomTypes.map((type) => (
									<Button
										key={type}
										variant={filters.roomType.includes(type) ? 'default' : 'outline'}
										size="sm"
										className={cn(
											"text-xs",
											filters.roomType.includes(type) && "bg-vibrant-orange hover:bg-orange-600"
										)}
										onClick={() => updateFilters({ 
											roomType: toggleArrayFilter(filters.roomType, type) 
										})}
									>
										{type}
									</Button>
								))}
							</div>
						</div>

						{/* Lifestyle Preferences */}
						<div className="space-y-3">
							<Label className="text-sm font-medium">Lifestyle Preferences</Label>
							<div className="flex flex-wrap gap-2">
								{lifestyleOptions.map((option) => (
									<Button
										key={option}
										variant={filters.lifestyle.includes(option) ? 'default' : 'outline'}
										size="sm"
										className={cn(
											"text-xs",
											filters.lifestyle.includes(option) && "bg-vibrant-orange hover:bg-orange-600"
										)}
										onClick={() => updateFilters({ 
											lifestyle: toggleArrayFilter(filters.lifestyle, option) 
										})}
									>
										{option}
									</Button>
								))}
							</div>
						</div>

						{/* Quick Filters */}
						<div className="space-y-4 pt-4 border-t">
							<Label className="text-sm font-medium">Quick Filters</Label>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<Label htmlFor="verified" className="text-sm flex items-center gap-2">
										<div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
											<span className="text-xs text-white">✓</span>
										</div>
										Verified profiles only
									</Label>
									<Switch
										id="verified"
										checked={filters.verified}
										onCheckedChange={(checked) => updateFilters({ verified: checked })}
									/>
								</div>
								<div className="flex items-center justify-between">
									<Label htmlFor="hasPhotos" className="text-sm flex items-center gap-2">
										<div className="h-4 w-4 rounded bg-blue-500 flex items-center justify-center">
											<span className="text-xs text-white">📷</span>
										</div>
										Has profile photos
									</Label>
									<Switch
										id="hasPhotos"
										checked={filters.hasPhotos}
										onCheckedChange={(checked) => updateFilters({ hasPhotos: checked })}
									/>
								</div>
							</div>
						</div>

						{/* Apply Filters Button */}
						<div className="pt-4 border-t">
							<Button 
								className="w-full bg-vibrant-orange hover:bg-orange-600"
								onClick={() => setShowFilters(false)}
							>
								Apply Filters ({activeFiltersCount} active)
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Active Filters Display */}
			{activeFiltersCount > 0 && (
				<div className="flex flex-wrap gap-2">
					{filters.roomType.map((type) => (
						<Badge key={type} variant="secondary" className="flex items-center gap-1">
							🏠 {type}
							<X 
								className="h-3 w-3 cursor-pointer hover:text-red-500" 
								onClick={() => updateFilters({ 
									roomType: filters.roomType.filter(t => t !== type) 
								})}
							/>
						</Badge>
					))}
					{filters.lifestyle.map((lifestyle) => (
						<Badge key={lifestyle} variant="secondary" className="flex items-center gap-1">
							✨ {lifestyle}
							<X 
								className="h-3 w-3 cursor-pointer hover:text-red-500" 
								onClick={() => updateFilters({ 
									lifestyle: filters.lifestyle.filter(l => l !== lifestyle) 
								})}
							/>
						</Badge>
					))}
					{filters.location && (
						<Badge variant="secondary" className="flex items-center gap-1">
							📍 {filters.location}
							<X 
								className="h-3 w-3 cursor-pointer hover:text-red-500" 
								onClick={() => updateFilters({ location: '' })}
							/>
						</Badge>
					)}
					{filters.verified && (
						<Badge variant="secondary" className="flex items-center gap-1">
							✅ Verified
							<X 
								className="h-3 w-3 cursor-pointer hover:text-red-500" 
								onClick={() => updateFilters({ verified: false })}
							/>
						</Badge>
					)}
					{filters.hasPhotos && (
						<Badge variant="secondary" className="flex items-center gap-1">
							📷 Has Photos
							<X 
								className="h-3 w-3 cursor-pointer hover:text-red-500" 
								onClick={() => updateFilters({ hasPhotos: false })}
							/>
						</Badge>
					)}
					{(filters.budgetRange[0] !== 500 || filters.budgetRange[1] !== 3000) && (
						<Badge variant="secondary" className="flex items-center gap-1">
							💰 ${filters.budgetRange[0]}-${filters.budgetRange[1]}
							<X 
								className="h-3 w-3 cursor-pointer hover:text-red-500" 
								onClick={() => updateFilters({ budgetRange: [500, 3000] })}
							/>
						</Badge>
					)}
					{(filters.ageRange[0] !== 18 || filters.ageRange[1] !== 65) && (
						<Badge variant="secondary" className="flex items-center gap-1">
							👥 {filters.ageRange[0]}-{filters.ageRange[1]} years
							<X 
								className="h-3 w-3 cursor-pointer hover:text-red-500" 
								onClick={() => updateFilters({ ageRange: [18, 65] })}
							/>
						</Badge>
					)}
				</div>
			)}
		</div>
	);
}