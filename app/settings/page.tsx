'use client';

import NotificationSettings from '@/app/settings/components/notification-settings';
import PrivacySettings from '@/app/settings/components/privacy-settings';
import ProfileSettings from '@/app/settings/components/profile-settings';
import SecuritySettings from '@/app/settings/components/security-settings';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState('profile');
	const { toast } = useToast();

	// This function would be used to handle settings changes
	const handleSettingsSaved = (section: string) => {
		toast({
			title: 'Settings saved',
			description: `Your ${section} settings have been updated successfully.`,
			duration: 3000,
		});
	};

	return (
		<div className="min-h-screen pb-16">
			<main className="container max-w-4xl mx-auto p-4 sm:p-6">
				<Link
					href="/profile"
					className="inline-flex items-center gap-2 mb-4 text-sm font-medium text-primary hover:underline"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Profile
				</Link>
				<h1 className="text-2xl font-bold mb-6 sm:mb-8">Settings</h1>

				<div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
					{/* Sidebar for larger screens */}
					<div className="hidden lg:block w-64 shrink-0">
						<div className="space-y-1 sticky top-24">
							<Button
								variant={activeTab === 'profile' ? 'default' : 'ghost'}
								className="w-full justify-start h-11"
								onClick={() => setActiveTab('profile')}
							>
								Profile
							</Button>
							<Button
								variant={activeTab === 'notifications' ? 'default' : 'ghost'}
								className="w-full justify-start h-11"
								onClick={() => setActiveTab('notifications')}
							>
								Notifications
							</Button>
							<Button
								variant={activeTab === 'privacy' ? 'default' : 'ghost'}
								className="w-full justify-start h-11"
								onClick={() => setActiveTab('privacy')}
							>
								Privacy
							</Button>
							<Button
								variant={activeTab === 'security' ? 'default' : 'ghost'}
								className="w-full justify-start h-11"
								onClick={() => setActiveTab('security')}
							>
								Security
							</Button>
						</div>
					</div>

					{/* Tabs for mobile and tablet */}
					<div className="lg:hidden mb-6">
						<Tabs
							value={activeTab}
							onValueChange={setActiveTab}
							className="w-full"
						>
							<TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
								<TabsTrigger value="profile" className="text-sm sm:text-base">
									Profile
								</TabsTrigger>
								<TabsTrigger
									value="notifications"
									className="text-sm sm:text-base"
								>
									Notifications
								</TabsTrigger>
								<TabsTrigger value="privacy" className="text-sm sm:text-base">
									Privacy
								</TabsTrigger>
								<TabsTrigger value="security" className="text-sm sm:text-base">
									Security
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* Main content area */}
					<div className="flex-1 min-w-0">
						{activeTab === 'profile' && (
							<ProfileSettings onSave={() => handleSettingsSaved('profile')} />
						)}
						{activeTab === 'notifications' && (
							<NotificationSettings
								onSave={() => handleSettingsSaved('notification')}
							/>
						)}
						{activeTab === 'privacy' && (
							<PrivacySettings onSave={() => handleSettingsSaved('privacy')} />
						)}
						{activeTab === 'security' && (
							<SecuritySettings
								onSave={() => handleSettingsSaved('security')}
							/>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
