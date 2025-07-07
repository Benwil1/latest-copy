import { Card } from '@/components/ui/card';
import type { Profile } from './profile-types';

export interface ProfileInfoCardProps {
	profile: Profile;
	section: 'about' | 'preferences' | 'reviews';
}

export function ProfileInfoCard({ profile, section }: ProfileInfoCardProps) {
	if (section === 'about') {
		return (
			<div className="space-y-4">
				<Card className="p-4">
					<div className="font-semibold mb-2">Bio</div>
					<div className="text-sm text-muted-foreground">{profile.bio}</div>
				</Card>
				<Card className="p-4">
					<div className="font-semibold mb-2">Basic Info</div>
					<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
						<div className="text-muted-foreground">Occupation</div>
						<div>{profile.occupation}</div>
						<div className="text-muted-foreground">Nationality</div>
						<div>{profile.nationality}</div>
						<div className="text-muted-foreground">Languages</div>
						<div>{profile.languages.join(', ')}</div>
						<div className="text-muted-foreground">Budget</div>
						<div>${profile.budget}/month</div>
						<div className="text-muted-foreground">Move-in Date</div>
						<div>{profile.moveInDate}</div>
					</div>
				</Card>
				<Card className="p-4">
					<div className="font-semibold mb-2">Lifestyle</div>
					<div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
						<div className="flex items-center gap-2">
							<span>🧹</span>Cleanliness
						</div>
						<div>{profile.lifestyle.cleanliness}</div>
						<div className="flex items-center gap-2">
							<span>🔊</span>Noise Level
						</div>
						<div>{profile.lifestyle.noiseLevel}</div>
						<div className="flex items-center gap-2">
							<span>🌙</span>Schedule
						</div>
						<div>{profile.lifestyle.schedule}</div>
						<div className="flex items-center gap-2">
							<span>👥</span>Guests
						</div>
						<div>{profile.lifestyle.guests}</div>
						<div className="flex items-center gap-2">
							<span>🚬</span>Smoking
						</div>
						<div>{profile.lifestyle.smoking}</div>
						<div className="flex items-center gap-2">
							<span>🐾</span>Pets
						</div>
						<div>{profile.lifestyle.pets}</div>
					</div>
				</Card>
				<Card className="p-4">
					<div className="font-semibold mb-2">Interests</div>
					<div className="flex flex-wrap gap-2">
						{profile.interests.map((interest) => (
							<span
								key={interest}
								className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-foreground"
							>
								{interest}
							</span>
						))}
					</div>
				</Card>
			</div>
		);
	}
	if (section === 'preferences') {
		return (
			<Card className="p-4">
				<div className="font-semibold mb-2">Preferences</div>
				<div className="text-sm text-muted-foreground">
					{profile.preferences}
				</div>
			</Card>
		);
	}
	if (section === 'reviews') {
		return (
			<Card className="p-4">
				<div className="font-semibold mb-2">Reviews</div>
				<div className="text-sm text-muted-foreground">{profile.reviews}</div>
			</Card>
		);
	}
	return null;
}
