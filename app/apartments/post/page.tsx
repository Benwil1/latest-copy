'use client';

import MobileNav from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileInput } from '@/components/ui/file-input';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.string().min(1, 'Price is required'),
	country: z.string().min(1, 'Country is required'),
	location: z.string().min(1, 'Location is required'),
	moveInDate: z.string().min(1, 'Move-in date is required'),
	roomType: z.string().min(1, 'Room type is required'),
	furnished: z.string().min(1, 'Please specify if furnished'),
	amenities: z.string().min(1, 'Please list amenities'),
	preferences: z.string().min(1, 'Please specify preferences'),
});

export default function PostApartmentPage() {
	const [images, setImages] = useState<File[]>([]);
	const [geo, setGeo] = useState({ country: '', city: '' });

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
			price: '',
			country: '',
			location: '',
			moveInDate: '',
			roomType: '',
			furnished: '',
			amenities: '',
			preferences: '',
		},
	});

	useEffect(() => {
		fetch('https://ipapi.co/json/')
			.then((res) => res.json())
			.then((data) => {
				setGeo({ country: data.country_name || '', city: data.city || '' });
				form.setValue('country', data.country_name || '');
				form.setValue('location', data.city || '');
			})
			.catch(() => {});
	}, []);

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Here you would typically send both the form data and images to your backend
		console.log('Form values:', values);
		console.log('Images:', images);
	}

	return (
		<div className="min-h-screen pb-16">
			{/* Segmented Navigation */}
			<div className="px-4 mb-6 mt-10">
				<div className="flex rounded-full bg-muted p-1">
					<Link
						href="/apartments/explore"
						className="flex-1 flex items-center justify-center px-4 py-3 rounded-full text-muted-foreground hover:text-foreground transition-colors"
					>
						Explore Apartments
					</Link>
					<Link
						href="/apartments/post"
						className="flex-1 flex items-center justify-center px-4 py-3 rounded-full bg-background text-foreground font-medium"
					>
						Post an Apartment
					</Link>
				</div>
			</div>

			<main className="container max-w-2xl mx-auto px-4">
				<Card className="p-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Images */}
							<div className="space-y-2">
								<FormLabel>Apartment Images</FormLabel>
								<FileInput
									onChange={setImages}
									value={images}
									maxFiles={5}
									className="w-full"
								/>
								<FormDescription>
									Upload up to 5 images of your apartment (JPEG, PNG, or WebP)
								</FormDescription>
							</div>

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Listing Title</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., Modern Studio in Downtown"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe your apartment..."
												className="min-h-[100px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="country"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Country</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value || geo.country}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select country" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="United States">
														United States
													</SelectItem>
													<SelectItem value="Canada">Canada</SelectItem>
													<SelectItem value="United Kingdom">
														United Kingdom
													</SelectItem>
													<SelectItem value="Australia">Australia</SelectItem>
													<SelectItem value="Germany">Germany</SelectItem>
													<SelectItem value="France">France</SelectItem>
													<SelectItem value="Spain">Spain</SelectItem>
													<SelectItem value="Italy">Italy</SelectItem>
													<SelectItem value="Japan">Japan</SelectItem>
													<SelectItem value="China">China</SelectItem>
													<SelectItem value="India">India</SelectItem>
													<SelectItem value="Brazil">Brazil</SelectItem>
													<SelectItem value="Mexico">Mexico</SelectItem>
													<SelectItem value="South Africa">
														South Africa
													</SelectItem>
													<SelectItem value="Nigeria">Nigeria</SelectItem>
													<SelectItem value="Egypt">Egypt</SelectItem>
													<SelectItem value="Russia">Russia</SelectItem>
													<SelectItem value="Turkey">Turkey</SelectItem>
													<SelectItem value="Argentina">Argentina</SelectItem>
													<SelectItem value="Colombia">Colombia</SelectItem>
													<SelectItem value="Indonesia">Indonesia</SelectItem>
													<SelectItem value="Pakistan">Pakistan</SelectItem>
													<SelectItem value="Bangladesh">Bangladesh</SelectItem>
													<SelectItem value="Philippines">
														Philippines
													</SelectItem>
													<SelectItem value="Vietnam">Vietnam</SelectItem>
													<SelectItem value="Thailand">Thailand</SelectItem>
													<SelectItem value="Malaysia">Malaysia</SelectItem>
													<SelectItem value="Singapore">Singapore</SelectItem>
													<SelectItem value="South Korea">
														South Korea
													</SelectItem>
													<SelectItem value="Saudi Arabia">
														Saudi Arabia
													</SelectItem>
													<SelectItem value="United Arab Emirates">
														United Arab Emirates
													</SelectItem>
													<SelectItem value="Netherlands">
														Netherlands
													</SelectItem>
													<SelectItem value="Sweden">Sweden</SelectItem>
													<SelectItem value="Norway">Norway</SelectItem>
													<SelectItem value="Denmark">Denmark</SelectItem>
													<SelectItem value="Finland">Finland</SelectItem>
													<SelectItem value="Poland">Poland</SelectItem>
													<SelectItem value="Switzerland">
														Switzerland
													</SelectItem>
													<SelectItem value="Austria">Austria</SelectItem>
													<SelectItem value="Belgium">Belgium</SelectItem>
													<SelectItem value="Ireland">Ireland</SelectItem>
													<SelectItem value="Portugal">Portugal</SelectItem>
													<SelectItem value="Greece">Greece</SelectItem>
													<SelectItem value="Czech Republic">
														Czech Republic
													</SelectItem>
													<SelectItem value="Hungary">Hungary</SelectItem>
													<SelectItem value="Romania">Romania</SelectItem>
													<SelectItem value="Ukraine">Ukraine</SelectItem>
													<SelectItem value="Chile">Chile</SelectItem>
													<SelectItem value="Peru">Peru</SelectItem>
													<SelectItem value="New Zealand">
														New Zealand
													</SelectItem>
													<SelectItem value="Morocco">Morocco</SelectItem>
													<SelectItem value="Kenya">Kenya</SelectItem>
													<SelectItem value="Ghana">Ghana</SelectItem>
													<SelectItem value="Other">Other</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="location"
									render={({ field }) => (
										<FormItem>
											<FormLabel>City/Location</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., New York"
													{...field}
													value={field.value || geo.city}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Monthly Rent</FormLabel>
											<FormControl>
												<Input type="number" placeholder="$" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="moveInDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Move-in Date</FormLabel>
											<FormControl>
												<Input type="date" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="roomType"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Room Type</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select room type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="private">Private Room</SelectItem>
													<SelectItem value="shared">Shared Room</SelectItem>
													<SelectItem value="entire">
														Entire Apartment
													</SelectItem>
													<SelectItem value="studio">Studio</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="furnished"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Furnished</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Is the apartment furnished?" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="yes">
														Yes, Fully Furnished
													</SelectItem>
													<SelectItem value="partially">
														Partially Furnished
													</SelectItem>
													<SelectItem value="no">No, Unfurnished</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="amenities"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amenities</FormLabel>
										<FormControl>
											<Textarea
												placeholder="List amenities (e.g., parking, laundry, gym)"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Separate amenities with commas
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="preferences"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Roommate Preferences</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe your ideal roommate..."
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full">
								Post Listing
							</Button>
						</form>
					</Form>
				</Card>
			</main>

			<MobileNav />
		</div>
	);
}
