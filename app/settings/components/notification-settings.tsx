'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface NotificationSettingsProps {
	onSave: () => void;
}

export default function NotificationSettings({
	onSave,
}: NotificationSettingsProps) {
	// Mock notification settings - in a real app, this would come from an API or context
	const [settings, setSettings] = useState({
		email: {
			newMatches: true,
			messages: true,
			profileViews: false,
			roommateSuggestions: true,
			accountUpdates: true,
			marketingEmails: false,
		},
		inApp: {
			newMatches: true,
			messages: true,
			profileViews: true,
			roommateSuggestions: true,
			accountUpdates: true,
		},
		push: {
			newMatches: true,
			messages: true,
			profileViews: false,
			roommateSuggestions: false,
			accountUpdates: true,
		},
	});

	const [isSaving, setIsSaving] = useState(false);

	const handleToggle = (
		category: 'email' | 'inApp' | 'push',
		setting: string,
		value: boolean
	) => {
		setSettings((prev) => ({
			...prev,
			[category]: {
				...prev[category],
				[setting]: value,
			},
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);

		// Simulate API call
		setTimeout(() => {
			setIsSaving(false);
			onSave();
		}, 1000);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Card>
				<CardHeader>
					<CardTitle>Notification Preferences</CardTitle>
					<CardDescription>
						Control how and when you receive notifications from RomieSwipe
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Email Notifications */}
					<div>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-medium">Email Notifications</h3>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button variant="ghost" size="icon">
											<Info className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-xs">
											Email notifications are sent to your registered email
											address. You can unsubscribe from marketing emails at any
											time.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label htmlFor="email-new-matches" className="flex-1">
									New matches
									<p className="text-sm font-normal text-muted-foreground">
										Receive emails when you match with a potential roommate
									</p>
								</Label>
								<Switch
									id="email-new-matches"
									checked={settings.email.newMatches}
									onCheckedChange={(checked) =>
										handleToggle('email', 'newMatches', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="email-messages" className="flex-1">
									Messages
									<p className="text-sm font-normal text-muted-foreground">
										Receive emails for new messages from your matches
									</p>
								</Label>
								<Switch
									id="email-messages"
									checked={settings.email.messages}
									onCheckedChange={(checked) =>
										handleToggle('email', 'messages', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="email-profile-views" className="flex-1">
									Profile views
									<p className="text-sm font-normal text-muted-foreground">
										Receive emails when someone views your profile
									</p>
								</Label>
								<Switch
									id="email-profile-views"
									checked={settings.email.profileViews}
									onCheckedChange={(checked) =>
										handleToggle('email', 'profileViews', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="email-roommate-suggestions" className="flex-1">
									Roommate suggestions
									<p className="text-sm font-normal text-muted-foreground">
										Receive emails with new roommate suggestions
									</p>
								</Label>
								<Switch
									id="email-roommate-suggestions"
									checked={settings.email.roommateSuggestions}
									onCheckedChange={(checked) =>
										handleToggle('email', 'roommateSuggestions', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="email-account-updates" className="flex-1">
									Account updates
									<p className="text-sm font-normal text-muted-foreground">
										Receive emails about important account updates
									</p>
								</Label>
								<Switch
									id="email-account-updates"
									checked={settings.email.accountUpdates}
									onCheckedChange={(checked) =>
										handleToggle('email', 'accountUpdates', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="email-marketing" className="flex-1">
									Marketing emails
									<p className="text-sm font-normal text-muted-foreground">
										Receive promotional emails and special offers
									</p>
								</Label>
								<Switch
									id="email-marketing"
									checked={settings.email.marketingEmails}
									onCheckedChange={(checked) =>
										handleToggle('email', 'marketingEmails', checked)
									}
								/>
							</div>
						</div>
					</div>

					<Separator />

					{/* In-App Notifications */}
					<div>
						<h3 className="text-lg font-medium mb-4">In-App Notifications</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label htmlFor="inapp-new-matches" className="flex-1">
									New matches
								</Label>
								<Switch
									id="inapp-new-matches"
									checked={settings.inApp.newMatches}
									onCheckedChange={(checked) =>
										handleToggle('inApp', 'newMatches', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="inapp-messages" className="flex-1">
									Messages
								</Label>
								<Switch
									id="inapp-messages"
									checked={settings.inApp.messages}
									onCheckedChange={(checked) =>
										handleToggle('inApp', 'messages', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="inapp-profile-views" className="flex-1">
									Profile views
								</Label>
								<Switch
									id="inapp-profile-views"
									checked={settings.inApp.profileViews}
									onCheckedChange={(checked) =>
										handleToggle('inApp', 'profileViews', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="inapp-roommate-suggestions" className="flex-1">
									Roommate suggestions
								</Label>
								<Switch
									id="inapp-roommate-suggestions"
									checked={settings.inApp.roommateSuggestions}
									onCheckedChange={(checked) =>
										handleToggle('inApp', 'roommateSuggestions', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="inapp-account-updates" className="flex-1">
									Account updates
								</Label>
								<Switch
									id="inapp-account-updates"
									checked={settings.inApp.accountUpdates}
									onCheckedChange={(checked) =>
										handleToggle('inApp', 'accountUpdates', checked)
									}
								/>
							</div>
						</div>
					</div>

					<Separator />

					{/* Push Notifications */}
					<div>
						<h3 className="text-lg font-medium mb-4">Push Notifications</h3>
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<Label htmlFor="push-new-matches" className="flex-1">
									New matches
								</Label>
								<Switch
									id="push-new-matches"
									checked={settings.push.newMatches}
									onCheckedChange={(checked) =>
										handleToggle('push', 'newMatches', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="push-messages" className="flex-1">
									Messages
								</Label>
								<Switch
									id="push-messages"
									checked={settings.push.messages}
									onCheckedChange={(checked) =>
										handleToggle('push', 'messages', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="push-profile-views" className="flex-1">
									Profile views
								</Label>
								<Switch
									id="push-profile-views"
									checked={settings.push.profileViews}
									onCheckedChange={(checked) =>
										handleToggle('push', 'profileViews', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="push-roommate-suggestions" className="flex-1">
									Roommate suggestions
								</Label>
								<Switch
									id="push-roommate-suggestions"
									checked={settings.push.roommateSuggestions}
									onCheckedChange={(checked) =>
										handleToggle('push', 'roommateSuggestions', checked)
									}
								/>
							</div>
							<div className="flex items-center justify-between">
								<Label htmlFor="push-account-updates" className="flex-1">
									Account updates
								</Label>
								<Switch
									id="push-account-updates"
									checked={settings.push.accountUpdates}
									onCheckedChange={(checked) =>
										handleToggle('push', 'accountUpdates', checked)
									}
								/>
							</div>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button variant="outline" type="button">
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
	);
}
