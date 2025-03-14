'use client';

import ListingImageCarousel from '@/components/listing-image-carousel';
import ListingMap from '@/components/listing-map';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketplace } from '@/context/marketplace-context';
import { useToast } from '@/hooks/use-toast';
import {
	Bath,
	BedDouble,
	Calendar,
	Car,
	CheckCircle,
	Eye,
	Heart,
	MapPin,
	MessageSquare,
	Phone,
	Share2,
	Snowflake,
	Star,
	Tv,
	Utensils,
	Wifi,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ClientPageProps {
	params: {
		id: string;
	};
	searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ClientListingPage({ params }: ClientPageProps) {
	const { getListing, toggleSaved } = useMarketplace();
	const router = useRouter();
	const { toast } = useToast();
	const [contactType, setContactType] = useState<string>('message');

	const listingId = Number.parseInt(params.id);
	const listing = getListing(listingId);

	if (!listing) {
		return (
			<div className="container py-8 text-center">
				<h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
				<p className="mb-6">
					The listing you're looking for doesn't exist or has been removed.
				</p>
				<Button onClick={() => router.push('/')}>Back to Home</Button>
			</div>
		);
	}

	const handleContactAction = (action: string) => {
		toast({
			title: `${action} requested`,
			description: `Your ${action.toLowerCase()} request to ${
				listing.landlord.name
			} has been sent.`,
			duration: 3000,
		});
	};

	return (
		<div className="container py-4 sm:py-8 px-4 sm:px-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
				<div className="lg:col-span-2">
					<h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
						{listing.title}
					</h1>

					<div className="flex items-center text-muted-foreground mb-4 sm:mb-6">
						<MapPin className="h-4 w-4 mr-1" />
						<span>{listing.location}</span>
					</div>

					{/* Image Carousel */}
					<div className="mb-6 sm:mb-8">
						<ListingImageCarousel images={listing.images} />
					</div>

					{/* Listing Details */}
					<div className="mb-6 sm:mb-8">
						<h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
							Property Details
						</h2>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
							<Card>
								<CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center">
									<BedDouble className="h-5 w-5 text-primary mb-1 sm:mb-2" />
									<span className="text-xs sm:text-sm font-medium">
										{listing.beds} Bedroom
									</span>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center">
									<Bath className="h-5 w-5 text-primary mb-1 sm:mb-2" />
									<span className="text-xs sm:text-sm font-medium">
										{listing.baths} Bathroom
									</span>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center">
									<div className="text-primary mb-1 sm:mb-2 font-semibold">
										{listing.sqft}
									</div>
									<span className="text-xs sm:text-sm font-medium">
										Sq. Ft.
									</span>
								</CardContent>
							</Card>

							<Card>
								<CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center">
									<Calendar className="h-5 w-5 text-primary mb-1 sm:mb-2" />
									<span className="text-xs sm:text-sm font-medium">
										Available {listing.available}
									</span>
								</CardContent>
							</Card>
						</div>

						<p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
							{listing.description}
						</p>

						<h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
							Amenities
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 sm:gap-y-3">
							{listing.amenities.includes('WiFi') && (
								<div className="flex items-center">
									<Wifi className="h-4 w-4 mr-2 text-primary" />
									<span className="text-sm">WiFi</span>
								</div>
							)}
							{listing.amenities.includes('Kitchen') && (
								<div className="flex items-center">
									<Utensils className="h-4 w-4 mr-2 text-primary" />
									<span>Kitchen</span>
								</div>
							)}
							{listing.amenities.includes('TV') && (
								<div className="flex items-center">
									<Tv className="h-4 w-4 mr-2 text-primary" />
									<span>TV</span>
								</div>
							)}
							{listing.amenities.includes('Parking') && (
								<div className="flex items-center">
									<Car className="h-4 w-4 mr-2 text-primary" />
									<span>Parking</span>
								</div>
							)}
							{listing.amenities.includes('AC') && (
								<div className="flex items-center">
									<Snowflake className="h-4 w-4 mr-2 text-primary" />
									<span>AC</span>
								</div>
							)}
						</div>
					</div>

					{/* Location */}
					<div className="mb-6 sm:mb-8">
						<h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
							Location
						</h2>
						<div className="h-48 sm:h-64 w-full rounded-lg overflow-hidden">
							<ListingMap location={listing.location} />
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="lg:col-span-1">
					<div className="lg:sticky lg:top-20">
						<Card className="shadow-soft mb-4 sm:mb-6">
							<CardContent className="p-4 sm:p-6">
								<div className="flex items-center justify-between mb-3 sm:mb-4">
									<div className="text-xl sm:text-2xl font-bold">
										${listing.price}
										<span className="text-xs sm:text-sm font-normal text-muted-foreground">
											/month
										</span>
									</div>
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => toggleSaved(listing.id)}
										>
											<Heart
												className={`h-4 w-4 ${
													listing.saved ? 'fill-red-500 text-red-500' : ''
												}`}
											/>
										</Button>
										<Button
											variant="outline"
											size="icon"
											onClick={() => {
												const shareUrl = `${window.location.origin}/listing/${listing.id}`;
												if (navigator.share) {
													navigator
														.share({
															title: listing.title,
															text: `Check out this ${listing.beds} bedroom listing in ${listing.location}`,
															url: shareUrl,
														})
														.catch(console.error);
												} else {
													navigator.clipboard
														.writeText(shareUrl)
														.then(() => {
															toast({
																title: 'Link copied',
																description:
																	'The listing URL has been copied to your clipboard.',
																duration: 3000,
															});
														})
														.catch(console.error);
												}
											}}
										>
											<Share2 className="h-4 w-4" />
										</Button>
									</div>
								</div>

								<Tabs
									value={contactType}
									onValueChange={setContactType}
									className="w-full"
								>
									<TabsList className="grid w-full grid-cols-3">
										<TabsTrigger value="message">Message</TabsTrigger>
										<TabsTrigger value="call">Call</TabsTrigger>
										<TabsTrigger value="tour">Tour</TabsTrigger>
									</TabsList>

									<TabsContent value="message" className="pt-3 sm:pt-4">
										<Button
											className="w-full bg-vibrant-orange hover:bg-orange-600 dark:bg-elegant-orange dark:hover:bg-orange-700"
											onClick={() => handleContactAction('Message')}
										>
											<MessageSquare className="mr-2 h-4 w-4" />
											Message Landlord
										</Button>
									</TabsContent>

									<TabsContent value="call" className="pt-3 sm:pt-4">
										<Button
											className="w-full bg-vibrant-orange hover:bg-orange-600 dark:bg-elegant-orange dark:hover:bg-orange-700"
											onClick={() => handleContactAction('Call')}
										>
											<Phone className="mr-2 h-4 w-4" />
											Call Landlord
										</Button>
									</TabsContent>

									<TabsContent value="tour" className="pt-3 sm:pt-4">
										<Button
											className="w-full bg-vibrant-orange hover:bg-orange-600 dark:bg-elegant-orange dark:hover:bg-orange-700"
											onClick={() => handleContactAction('Tour')}
										>
											<Eye className="mr-2 h-4 w-4" />
											Schedule a Tour
										</Button>
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>

						<Card className="shadow-soft">
							<CardContent className="p-4 sm:p-6">
								<div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
									<Avatar className="h-10 w-10 sm:h-12 sm:w-12">
										<AvatarImage
											src={listing.landlord.image}
											alt={listing.landlord.name}
										/>
										<AvatarFallback>
											{listing.landlord.name.charAt(0)}
										</AvatarFallback>
									</Avatar>

									<div>
										<div className="flex items-center gap-1 sm:gap-2">
											<h3 className="text-sm sm:text-base font-semibold">
												{listing.landlord.name}
											</h3>
											{listing.verified && (
												<Badge
													variant="outline"
													className="flex items-center gap-1 text-primary border-primary text-xs"
												>
													<CheckCircle className="h-3 w-3" />
													Verified
												</Badge>
											)}
										</div>

										<div className="flex items-center text-xs sm:text-sm">
											<Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
											<span>
												{listing.landlord.rating} • Member since{' '}
												{listing.landlord.memberSince}
											</span>
										</div>
									</div>
								</div>

								<div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Response rate:
										</span>
										<span className="font-medium">
											{listing.landlord.responseRate}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Response time:
										</span>
										<span className="font-medium">
											{listing.landlord.responseTime}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
