'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export interface FilterValues {
	budgetRange: [string, string];
	location: string;
	moveInDateRange: [string, string];
	livingSpaceType: string[];
}

interface ApartmentFiltersProps {
	isOpen: boolean;
	onClose: () => void;
	filters: FilterValues;
	onChange: (filters: FilterValues) => void;
}

export function ApartmentFilters({
	isOpen,
	onClose,
	filters,
	onChange,
}: ApartmentFiltersProps) {
	if (!isOpen) return null;

	return (
		<div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border shadow-lg z-50">
			<div className="p-4">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">Filters</h3>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={onClose}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Price Range */}
				<div className="mb-4">
					<label className="text-sm font-medium mb-2 block">Price Range</label>
					<div className="flex gap-2">
						<Input
							type="number"
							placeholder="Min"
							value={filters.budgetRange[0]}
							onChange={(e) =>
								onChange({
									...filters,
									budgetRange: [e.target.value, filters.budgetRange[1]],
								})
							}
							className="flex-1"
						/>
						<Input
							type="number"
							placeholder="Max"
							value={filters.budgetRange[1]}
							onChange={(e) =>
								onChange({
									...filters,
									budgetRange: [filters.budgetRange[0], e.target.value],
								})
							}
							className="flex-1"
						/>
					</div>
				</div>

				{/* Location */}
				<div className="mb-4">
					<label className="text-sm font-medium mb-2 block">Location</label>
					<Input
						placeholder="Enter location"
						value={filters.location}
						onChange={(e) =>
							onChange({
								...filters,
								location: e.target.value,
							})
						}
					/>
				</div>

				{/* Move-in Date */}
				<div className="mb-4">
					<label className="text-sm font-medium mb-2 block">
						Move-in Date Range
					</label>
					<div className="flex gap-2">
						<Input
							type="date"
							value={filters.moveInDateRange[0]}
							onChange={(e) =>
								onChange({
									...filters,
									moveInDateRange: [e.target.value, filters.moveInDateRange[1]],
								})
							}
							className="flex-1"
						/>
						<Input
							type="date"
							value={filters.moveInDateRange[1]}
							onChange={(e) =>
								onChange({
									...filters,
									moveInDateRange: [filters.moveInDateRange[0], e.target.value],
								})
							}
							className="flex-1"
						/>
					</div>
				</div>

				{/* Living Space Type */}
				<div className="mb-4">
					<label className="text-sm font-medium mb-2 block">
						Living Space Type
					</label>
					<div className="flex flex-wrap gap-2">
						{['Studio', 'Apartment', 'House', 'Room'].map((type) => (
							<Button
								key={type}
								variant={
									filters.livingSpaceType.includes(type) ? 'default' : 'outline'
								}
								size="sm"
								onClick={() => {
									const newTypes = filters.livingSpaceType.includes(type)
										? filters.livingSpaceType.filter((t) => t !== type)
										: [...filters.livingSpaceType, type];
									onChange({
										...filters,
										livingSpaceType: newTypes,
									});
								}}
							>
								{type}
							</Button>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-end gap-2 mt-6">
					<Button
						variant="outline"
						onClick={() => {
							onChange({
								budgetRange: ['', ''],
								location: '',
								moveInDateRange: ['', ''],
								livingSpaceType: [],
							});
							onClose();
						}}
					>
						Reset
					</Button>
					<Button
						className="bg-vibrant-orange hover:bg-orange-600"
						onClick={onClose}
					>
						Apply Filters
					</Button>
				</div>
			</div>
		</div>
	);
}
