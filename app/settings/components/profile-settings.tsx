'use client';

import type React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth-context';
import { Camera, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ProfileSettingsProps {
	onSave: () => void;
}

export default function ProfileSettings({ onSave }: ProfileSettingsProps) {
	const { user, updateProfile } = useAuth();
	// Use real user for initial values
	const [formData, setFormData] = useState({
		name: user?.name || '',
		email: user?.email || '',
		phone: user?.phone || '',
		bio: user?.bio || '',
		occupation: user?.occupation || '',
		location: user?.location || '',
		nationality: user?.nationality || '',
		languages: user?.languages || [],
		profilePicture:
			user?.profilePicture || '/placeholder.svg?height=96&width=96&text=User',
	});

	const [isUploading, setIsUploading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleProfilePictureUpload = () => {
		// In a real app, this would open a file picker and upload the image
		setIsUploading(true);
		setTimeout(() => {
			setIsUploading(false);
			// Mock a new profile picture URL
			setFormData((prev) => ({
				...prev,
				profilePicture: `/placeholder.svg?height=96&width=96&text=Alex&bg=random`,
			}));
		}, 1500);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		await updateProfile(formData);
		setIsSaving(false);
		onSave();
	};

	const handleDeleteSearch = (id: string) => {
		if (!user) return;
		updateProfile({
			savedSearches: (user.savedSearches || []).filter((s) => s.id !== id),
		});
	};

	const handleToggleNotification = (id: string) => {
		if (!user) return;
		updateProfile({
			savedSearches: (user.savedSearches || []).map((s) =>
				s.id === id ? { ...s, notificationEnabled: !s.notificationEnabled } : s
			),
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>Profile Information</CardTitle>
					<CardDescription>
						Update your personal information and how it appears on your profile
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Profile Picture */}
					<div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
						<div className="relative">
							<Avatar className="h-24 w-24 border-4 border-background">
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
								Upload a clear photo of yourself. This helps potential roommates
								recognize you.
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

					<div className="grid gap-4 sm:grid-cols-2">
						{/* Basic Information */}
						<div className="space-y-2">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Your full name"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Your email address"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<Input
								id="phone"
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								placeholder="Your phone number"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="occupation">Occupation</Label>
							<Input
								id="occupation"
								name="occupation"
								value={formData.occupation}
								onChange={handleChange}
								placeholder="Your occupation"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								name="location"
								value={formData.location}
								onChange={handleChange}
								placeholder="Your location"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="nationality">Nationality</Label>
							<Select
								value={formData.nationality}
								onValueChange={(value) =>
									handleSelectChange('nationality', value)
								}
							>
								<SelectTrigger id="nationality">
									<SelectValue placeholder="Select your nationality" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="United States">United States</SelectItem>
									<SelectItem value="Canada">Canada</SelectItem>
									<SelectItem value="United Kingdom">United Kingdom</SelectItem>
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
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Bio */}
					<div className="space-y-2">
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
				</CardContent>
				<CardFooter className="flex justify-end">
					<Button type="submit" disabled={isSaving}>
						{isSaving ? 'Saving...' : 'Save Changes'}
					</Button>
				</CardFooter>
			</Card>

			{/* Saved Searches Section */}
			<Card className="mt-8">
				<CardHeader>
					<CardTitle>Saved Searches</CardTitle>
					<CardDescription>
						Manage your saved search filters and notifications
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{(user?.savedSearches?.length ?? 0) === 0 ? (
						<div className="text-sm text-muted-foreground">
							No saved searches yet.
						</div>
					) : (
						(user?.savedSearches || []).map((search) => (
							<div
								key={search.id}
								className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b last:border-b-0 pb-3 last:pb-0"
							>
								<div>
									<div className="font-medium text-sm">{search.name}</div>
									<div className="text-xs text-muted-foreground">
										{Object.entries(search.filters)
											.map(([k, v]) => `${k}: ${v}`)
											.join(', ')}
									</div>
									<div className="text-[10px] text-muted-foreground">
										Saved on {search.createdAt}
									</div>
								</div>
								<div className="flex items-center gap-2 mt-1 sm:mt-0">
									<Switch
										checked={search.notificationEnabled}
										onCheckedChange={() => handleToggleNotification(search.id)}
										id={`notif-${search.id}`}
										aria-label="Enable notifications for this search"
									/>
									<span className="text-xs">Notify</span>
									<Button
										variant="outline"
										size="sm"
										className="text-xs"
										onClick={() => {
											/* TODO: Implement view results navigation */
										}}
									>
										View Results
									</Button>
									<Button
										variant="destructive"
										size="sm"
										className="text-xs"
										onClick={() => handleDeleteSearch(search.id)}
									>
										Delete
									</Button>
								</div>
							</div>
						))
					)}
				</CardContent>
			</Card>
		</form>
	);
}
