'use client';

import MobileNav from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Sample apartment data - in a real app, this would come from an API
const apartment = {
	id: 1,
	title: 'Modern Studio in Downtown',
	address: '123 Main St, Downtown',
	price: 1200,
	images: [
		'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
	],
	details: {
		type: 'Studio',
		bathrooms: 1,
		size: '500 sq ft',
		moveIn: 'Immediate',
		lease: '12-month lease',
		furnished: 'Furnished',
	},
	amenities: [
		'In-unit laundry',
		'Central AC',
		'Dishwasher',
		'Hardwood floors',
		'High-speed internet',
		'Pet friendly',
	],
	description: `
		This modern studio apartment offers the perfect blend of comfort and convenience in the heart of downtown. 
		Recently renovated with high-end finishes and appliances, the space features an open-concept layout that 
		maximizes every square foot.
	`,
};

export default function ApartmentDetailsPage() {
	const router = useRouter();

	return (
		<div className="min-h-screen pb-20 sm:pb-16">
			<header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm z-10">
				<div className="p-4 flex justify-between items-center max-w-7xl mx-auto">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 p-0"
						onClick={() => router.back()}
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div className="text-xl font-bold text-vibrant-orange">
						RoomieMatch
					</div>
					<ModeToggle />
				</div>
			</header>

			<main className="pt-20">
				{/* Image Gallery */}
				<div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/1] bg-muted">
					<div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
						{apartment.images.map((image, index) => (
							<div
								key={index}
								className={`relative rounded-lg overflow-hidden ${
									index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
								}`}
							>
								<Image
									src={image}
									alt={`Apartment view ${index + 1}`}
									layout="fill"
									objectFit="cover"
									className="absolute inset-0 w-full h-full"
								/>
							</div>
						))}
					</div>
				</div>

				{/* Content */}
				<div className="container max-w-7xl mx-auto px-4 py-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-8">
							{/* Title and Location */}
							<div>
								<h1 className="text-3xl font-bold mb-2">{apartment.title}</h1>
								<p className="text-muted-foreground flex items-center gap-1">
									<MapPin className="h-4 w-4" />
									{apartment.address}
								</p>
							</div>

							{/* Key Information */}
							<div className="bg-card rounded-xl p-6 border">
								<h2 className="text-xl font-semibold mb-4">Key Information</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
									{Object.entries(apartment.details).map(([key, value]) => (
										<div key={key}>
											<p className="text-sm text-muted-foreground capitalize">
												{key.replace(/([A-Z])/g, ' $1').trim()}
											</p>
											<p className="font-medium">{value}</p>
										</div>
									))}
								</div>
							</div>

							{/* Description */}
							<div>
								<h2 className="text-xl font-semibold mb-4">Description</h2>
								<p className="text-muted-foreground whitespace-pre-line">
									{apartment.description}
								</p>
							</div>

							{/* Amenities */}
							<div>
								<h2 className="text-xl font-semibold mb-4">Amenities</h2>
								<div className="grid grid-cols-2 gap-2">
									{apartment.amenities.map((amenity) => (
										<div
											key={amenity}
											className="flex items-center gap-2 text-muted-foreground"
										>
											<span className="h-1.5 w-1.5 rounded-full bg-vibrant-orange" />
											{amenity}
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Sidebar */}
						<div className="lg:sticky lg:top-24">
							<div className="bg-card rounded-xl p-6 border">
								<div className="text-2xl font-bold mb-6">
									${apartment.price}
									<span className="text-muted-foreground text-sm font-normal">
										/month
									</span>
								</div>

								<div className="space-y-4">
									<Button className="w-full bg-vibrant-orange hover:bg-orange-600">
										Contact Landlord
									</Button>
									<Button variant="outline" className="w-full">
										Save Listing
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<MobileNav />
		</div>
	);
}
