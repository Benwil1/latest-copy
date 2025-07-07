import * as Tabs from '@radix-ui/react-tabs';
import { ProfileInfoCard } from './profile-info-card';
import type { Profile } from './profile-types';

export interface ProfileTabsProps {
	profile: Profile;
}

export function ProfileTabs({ profile }: ProfileTabsProps) {
	return (
		<Tabs.Root defaultValue="about" className="w-full">
			<Tabs.List className="flex gap-2 bg-muted rounded-lg p-1 mb-4">
				<Tabs.Trigger
					value="about"
					className="flex-1 px-4 py-2 rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary focus:outline-none"
				>
					About
				</Tabs.Trigger>
				<Tabs.Trigger
					value="preferences"
					className="flex-1 px-4 py-2 rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary focus:outline-none"
				>
					Preferences
				</Tabs.Trigger>
				<Tabs.Trigger
					value="reviews"
					className="flex-1 px-4 py-2 rounded-lg text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-primary focus:outline-none"
				>
					Reviews
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="about">
				<ProfileInfoCard profile={profile} section="about" />
			</Tabs.Content>
			<Tabs.Content value="preferences">
				<ProfileInfoCard profile={profile} section="preferences" />
			</Tabs.Content>
			<Tabs.Content value="reviews">
				<ProfileInfoCard profile={profile} section="reviews" />
			</Tabs.Content>
		</Tabs.Root>
	);
}
