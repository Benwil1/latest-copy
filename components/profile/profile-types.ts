export interface Profile {
	name: string;
	age: number;
	image: string;
	location: string;
	isVerified: boolean;
	matchPercent: number;
	bio: string;
	occupation: string;
	nationality: string;
	languages: string[];
	budget: number;
	moveInDate: string;
	lifestyle: ProfileLifestyle;
	interests: string[];
	preferences: string;
	reviews: string;
}

export interface ProfileLifestyle {
	cleanliness: string;
	noiseLevel: string;
	schedule: string;
	guests: string;
	smoking: string;
	pets: string;
}
