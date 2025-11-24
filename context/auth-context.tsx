'use client';

import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from 'next/navigation';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';

export type SavedSearch = {
	id: string;
	name: string;
	filters: any;
	notificationEnabled: boolean;
	createdAt: string;
};

export type User = {
	id: string;
	name: string;
	email: string;
	phone: string;
	emailVerified: boolean;
	phoneVerified: boolean;
	twoFactorEnabled: boolean;
	role?: string;
	profilePicture?: string;
	country?: string;
	nationality?: string;
	location?: string;
	// Onboarding fields
	age?: string;
	gender?: string;
	photos?: string[];
	video?: string;
	budget?: string;
	preferredLocation?: string;
	moveInDate?: string;
	spaceType?: string;
	bathroom?: string;
	furnished?: string;
	amenities?: string[];
	lifestyle?: {
		smoking: string;
		pets: string;
		cleanliness: string;
		noise: string;
		guests: string;
		work: string;
	};
	bio?: string;
	interests?: string[];
	occupation?: string;
	roommatePreferences?: {
		ageRange?: string;
		gender?: string;
		occupation?: string;
	};
	languages?: string[];
	savedSearches?: SavedSearch[];
	likedUserIds?: string[];
};

type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (
		name: string,
		email: string,
		phone: string,
		password: string,
		country?: string,
		nationality?: string,
		location?: string
	) => Promise<void>;
	logout: () => Promise<void>;
	verifyPhone: (code: string) => Promise<boolean>;
	verifyEmail: (code: string) => Promise<boolean>;
	resendVerificationCode: (type: 'email' | 'phone') => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	updatePassword: (
		currentPassword: string,
		newPassword: string
	) => Promise<boolean>;
	deleteAccount: () => Promise<void>;
	updateProfile: (profile: Partial<User>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const MOCK_USER: User = {
	id: 'user-123',
	name: 'Alex Taylor',
	email: 'alex.taylor@example.com',
	phone: '+1 (555) 123-4567',
	emailVerified: true,
	phoneVerified: true,
	twoFactorEnabled: false,
	role: 'user',
	profilePicture: '',
	savedSearches: [],
	likedUserIds: [],
};

// Utility to strip large base64 data from user before saving to localStorage
function stripLargeFields(user: any) {
	return {
		...user,
		photos: Array.isArray(user.photos)
			? user.photos.map((p: string) =>
					typeof p === 'string' && p.startsWith('data:') ? '' : p
			  )
			: [],
		video:
			user.video &&
			typeof user.video === 'string' &&
			user.video.startsWith('data:')
				? ''
				: user.video,
	};
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();
	const { toast } = useToast();

	// Check if user is logged in on mount and handle initial routing
	useEffect(() => {
		const checkAuth = async () => {
			try {
				setIsLoading(true);
				const storedUser = localStorage.getItem('user');

				if (storedUser) {
					const parsedUser = JSON.parse(storedUser);
					setUser(parsedUser);

					// If on auth pages, redirect to home
					if (['/login', '/signup', '/'].includes(pathname)) {
						router.push('/home');
					}
				} else {
					// If not logged in and not on auth pages, redirect to login
					if (
						!['/login', '/signup', '/', '/forgot-password'].includes(pathname)
					) {
						router.push('/login');
					}
				}
			} catch (error) {
				console.error('Failed to check authentication status', error);
				localStorage.removeItem('user');
				if (
					!['/login', '/signup', '/', '/forgot-password'].includes(pathname)
				) {
					router.push('/login');
				}
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, [pathname, router]);

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			// Mock login - accept any email/password
			// Check if user exists in localStorage
			const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
			let user = storedUsers.find((u: User) => u.email === email);
			
			// If user doesn't exist, create a new one
			if (!user) {
				user = {
					id: `user-${Date.now()}`,
					name: email.split('@')[0],
					email,
					phone: '+1 (555) 000-0000',
					emailVerified: false,
					phoneVerified: false,
					twoFactorEnabled: false,
					role: 'user',
					profilePicture: '',
					savedSearches: [],
					likedUserIds: [],
				};
				storedUsers.push(user);
				localStorage.setItem('users', JSON.stringify(storedUsers));
			}

			setUser(user);
			localStorage.setItem('user', JSON.stringify(user));

			toast({
				title: 'Login successful',
				description: 'Welcome back to RoomieSwipe!',
			});

			router.push('/home');
		} catch (error: any) {
			console.error('Login failed', error);
			toast({
				title: 'Login failed',
				description: 'Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const signup = async (
		name: string,
		email: string,
		phone: string,
		password: string,
		country?: string,
		nationality?: string,
		location?: string
	) => {
		setIsLoading(true);
		try {
			// Get onboarding data from localStorage if available
			const onboardingData = localStorage.getItem('onboarding');
			const onboarding = onboardingData ? JSON.parse(onboardingData) : {};

			// Create new user
			const newUser: User = {
				id: `user-${Date.now()}`,
				name,
				email,
				phone,
				emailVerified: false,
				phoneVerified: false,
				twoFactorEnabled: false,
				role: 'user',
				profilePicture: '',
				country,
				nationality,
				location,
				savedSearches: [],
				likedUserIds: [],
				...onboarding,
			};

			// Store user in localStorage
			const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
			storedUsers.push(newUser);
			localStorage.setItem('users', JSON.stringify(storedUsers));
			
			setUser(newUser);
			localStorage.setItem('user', JSON.stringify(stripLargeFields(newUser)));
			
			toast({
				title: 'Account created',
				description: 'Please verify your phone number to continue.',
			});
			router.push('/verify-phone');
		} catch (error: any) {
			console.error('Signup failed', error);
			toast({
				title: 'Signup failed',
				description: 'Please check your information and try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			setUser(null);
			localStorage.removeItem('user');

			toast({
				title: 'Logged out',
				description: 'You have been successfully logged out.',
			});

			router.push('/');
		} catch (error) {
			console.error('Logout failed', error);
			toast({
				title: 'Logout failed',
				description: 'An error occurred while logging out.',
				variant: 'destructive',
			});
		}
	};

	const verifyPhone = async (code: string): Promise<boolean> => {
		setIsLoading(true);
		try {
			// Mock verification - accept any code
			if (user) {
				const updatedUser = { ...user, phoneVerified: true };
				setUser(updatedUser);
				localStorage.setItem('user', JSON.stringify(updatedUser));

				toast({
					title: 'Phone verified',
					description: 'Your phone number has been verified successfully.',
				});

				return true;
			}
			return false;
		} catch (error: any) {
			console.error('Phone verification failed', error);
			toast({
				title: 'Verification failed',
				description: 'Please try again.',
				variant: 'destructive',
			});
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const verifyEmail = async (code: string): Promise<boolean> => {
		setIsLoading(true);
		try {
			// Mock verification - accept any code
			if (user) {
				const updatedUser = { ...user, emailVerified: true };
				setUser(updatedUser);
				localStorage.setItem('user', JSON.stringify(updatedUser));

				toast({
					title: 'Email verified',
					description: 'Your email has been verified successfully.',
				});

				return true;
			}
			return false;
		} catch (error: any) {
			console.error('Email verification failed', error);
			toast({
				title: 'Verification failed',
				description: 'Please try again.',
				variant: 'destructive',
			});
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const resendVerificationCode = async (type: 'email' | 'phone') => {
		try {
			// Mock resend - just show success message
			toast({
				title: 'Code sent',
				description: `A new verification code has been sent to your ${type}.`,
			});
		} catch (error: any) {
			console.error('Failed to resend code', error);
			toast({
				title: 'Failed to send code',
				description: 'Please try again.',
				variant: 'destructive',
			});
		}
	};

	const resetPassword = async (email: string) => {
		try {
			// Mock password reset - just show success message
			toast({
				title: 'Password reset email sent',
				description:
					'Please check your email for instructions to reset your password.',
			});

			router.push('/login');
		} catch (error: any) {
			console.error('Password reset failed', error);
			toast({
				title: 'Password reset failed',
				description: 'Please try again.',
				variant: 'destructive',
			});
		}
	};

	const updatePassword = async (
		currentPassword: string,
		newPassword: string
	): Promise<boolean> => {
		setIsLoading(true);
		try {
			// In a real app, this would be an API call to update the password
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			toast({
				title: 'Password updated',
				description: 'Your password has been updated successfully.',
			});

			return true;
		} catch (error) {
			console.error('Password update failed', error);
			toast({
				title: 'Password update failed',
				description: 'Please check your current password and try again.',
				variant: 'destructive',
			});
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteAccount = async () => {
		try {
			// In a real app, this would be an API call to delete the account
			await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

			setUser(null);
			localStorage.removeItem('user');

			toast({
				title: 'Account deleted',
				description: 'Your account has been permanently deleted.',
			});

			router.push('/');
		} catch (error) {
			console.error('Account deletion failed', error);
			toast({
				title: 'Account deletion failed',
				description: 'Please try again.',
				variant: 'destructive',
			});
		}
	};

	const updateProfile = async (profile: Partial<User>) => {
		setIsLoading(true);
		try {
			if (!user) return; // Ensure user is defined
			const updatedUser: User = { ...user, ...profile };
			setUser(updatedUser);
			localStorage.setItem(
				'user',
				JSON.stringify(stripLargeFields(updatedUser))
			);

			// Also update onboarding data in localStorage to keep it in sync
			const onboardingData = localStorage.getItem('onboarding');
			const onboarding = onboardingData ? JSON.parse(onboardingData) : {};
			const updatedOnboarding = { ...onboarding, ...profile };
			localStorage.setItem('onboarding', JSON.stringify(updatedOnboarding));

			toast({
				title: 'Profile updated',
				description: 'Your profile has been updated successfully.',
			});
		} catch (error) {
			console.error('Profile update failed', error);
			toast({
				title: 'Update failed',
				description: 'Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const value = {
		user,
		isLoading,
		isAuthenticated: !!user,
		login,
		signup,
		logout,
		verifyPhone,
		verifyEmail,
		resendVerificationCode,
		resetPassword,
		updatePassword,
		deleteAccount,
		updateProfile,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
