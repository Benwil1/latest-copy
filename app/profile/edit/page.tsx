'use client';

import type React from 'react';

import MobileNav from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth-context';
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function EditProfilePage() {
	const router = useRouter();
	const { user, updateProfile } = useAuth();
	const [isUploading, setIsUploading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState({
		name: user?.name || '',
		occupation: user?.occupation || '',
		country: user?.country || '',
		location: user?.location || '',
		bio: user?.bio || '',
		profilePicture: user?.profilePicture || '',
		interests: user?.interests || [],
	});

	useEffect(() => {
		if (!formData.location) {
			fetch('https://ipapi.co/json/')
				.then((res) => res.json())
				.then((data) => {
					if (data && data.city) {
						setFormData((prev) => ({ ...prev, location: data.city }));
					}
				})
				.catch(() => {});
		}
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		if (name === 'interests') {
			setFormData((prev) => ({
				...prev,
				interests: value.split(',').map((i) => i.trim()).filter(Boolean),
			}));
		} else {
		setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const handleProfilePictureUpload = () => {
		setIsUploading(true);
		setTimeout(() => {
			setIsUploading(false);
			setFormData((prev) => ({
				...prev,
				profilePicture: `/placeholder.svg?height=96&width=96&text=${encodeURIComponent(
					prev.name || 'User'
				)}&bg=random`,
			}));
		}, 1500);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		await updateProfile(formData);
		setIsSaving(false);
		router.push('/profile');
	};

	return (
		<div className="min-h-screen pb-16">
			<main className="container max-w-2xl mx-auto p-4 sm:p-6">
				<form onSubmit={handleSubmit}>
					<Card className="sm:rounded-xl">
						<CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
							{/* Profile Picture */}
							<div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
								<div className="relative">
									<Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background">
										<AvatarImage
											src={formData.profilePicture}
											alt={formData.name}
										/>
										<AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
									</Avatar>
									<Button
										type="button"
										variant="outline"
										size="icon"
										className="absolute bottom-0 right-0 rounded-full bg-background"
										onClick={handleProfilePictureUpload}
										disabled={isUploading}
									>
										{isUploading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Camera className="h-4 w-4" />
										)}
									</Button>
								</div>
								<div className="space-y-1 text-center sm:text-left">
									<h3 className="font-medium">Profile Picture</h3>
									<p className="text-sm text-muted-foreground">
										Upload a clear photo of yourself. This helps potential
										roommates recognize you.
									</p>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={handleProfilePictureUpload}
										disabled={isUploading}
									>
										{isUploading ? 'Uploading...' : 'Change Photo'}
									</Button>
								</div>
							</div>

							{/* Basic Information */}
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2 sm:space-y-3">
									<Label htmlFor="name">Full Name</Label>
									<Input
										id="name"
										name="name"
										value={formData.name}
										onChange={handleChange}
										placeholder="Your full name"
									/>
								</div>

								<div className="space-y-2 sm:space-y-3">
									<Label htmlFor="occupation">Occupation</Label>
									<Input
										id="occupation"
										name="occupation"
										value={formData.occupation}
										onChange={handleChange}
										placeholder="Your occupation"
									/>
								</div>

								<div className="space-y-2 sm:space-y-3">
									<Label htmlFor="country">Country</Label>
									<select
										id="country"
										name="country"
										value={formData.country}
										onChange={handleChange}
										title="Country"
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									>
										<option value="">Select your country</option>
										<option value="United States">United States</option>
										<option value="Canada">Canada</option>
										<option value="United Kingdom">United Kingdom</option>
										<option value="Australia">Australia</option>
										<option value="Germany">Germany</option>
										<option value="France">France</option>
										<option value="Spain">Spain</option>
										<option value="Italy">Italy</option>
										<option value="Japan">Japan</option>
										<option value="China">China</option>
										<option value="India">India</option>
										<option value="Brazil">Brazil</option>
										<option value="Mexico">Mexico</option>
										<option value="South Africa">South Africa</option>
										<option value="Nigeria">Nigeria</option>
										<option value="Egypt">Egypt</option>
										<option value="Russia">Russia</option>
										<option value="Turkey">Turkey</option>
										<option value="Argentina">Argentina</option>
										<option value="Colombia">Colombia</option>
										<option value="Indonesia">Indonesia</option>
										<option value="Pakistan">Pakistan</option>
										<option value="Bangladesh">Bangladesh</option>
										<option value="Philippines">Philippines</option>
										<option value="Vietnam">Vietnam</option>
										<option value="Thailand">Thailand</option>
										<option value="Malaysia">Malaysia</option>
										<option value="Singapore">Singapore</option>
										<option value="South Korea">South Korea</option>
										<option value="Saudi Arabia">Saudi Arabia</option>
										<option value="United Arab Emirates">United Arab Emirates</option>
										<option value="Netherlands">Netherlands</option>
										<option value="Sweden">Sweden</option>
										<option value="Norway">Norway</option>
										<option value="Denmark">Denmark</option>
										<option value="Finland">Finland</option>
										<option value="Poland">Poland</option>
										<option value="Switzerland">Switzerland</option>
										<option value="Austria">Austria</option>
										<option value="Belgium">Belgium</option>
										<option value="Ireland">Ireland</option>
										<option value="Portugal">Portugal</option>
										<option value="Greece">Greece</option>
										<option value="Czech Republic">Czech Republic</option>
										<option value="Hungary">Hungary</option>
										<option value="Romania">Romania</option>
										<option value="Ukraine">Ukraine</option>
										<option value="Chile">Chile</option>
										<option value="Peru">Peru</option>
										<option value="New Zealand">New Zealand</option>
										<option value="Morocco">Morocco</option>
										<option value="Kenya">Kenya</option>
										<option value="Ghana">Ghana</option>
										<option value="Other">Other</option>
									</select>
								</div>

								<div className="space-y-2 sm:space-y-3">
									<Label htmlFor="location">Location</Label>
									<Input
										id="location"
										name="location"
										value={formData.location}
										onChange={handleChange}
										placeholder="Your location"
									/>
								</div>
							</div>

							{/* Bio */}
							<div className="space-y-2 sm:space-y-3">
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									name="bio"
									value={formData.bio}
									onChange={handleChange}
									placeholder="Tell potential roommates about yourself"
									className="min-h-[120px]"
								/>
								<p className="text-xs text-muted-foreground">
									Your bio will be visible to potential roommates. Be honest and
									highlight what makes you a good roommate.
								</p>
							</div>

							{/* Interests */}
							<div className="space-y-2 sm:space-y-3">
								<Label htmlFor="interests">Interests</Label>
								<Input
									id="interests"
									name="interests"
									value={formData.interests.join(', ')}
									onChange={handleChange}
									placeholder="e.g. Hiking, Cooking, Reading"
								/>
								<div className="flex flex-wrap gap-2 mt-2">
									{formData.interests.map((interest, index) => (
										<Badge key={index} variant="secondary">
											{interest}
										</Badge>
									))}
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex justify-between p-4 sm:p-6">
							<Button
								variant="outline"
								type="button"
								onClick={() => router.back()}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSaving}>
								{isSaving ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving...
									</>
								) : (
									'Save Changes'
								)}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</main>

			<MobileNav />
		</div>
	);
}
