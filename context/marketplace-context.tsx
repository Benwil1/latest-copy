'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';

// Sample listings data
const initialListings = [
	{
		id: 1,
		title: 'Modern Studio Apartment',
		location: 'Downtown, New York',
		price: 1800,
		image:
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		images: [
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		],
		beds: 1,
		baths: 1,
		sqft: 550,
		available: 'Immediately',
		verified: true,
		description:
			'This beautiful studio apartment features hardwood floors, high ceilings, and plenty of natural light. The kitchen is fully equipped with stainless steel appliances and granite countertops.',
		amenities: ['WiFi', 'Kitchen', 'TV', 'Parking', 'AC'],
		landlord: {
			name: 'Alex Johnson',
			image:
				'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
			rating: 4.8,
			responseRate: '98%',
			responseTime: 'within a few hours',
			memberSince: '2022',
		},
		saved: false,
	},
	{
		id: 2,
		title: 'Cozy 2 Bedroom House',
		location: 'Brooklyn, New York',
		price: 2500,
		image:
			'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		images: [
			'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		],
		beds: 2,
		baths: 1,
		sqft: 850,
		available: 'Aug 1, 2025',
		verified: true,
		description:
			'This charming house has a spacious living room, updated kitchen, and a private backyard. Located in a quiet neighborhood with easy access to public transportation and local shops.',
		amenities: ['WiFi', 'Kitchen', 'TV', 'Parking', 'AC', 'Backyard'],
		landlord: {
			name: 'Sarah Miller',
			image:
				'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
			rating: 4.9,
			responseRate: '95%',
			responseTime: 'within a day',
			memberSince: '2021',
		},
		saved: false,
	},
	{
		id: 3,
		title: 'Spacious Loft with Rooftop',
		location: 'SoHo, New York',
		price: 3200,
		image:
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3',
		images: [
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
			'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
		],
		beds: 1,
		baths: 2,
		sqft: 1200,
		available: 'Sep 15, 2025',
		verified: true,
		description:
			'This modern loft features high ceilings, industrial finishes, and abundant natural light. Enjoy exclusive access to the rooftop terrace with panoramic city views.',
		amenities: ['WiFi', 'Kitchen', 'TV', 'Elevator', 'AC', 'Rooftop'],
		landlord: {
			name: 'Michael Chen',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
			rating: 4.7,
			responseRate: '90%',
			responseTime: 'within a day',
			memberSince: '2022',
		},
		saved: false,
	},
];

// Sample user data
const initialUser = {
	name: 'John Doe',
	email: 'john.doe@example.com',
	avatar: '/placeholder.svg?height=80&width=80',
	isLoggedIn: true,
	preferences: ['Non-smoker', 'Pet-friendly', 'Early riser', 'Quiet'],
	memberSince: '2022',
};

type Listing = (typeof initialListings)[0];
type User = typeof initialUser;

interface MarketplaceContextType {
	// Add your marketplace state and functions here
	listings: any[];
	userListings: Listing[];
	savedListings: Listing[];
	user: User;
	searchTerm: string;
	filterOptions: FilterOptions;
	addListing: (
		listing: Omit<Listing, 'id' | 'landlord' | 'verified' | 'saved'>
	) => void;
	toggleSaved: (id: number) => void;
	getListing: (id: number) => Listing | undefined;
	setSearchTerm: (term: string) => void;
	setFilterOptions: (options: Partial<FilterOptions>) => void;
	filteredListings: Listing[];
	favorites: number[];
	addFavorite: (id: number) => void;
	removeFavorite: (id: number) => void;
}

interface FilterOptions {
	minPrice: number | null;
	maxPrice: number | null;
	beds: number | null;
	baths: number | null;
	propertyType: string | null;
	amenities: string[];
}

const initialFilterOptions: FilterOptions = {
	minPrice: null,
	maxPrice: null,
	beds: null,
	baths: null,
	propertyType: null,
	amenities: [],
};

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(
	undefined
);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
	// Initialize state from localStorage if available, otherwise use initial values
	const [listings, setListings] = useState<Listing[]>(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('listings');
			return saved ? JSON.parse(saved) : initialListings;
		}
		return initialListings;
	});

	const [user, setUser] = useState<User>(initialUser);
	const [searchTerm, setSearchTerm] = useState('');
	const [filterOptions, setFilterOptions] =
		useState<FilterOptions>(initialFilterOptions);
	const [favorites, setFavorites] = useState<number[]>([]);

	const addFavorite = (id: number) => {
		setFavorites((prev) => [...prev, id]);
	};

	const removeFavorite = (id: number) => {
		setFavorites((prev) => prev.filter((favId) => favId !== id));
	};

	// Save listings to localStorage when they change
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('listings', JSON.stringify(listings));
		}
	}, [listings]);

	// Add a new listing
	const addListing = (
		listing: Omit<Listing, 'id' | 'landlord' | 'verified' | 'saved'>
	) => {
		const newListing: Listing = {
			...listing,
			id: listings.length + 1,
			landlord: {
				name: user.name,
				image: user.avatar,
				rating: 0,
				responseRate: 'New',
				responseTime: 'Not enough data',
				memberSince: user.memberSince,
			},
			verified: false,
			saved: false,
		};

		setListings([...listings, newListing]);
	};

	// Toggle saved status of a listing
	const toggleSaved = (id: number) => {
		setListings(
			listings.map((listing) =>
				listing.id === id ? { ...listing, saved: !listing.saved } : listing
			)
		);
	};

	// Get a listing by ID
	const getListing = (id: number) => {
		return listings.find((listing) => listing.id === id);
	};

	// Filter listings based on search term and filter options
	const filteredListings = listings.filter((listing) => {
		// Search term filter
		const matchesSearch =
			searchTerm === '' ||
			listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
			listing.description.toLowerCase().includes(searchTerm.toLowerCase());

		// Price filter
		const matchesMinPrice =
			!filterOptions.minPrice || listing.price >= filterOptions.minPrice;
		const matchesMaxPrice =
			!filterOptions.maxPrice || listing.price <= filterOptions.maxPrice;

		// Beds filter
		const matchesBeds =
			!filterOptions.beds || listing.beds >= filterOptions.beds;

		// Baths filter
		const matchesBaths =
			!filterOptions.baths || listing.baths >= filterOptions.baths;

		// Property type filter - would need property type in the listing data

		// Amenities filter
		const matchesAmenities =
			filterOptions.amenities.length === 0 ||
			filterOptions.amenities.every((amenity) =>
				listing.amenities.includes(amenity)
			);

		return (
			matchesSearch &&
			matchesMinPrice &&
			matchesMaxPrice &&
			matchesBeds &&
			matchesBaths &&
			matchesAmenities
		);
	});

	// User's listings
	const userListings = listings.filter(
		(listing) => listing.landlord.name === user.name
	);

	// Saved listings
	const savedListings = listings.filter((listing) => listing.saved);

	return (
		<MarketplaceContext.Provider
			value={{
				listings,
				userListings,
				savedListings,
				user,
				searchTerm,
				filterOptions,
				addListing,
				toggleSaved,
				getListing,
				setSearchTerm,
				setFilterOptions: (options) =>
					setFilterOptions({ ...filterOptions, ...options }),
				filteredListings,
				favorites,
				addFavorite,
				removeFavorite,
			}}
		>
			{children}
		</MarketplaceContext.Provider>
	);
}

export function useMarketplace() {
	const context = useContext(MarketplaceContext);
	if (context === undefined) {
		throw new Error('useMarketplace must be used within a MarketplaceProvider');
	}
	return context;
}
