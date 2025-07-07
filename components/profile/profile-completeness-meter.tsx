import { Progress } from '@/components/ui/progress';

interface ProfileCompletenessMeterProps {
	user: {
		name?: string;
		profilePicture?: string;
		bio?: string;
		interests?: string[];
		emailVerified?: boolean;
		phoneVerified?: boolean;
		// Add more fields as needed
	};
}

const FIELDS = [
	(user: any) => !!user.name,
	(user: any) => !!user.profilePicture,
	(user: any) => !!user.bio,
	(user: any) => Array.isArray(user.interests) && user.interests.length > 0,
	(user: any) => !!user.emailVerified,
	(user: any) => !!user.phoneVerified,
];

export function ProfileCompletenessMeter({
	user,
}: ProfileCompletenessMeterProps) {
	const completed = FIELDS.reduce((acc, fn) => acc + (fn(user) ? 1 : 0), 0);
	const percent = Math.round((completed / FIELDS.length) * 100);

	return (
		<div className="w-full max-w-xs sm:max-w-sm mx-auto mb-4">
			<div className="flex items-center justify-between mb-1">
				<span className="text-xs font-medium text-muted-foreground">
					Profile {percent}% complete
				</span>
				<span className="text-xs text-muted-foreground">
					{completed}/{FIELDS.length}
				</span>
			</div>
			<Progress
				value={percent}
				aria-valuenow={percent}
				aria-valuemax={100}
				aria-label="Profile completeness"
			/>
		</div>
	);
}
