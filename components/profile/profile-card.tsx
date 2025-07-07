import { ProfileActions } from './profile-actions';
import { ProfileImage } from './profile-image';
import { ProfileInfoCard } from './profile-info-card';
import { ProfileTabs } from './profile-tabs';
import type { Profile } from './profile-types';

export interface ProfileCardProps {
	profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
	return (
		<div className="w-full max-w-4xl mx-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-background rounded-xl shadow-lg">
			<div className="flex flex-col items-center">
				<ProfileImage src={profile.image} alt={profile.name} />
				<div className="mt-4 w-full flex flex-col items-center">
					<span className="text-xl font-semibold text-foreground">
						{profile.name}, {profile.age}
					</span>
					<div className="flex items-center gap-2 text-muted-foreground mt-1">
						<span className="text-sm">{profile.location}</span>
						{profile.isVerified && (
							<span className="flex items-center gap-1 text-green-500">
								<svg width="16" height="16" fill="none" viewBox="0 0 24 24">
									<path
										stroke="currentColor"
										strokeWidth="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								Verified
							</span>
						)}
					</div>
					<span className="mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
						{profile.matchPercent}% Match
					</span>
				</div>
				<div className="mt-6 w-full flex justify-center">
					<ProfileActions />
				</div>
			</div>
			<div>
				<ProfileTabs profile={profile} />
			</div>
		</div>
	);
}
