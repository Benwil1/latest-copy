export type Roommate = {
	id: number;
	name: string;
	age: number;
	image: string;
	budget: number;
	location: string;
	moveIn: string;
	compatibility: number;
	verified: boolean;
	tags: string[];
	bio: string;
	nationality: string;
	hasPhotos: boolean;
	roomType: string[];
	moveInDate?: string;
	likedUserIds?: string[];
};

export const roommates: Roommate[] = [
	{
		id: 1,
		name: 'Sarah Johnson',
		age: 26,
		nationality: 'United States',
		image:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1200,
		location: 'Downtown',
		moveIn: 'Immediate',
		moveInDate: '2024-02-01',
		compatibility: 92,
		verified: true,
		hasPhotos: true,
		roomType: ['Private Room', 'Entire Apartment'],
		tags: [
			'Non-smoker',
			'Pet-friendly',
			'Early riser',
			'Professional',
			'Clean',
		],
		bio: 'Software engineer who loves hiking and cooking. Looking for a quiet and clean roommate.',
		likedUserIds: ['user-123'],
	},
	{
		id: 2,
		name: 'Michael Chen',
		age: 28,
		nationality: 'Canada',
		image:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1500,
		location: 'Midtown',
		moveIn: 'Next month',
		moveInDate: '2024-03-01',
		compatibility: 85,
		verified: true,
		hasPhotos: true,
		roomType: ['Shared Room', 'Studio'],
		tags: ['Non-smoker', 'Night owl', 'Social', 'Professional'],
		bio: "Marketing professional who enjoys fitness and weekend adventures. I'm tidy and respectful of shared spaces.",
		likedUserIds: ['user-123'],
	},
	{
		id: 3,
		name: 'Emma Rodriguez',
		age: 24,
		nationality: 'Spain',
		image:
			'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1100,
		location: 'Westside',
		moveIn: 'Flexible',
		moveInDate: '2024-04-01',
		compatibility: 78,
		verified: false,
		hasPhotos: true,
		roomType: ['Private Room', 'House'],
		tags: ['Pet-friendly', 'Student', 'Quiet', 'Vegetarian'],
		bio: "Graphic designer with a small cat. I'm creative, laid-back, and enjoy having friends over occasionally.",
		likedUserIds: [],
	},
	{
		id: 4,
		name: 'Raj Patel',
		age: 27,
		nationality: 'India',
		image:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1300,
		location: 'Downtown',
		moveIn: 'Next month',
		moveInDate: '2024-03-15',
		compatibility: 81,
		verified: true,
		hasPhotos: true,
		roomType: ['Entire Apartment', 'Studio'],
		tags: ['Non-smoker', 'Vegetarian', 'Early riser', 'Professional', 'Clean'],
		bio: "Software developer who loves cooking Indian food. I'm clean, quiet, and respectful of shared spaces.",
		likedUserIds: [],
	},
	{
		id: 5,
		name: 'Sophia Kim',
		age: 25,
		nationality: 'South Korea',
		image:
			'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1400,
		location: 'Eastside',
		moveIn: 'Immediate',
		moveInDate: '2024-02-15',
		compatibility: 89,
		verified: true,
		hasPhotos: true,
		roomType: ['Private Room', 'Shared Room'],
		tags: ['Non-smoker', 'Student', 'Clean', 'Early riser'],
		bio: 'Graduate student studying business. I enjoy trying new restaurants, watching movies, and keeping a tidy home.',
		likedUserIds: [],
	},
	{
		id: 6,
		name: 'Alex Thompson',
		age: 30,
		nationality: 'United Kingdom',
		image:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1800,
		location: 'Downtown',
		moveIn: 'Next month',
		moveInDate: '2024-03-01',
		compatibility: 87,
		verified: true,
		hasPhotos: false,
		roomType: ['Entire Apartment', 'House'],
		tags: ['Night owl', 'Social', 'Professional', 'Pet-friendly'],
		bio: 'Financial analyst who enjoys nightlife and social events. Looking for someone who shares similar interests.',
		likedUserIds: [],
	},
	{
		id: 7,
		name: 'Maya Singh',
		age: 23,
		nationality: 'India',
		image:
			'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 900,
		location: 'Uptown',
		moveIn: 'Flexible',
		moveInDate: '2024-05-01',
		compatibility: 75,
		verified: false,
		hasPhotos: true,
		roomType: ['Shared Room', 'Studio'],
		tags: ['Student', 'Quiet', 'Vegetarian', 'Early riser'],
		bio: 'Medical student looking for a quiet study environment. I keep to myself but am friendly.',
		likedUserIds: [],
	},
	{
		id: 8,
		name: 'James Wilson',
		age: 29,
		nationality: 'Australia',
		image:
			'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		budget: 1600,
		location: 'Midtown',
		moveIn: 'Immediate',
		moveInDate: '2024-02-01',
		compatibility: 83,
		verified: true,
		hasPhotos: true,
		roomType: ['Private Room', 'Entire Apartment'],
		tags: ['Non-smoker', 'Social', 'Professional', 'Clean'],
		bio: 'Software architect who enjoys cooking and outdoor activities. Looking for a responsible roommate.',
		likedUserIds: [],
	},
];
