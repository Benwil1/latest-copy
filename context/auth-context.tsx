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

export type User = {
	id: string;
	name: string;
	email: string;
	phone: string;
	emailVerified: boolean;
	phoneVerified: boolean;
	twoFactorEnabled: boolean;
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
		password: string
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
};

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
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const mockUser = {
				...MOCK_USER,
				email,
			};
			setUser(mockUser);
			localStorage.setItem('user', JSON.stringify(mockUser));

			toast({
				title: 'Login successful',
				description: 'Welcome back to RoomieMatch!',
			});

			router.push('/home');
		} catch (error) {
			console.error('Login failed', error);
			toast({
				title: 'Login failed',
				description: 'Please check your credentials and try again.',
				variant: 'destructive',
			});
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const signup = async (
		name: string,
		email: string,
		phone: string,
		password: string
	) => {
		setIsLoading(true);
		try {
			// In a real app, this would be an API call to register
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			// Create a new user object
			const newUser: User = {
				...MOCK_USER,
				name,
				email,
				phone,
				emailVerified: false,
				phoneVerified: false,
			};

			setUser(newUser);
			localStorage.setItem('user', JSON.stringify(newUser));

			toast({
				title: 'Account created',
				description: 'Please verify your phone number to continue.',
			});

			router.push('/verify-phone');
		} catch (error) {
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
			// In a real app, this would be an API call to invalidate the session
			await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

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
				description: 'Please try again.',
				variant: 'destructive',
			});
		}
	};

	const verifyPhone = async (code: string): Promise<boolean> => {
		setIsLoading(true);
		try {
			// In a real app, this would be an API call to verify the phone
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			// For demo purposes, we'll accept any 6-digit code
			if (code.length === 6 && /^\d+$/.test(code)) {
				const updatedUser = { ...user!, phoneVerified: true };
				setUser(updatedUser);
				localStorage.setItem('user', JSON.stringify(updatedUser));

				toast({
					title: 'Phone verified',
					description: 'Your phone number has been verified successfully.',
				});

				return true;
			} else {
				toast({
					title: 'Verification failed',
					description: 'Invalid verification code. Please try again.',
					variant: 'destructive',
				});
				return false;
			}
		} catch (error) {
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
			// In a real app, this would be an API call to verify the email
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			// For demo purposes, we'll accept any 6-digit code
			if (code.length === 6 && /^\d+$/.test(code)) {
				const updatedUser = { ...user!, emailVerified: true };
				setUser(updatedUser);
				localStorage.setItem('user', JSON.stringify(updatedUser));

				toast({
					title: 'Email verified',
					description: 'Your email has been verified successfully.',
				});

				return true;
			} else {
				toast({
					title: 'Verification failed',
					description: 'Invalid verification code. Please try again.',
					variant: 'destructive',
				});
				return false;
			}
		} catch (error) {
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
			// In a real app, this would be an API call to resend the code
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			toast({
				title: 'Code sent',
				description: `A new verification code has been sent to your ${type}.`,
			});
		} catch (error) {
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
			// In a real app, this would be an API call to initiate password reset
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			toast({
				title: 'Password reset email sent',
				description:
					'Please check your email for instructions to reset your password.',
			});

			router.push('/login');
		} catch (error) {
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
