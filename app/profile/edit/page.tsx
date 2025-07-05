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
import { ArrowLeft, Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EditProfilePage() {
	const router = useRouter();
	const [isUploading, setIsUploading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [formData, setFormData] = useState({
		name: 'Alex Taylor',
		age: '27',
		occupation: 'Software Engineer',
		location: 'New York City',
		bio: "Software engineer who loves hiking and cooking. Looking for a quiet and clean roommate in the downtown area. I'm an early riser and enjoy having a tidy living space.",
		interests: ['Hiking', 'Cooking', 'Reading', 'Photography', 'Travel'],
		profilePicture: '/placeholder.svg?height=96&width=96&text=Alex',
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleProfilePictureUpload = () => {
		setIsUploading(true);
		// Simulate upload delay
		setTimeout(() => {
			setIsUploading(false);
			setFormData((prev) => ({
				...prev,
				profilePicture: `/placeholder.svg?height=96&width=96&text=Alex&bg=random`,
			}));
		}, 1500);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setIsSaving(false);
		router.push('/profile');
	};

	return (
		<div className="min-h-screen pb-16">
			<header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={() => router.back()}>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<Link
						href="/home"
						className="text-xl font-bold text-vibrant-orange cursor-pointer"
					>
						RomieSwipe
					</Link>
				</div>
				<ModeToggle />
			</header>

			<main className="container max-w-2xl mx-auto p-4 sm:p-6">
				<form onSubmit={handleSubmit}>
					<Card className="sm:rounded-xl">
						<CardHeader className="p-4 sm:p-6">
							<CardTitle className="text-xl sm:text-2xl">
								Edit Profile
							</CardTitle>
							<CardDescription className="text-sm">
								Update your profile information
							</CardDescription>
						</CardHeader>
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
									<Label htmlFor="age">Age</Label>
									<Input
										id="age"
										name="age"
										type="number"
										value={formData.age}
										onChange={handleChange}
										placeholder="Your age"
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
								<Label>Interests</Label>
								<div className="flex flex-wrap gap-2">
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
