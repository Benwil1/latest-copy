'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
	ArrowLeft,
	ArrowRight,
	Bath,
	BedDouble,
	Calendar,
	Check,
	DollarSign,
	Home,
	MapPin,
	Sparkles,
	Upload,
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

// Add useMarketplace and useRouter imports
import { useMarketplace } from '@/context/marketplace-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CreateListingPage() {
	const [step, setStep] = useState(1);
	const [images, setImages] = useState<string[]>([]);
	const [description, setDescription] = useState('');
	const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

	// Inside the component, add these lines after the state declarations
	const { addListing } = useMarketplace();
	const router = useRouter();
	const { toast } = useToast();

	// Replace the existing form state with more complete state
	const [formData, setFormData] = useState({
		title: '',
		propertyType: '',
		listingType: 'rent',
		location: '',
		price: '',
		availableDate: '',
		bedrooms: '',
		bathrooms: '',
		sqft: '',
		amenities: [] as string[],
		description: '',
		images: [] as string[],
	});

	const totalSteps = 4;

	const handleNext = () => {
		if (step < totalSteps) {
			setStep(step + 1);
			window.scrollTo(0, 0);
		}
	};

	const handlePrevious = () => {
		if (step > 1) {
			setStep(step - 1);
			window.scrollTo(0, 0);
		}
	};

	// Update the handleImageUpload function
	const handleImageUpload = () => {
		// In a real app, this would handle file uploads
		// For this demo, we'll just add placeholder images
		const newImage = `/placeholder.svg?height=300&width=400&text=Image+${
			formData.images.length + 1
		}`;
		setFormData({
			...formData,
			images: [...formData.images, newImage],
		});
	};

	// Update the handleGenerateDescription function
	const handleGenerateDescription = () => {
		setIsGeneratingDescription(true);

		// Simulate AI-generated description
		setTimeout(() => {
			const generatedDescription = `This beautiful ${formData.propertyType.toLowerCase()} features hardwood floors, high ceilings, and plenty of natural light. The kitchen is fully equipped with stainless steel appliances and granite countertops. The bathroom has been recently renovated with modern fixtures. Located in ${
				formData.location
			} with easy access to transportation and local amenities.`;

			setFormData({
				...formData,
				description: generatedDescription,
			});
			setIsGeneratingDescription(false);
		}, 1500);
	};

	// Add function to toggle amenities
	const toggleAmenity = (amenity: string) => {
		setFormData((prev) => {
			const amenities = prev.amenities.includes(amenity)
				? prev.amenities.filter((a) => a !== amenity)
				: [...prev.amenities, amenity];
			return { ...prev, amenities };
		});
	};

	// Add form submission handler
	const handleSubmit = () => {
		if (step === totalSteps) {
			// Add the listing
			addListing({
				title: formData.title,
				location: formData.location,
				price: Number.parseInt(formData.price) || 0,
				image: formData.images[0] || '/placeholder.svg?height=300&width=400',
				images:
					formData.images.length > 0
						? formData.images
						: ['/placeholder.svg?height=600&width=800'],
				beds: Number.parseInt(formData.bedrooms) || 1,
				baths: Number.parseFloat(formData.bathrooms) || 1,
				sqft: Number.parseInt(formData.sqft) || 0,
				available: formData.availableDate || 'Immediately',
				description: formData.description,
				amenities: formData.amenities,
			});

			// Show success message
			toast({
				title: 'Listing Created!',
				description: 'Your listing has been successfully created.',
				duration: 5000,
			});

			// Redirect to profile page
			router.push('/profile');
		} else {
			// Move to next step
			handleNext();
		}
	};

	return (
		<div className="container py-8 max-w-3xl">
			<h1 className="text-2xl md:text-3xl font-bold mb-2">
				Create a New Listing
			</h1>
			<p className="text-muted-foreground mb-8">
				Fill out the details below to list your property
			</p>

			{/* Progress Indicator */}
			<div className="mb-8">
				<div className="flex items-center justify-between">
					{Array.from({ length: totalSteps }).map((_, index) => (
						<div key={index} className="flex items-center">
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-full ${
									step > index + 1
										? 'bg-primary text-white'
										: step === index + 1
										? 'bg-primary text-white'
										: 'bg-muted text-muted-foreground'
								}`}
							>
								{step > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
							</div>

							{index < totalSteps - 1 && (
								<div
									className={`h-1 w-full mx-2 ${
										step > index + 1 ? 'bg-primary' : 'bg-muted'
									}`}
								></div>
							)}
						</div>
					))}
				</div>

				<div className="flex justify-between mt-2">
					<span className="text-sm font-medium">Basic Info</span>
					<span className="text-sm font-medium">Property Details</span>
					<span className="text-sm font-medium">Photos & Description</span>
					<span className="text-sm font-medium">Review & Submit</span>
				</div>
			</div>

			<Card>
				<CardContent className="p-6">
					{/* Step 1: Basic Information */}
					{step === 1 && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold mb-4">Basic Information</h2>

							<div className="space-y-4">
								<div>
									<Label htmlFor="title">Listing Title</Label>
									<Input
										id="title"
										placeholder="e.g. Modern Studio Apartment"
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
									/>
								</div>

								<div>
									<Label htmlFor="property-type">Property Type</Label>
									<Select
										onValueChange={(value) =>
											setFormData({ ...formData, propertyType: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select property type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="apartment">Apartment</SelectItem>
											<SelectItem value="house">House</SelectItem>
											<SelectItem value="condo">Condo</SelectItem>
											<SelectItem value="room">Room</SelectItem>
											<SelectItem value="studio">Studio</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Listing Type</Label>
									<RadioGroup
										defaultValue="rent"
										className="flex flex-col space-y-1 mt-2"
										onValueChange={(value) =>
											setFormData({ ...formData, listingType: value })
										}
									>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="rent" id="rent" />
											<Label htmlFor="rent">For Rent</Label>
										</div>
										<div className="flex items-center space-x-2">
											<RadioGroupItem value="roommate" id="roommate" />
											<Label htmlFor="roommate">Looking for Roommate</Label>
										</div>
									</RadioGroup>
								</div>

								<div>
									<Label htmlFor="location">Location</Label>
									<div className="relative">
										<MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="location"
											placeholder="Address"
											className="pl-10"
											value={formData.location}
											onChange={(e) =>
												setFormData({ ...formData, location: e.target.value })
											}
										/>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Step 2: Property Details */}
					{step === 2 && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold mb-4">Property Details</h2>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="price">Monthly Rent</Label>
									<div className="relative">
										<DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="price"
											placeholder="e.g. 1500"
											className="pl-10"
											value={formData.price}
											onChange={(e) =>
												setFormData({ ...formData, price: e.target.value })
											}
										/>
									</div>
								</div>

								<div>
									<Label htmlFor="available-date">Available From</Label>
									<div className="relative">
										<Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="available-date"
											type="date"
											className="pl-10"
											value={formData.availableDate}
											onChange={(e) =>
												setFormData({
													...formData,
													availableDate: e.target.value,
												})
											}
										/>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-4">
								<div>
									<Label htmlFor="bedrooms">Bedrooms</Label>
									<div className="relative">
										<BedDouble className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Select
											onValueChange={(value) =>
												setFormData({ ...formData, bedrooms: value })
											}
										>
											<SelectTrigger className="pl-10">
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="studio">Studio</SelectItem>
												<SelectItem value="1">1</SelectItem>
												<SelectItem value="2">2</SelectItem>
												<SelectItem value="3">3</SelectItem>
												<SelectItem value="4+">4+</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div>
									<Label htmlFor="bathrooms">Bathrooms</Label>
									<div className="relative">
										<Bath className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Select
											onValueChange={(value) =>
												setFormData({ ...formData, bathrooms: value })
											}
										>
											<SelectTrigger className="pl-10">
												<SelectValue placeholder="Select" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1">1</SelectItem>
												<SelectItem value="1.5">1.5</SelectItem>
												<SelectItem value="2">2</SelectItem>
												<SelectItem value="2.5">2.5</SelectItem>
												<SelectItem value="3+">3+</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div>
									<Label htmlFor="size">Size (sq ft)</Label>
									<div className="relative">
										<Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="size"
											placeholder="e.g. 750"
											className="pl-10"
											value={formData.sqft}
											onChange={(e) =>
												setFormData({ ...formData, sqft: e.target.value })
											}
										/>
									</div>
								</div>
							</div>

							<div>
								<Label className="mb-2 block">Amenities</Label>
								<div className="grid grid-cols-2 gap-2">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="wifi"
											checked={formData.amenities.includes('wifi')}
											onCheckedChange={() => toggleAmenity('wifi')}
										/>
										<Label htmlFor="wifi">WiFi</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="ac"
											checked={formData.amenities.includes('ac')}
											onCheckedChange={() => toggleAmenity('ac')}
										/>
										<Label htmlFor="ac">Air Conditioning</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="laundry"
											checked={formData.amenities.includes('laundry')}
											onCheckedChange={() => toggleAmenity('laundry')}
										/>
										<Label htmlFor="laundry">Laundry</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="parking"
											checked={formData.amenities.includes('parking')}
											onCheckedChange={() => toggleAmenity('parking')}
										/>
										<Label htmlFor="parking">Parking</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="pets"
											checked={formData.amenities.includes('pets')}
											onCheckedChange={() => toggleAmenity('pets')}
										/>
										<Label htmlFor="pets">Pet Friendly</Label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="furnished"
											checked={formData.amenities.includes('furnished')}
											onCheckedChange={() => toggleAmenity('furnished')}
										/>
										<Label htmlFor="furnished">Furnished</Label>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Step 3: Photos & Description */}
					{step === 3 && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold mb-4">
								Photos & Description
							</h2>

							<div>
								<Label className="mb-2 block">Upload Photos</Label>
								<div className="grid grid-cols-3 gap-4 mb-4">
									{formData.images.map((image, index) => (
										<div
											key={index}
											className="relative h-32 rounded-md overflow-hidden"
										>
											<Image
												src={image || '/placeholder.svg'}
												alt={`Property image ${index + 1}`}
												layout="fill"
												objectFit="cover"
												className="w-full h-full"
											/>
										</div>
									))}

									<Button
										variant="outline"
										className="h-32 border-dashed flex flex-col items-center justify-center gap-2"
										onClick={handleImageUpload}
									>
										<Upload className="h-6 w-6 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">
											Upload Image
										</span>
									</Button>
								</div>
								<p className="text-xs text-muted-foreground">
									Upload high-quality images of your property. You can add up to
									10 images.
								</p>
							</div>

							<div>
								<div className="flex items-center justify-between mb-2">
									<Label htmlFor="description">Description</Label>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-1"
										onClick={handleGenerateDescription}
										disabled={isGeneratingDescription}
									>
										<Sparkles className="h-3 w-3" />
										<span>
											{isGeneratingDescription
												? 'Generating...'
												: 'AI Generate'}
										</span>
									</Button>
								</div>
								<Textarea
									id="description"
									placeholder="Describe your property in detail..."
									className="min-h-32"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
								/>
								<p className="text-xs text-muted-foreground mt-2">
									Include details about the property, neighborhood, and any
									special features.
								</p>
							</div>
						</div>
					)}

					{/* Step 4: Review & Submit */}
					{step === 4 && (
						<div className="space-y-6">
							<h2 className="text-xl font-semibold mb-4">Review & Submit</h2>

							<div className="space-y-4">
								<div className="border rounded-lg p-4">
									<h3 className="font-medium mb-2">
										{formData.title || 'Modern Studio Apartment'}
									</h3>
									<div className="flex items-center text-sm text-muted-foreground mb-2">
										<MapPin className="h-4 w-4 mr-1" />
										<span>{formData.location || 'Downtown, New York'}</span>
									</div>
									<div className="flex items-center gap-4 text-sm mb-2">
										<div className="flex items-center">
											<BedDouble className="h-4 w-4 mr-1 text-primary" />
											<span>{formData.bedrooms || '1'} Bed</span>
										</div>
										<div className="flex items-center">
											<Bath className="h-4 w-4 mr-1 text-primary" />
											<span>{formData.bathrooms || '1'} Bath</span>
										</div>
										<div className="flex items-center">
											<DollarSign className="h-4 w-4 mr-1 text-primary" />
											<span>${formData.price || '1,800'}/mo</span>
										</div>
									</div>

									<div className="grid grid-cols-4 gap-2 mb-4">
										{formData.images.length > 0 ? (
											formData.images.slice(0, 4).map((image, index) => (
												<div
													key={index}
													className="h-16 rounded-md overflow-hidden"
												>
													<Image
														src={image || '/placeholder.svg'}
														alt={`Property thumbnail ${index + 1}`}
														layout="fill"
														objectFit="cover"
														className="w-full h-full"
													/>
												</div>
											))
										) : (
											<div className="col-span-4 h-16 bg-muted rounded-md flex items-center justify-center">
												<span className="text-sm text-muted-foreground">
													No images uploaded
												</span>
											</div>
										)}
									</div>

									<p className="text-sm text-muted-foreground line-clamp-3">
										{formData.description || 'No description provided.'}
									</p>
								</div>

								<div className="border rounded-lg p-4">
									<h3 className="font-medium mb-2">Listing Settings</h3>

									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<Checkbox id="terms" />
											<Label htmlFor="terms" className="text-sm">
												I agree to the terms and conditions
											</Label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox id="contact" defaultChecked />
											<Label htmlFor="contact" className="text-sm">
												Allow users to contact me about this listing
											</Label>
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox id="featured" />
											<Label htmlFor="featured" className="text-sm">
												Feature this listing (additional fee applies)
											</Label>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between mt-8">
						{step > 1 ? (
							<Button variant="outline" onClick={handlePrevious}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Previous
							</Button>
						) : (
							<div></div>
						)}

						{step < totalSteps ? (
							<Button onClick={handleNext}>
								Next
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						) : (
							<Button
								className="bg-vibrant-orange hover:bg-orange-600 dark:bg-elegant-orange dark:hover:bg-orange-700"
								onClick={handleSubmit}
							>
								Submit Listing
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
