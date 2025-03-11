'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMarketplace } from '@/context/marketplace-context';
import { useToast } from '@/hooks/use-toast';
import {
	AlertCircle,
	Bath,
	BedDouble,
	Calendar,
	Edit,
	Eye,
	Home,
	MapPin,
	MessageSquare,
	MoreHorizontal,
	Trash,
} from 'lucide-react';
import Link from 'next/link';

export default function UserListings() {
	const { userListings } = useMarketplace();
	const { toast } = useToast();

	const handleDeleteClick = () => {
		toast({
			title: 'Not implemented',
			description: 'This feature is not implemented in the demo.',
			duration: 3000,
		});
	};

	// Update the user listings component for better mobile responsiveness
	return (
		<div className="space-y-3 sm:space-y-4">
			{userListings.length > 0 ? (
				userListings.map((listing) => (
					<Card key={listing.id} className="overflow-hidden">
						<div className="flex flex-col sm:flex-row">
							<div className="w-full sm:w-1/4 h-40 sm:h-auto">
								<img
									src={listing.image || '/placeholder.svg'}
									alt={listing.title}
									className="h-full w-full object-cover"
								/>
							</div>

							<CardContent className="flex-1 p-3 sm:p-5">
								<div className="flex flex-col md:flex-row md:items-start justify-between gap-2 sm:gap-4">
									<div className="space-y-1 sm:space-y-2">
										<div className="flex items-center justify-between">
											<h3 className="text-base sm:text-lg font-semibold">
												{listing.title}
											</h3>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-7 w-7 sm:hidden"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem asChild>
														<Link
															href={`/listing/${listing.id}`}
															className="cursor-pointer"
														>
															<Eye className="mr-2 h-4 w-4" />
															<span>View</span>
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem asChild>
														<Link
															href={`/edit-listing/${listing.id}`}
															className="cursor-pointer"
														>
															<Edit className="mr-2 h-4 w-4" />
															<span>Edit</span>
														</Link>
													</DropdownMenuItem>
													<DropdownMenuItem
														className="text-destructive"
														onClick={handleDeleteClick}
													>
														<Trash className="mr-2 h-4 w-4" />
														<span>Delete</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>

										<div className="flex items-center text-muted-foreground">
											<MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
											<span className="text-xs sm:text-sm">
												{listing.location}
											</span>
										</div>

										<div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
											<div className="flex items-center">
												<BedDouble className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
												<span>
													{listing.beds} {listing.beds === 1 ? 'Bed' : 'Beds'}
												</span>
											</div>
											<div className="flex items-center">
												<Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
												<span>
													{listing.baths}{' '}
													{listing.baths === 1 ? 'Bath' : 'Baths'}
												</span>
											</div>
											<div className="flex items-center">
												<Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
												<span>Available: {listing.available}</span>
											</div>
										</div>

										<Badge
											className={`text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-0.5 ${
												listing.verified
													? 'bg-green-500 hover:bg-green-600 dark:bg-green-600/90 dark:hover:bg-green-700/90'
													: 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600/90 dark:hover:bg-yellow-700/90'
											}`}
										>
											{listing.verified ? 'Active' : 'Pending Verification'}
										</Badge>
										<span className="text-xs sm:text-sm text-muted-foreground">
											${listing.price}/month
										</span>
									</div>

									<div className="hidden md:flex flex-col items-end gap-2">
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												className="text-xs h-8"
												asChild
											>
												<Link href={`/listing/${listing.id}`}>
													<Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
													View
												</Link>
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="text-xs h-8"
												asChild
											>
												<Link href={`/edit-listing/${listing.id}`}>
													<Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
													Edit
												</Link>
											</Button>
										</div>

										{listing.verified ? (
											<div className="text-xs text-muted-foreground">
												<div className="flex items-center gap-1">
													<Eye className="h-3 w-3" />
													<span>124 views</span>
												</div>
												<div className="flex items-center gap-1">
													<MessageSquare className="h-3 w-3" />
													<span>8 inquiries</span>
												</div>
											</div>
										) : (
											<div className="flex items-center text-xs text-yellow-600">
												<AlertCircle className="h-3 w-3 mr-1" />
												<span>Awaiting verification</span>
											</div>
										)}
									</div>

									{/* Mobile action buttons */}
									<div className="flex justify-end gap-2 mt-2 sm:hidden">
										<Button
											variant="outline"
											size="sm"
											className="h-7 text-xs px-2"
											asChild
										>
											<Link href={`/listing/${listing.id}`}>
												<Eye className="mr-1 h-3 w-3" />
												View
											</Link>
										</Button>
										<Button
											variant="outline"
											size="sm"
											className="h-7 text-xs px-2"
											asChild
										>
											<Link href={`/edit-listing/${listing.id}`}>
												<Edit className="mr-1 h-3 w-3" />
												Edit
											</Link>
										</Button>
									</div>
								</div>
							</CardContent>
						</div>
					</Card>
				))
			) : (
				<div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
					<div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
						<Home className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
					</div>
					<h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">
						No listings yet
					</h3>
					<p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-4 sm:mb-6">
						You haven't created any listings yet. Create your first listing to
						get started.
					</p>
					<Button
						className="text-xs sm:text-sm bg-vibrant-orange hover:bg-orange-600 dark:bg-elegant-orange dark:hover:bg-orange-700"
						asChild
					>
						<Link href="/create-listing">Create a Listing</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
