'use client';

import type React from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import {
	ArrowLeft,
	Eye,
	EyeOff,
	Loader2,
	Lock,
	Mail,
	Phone,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignupPage() {
	const router = useRouter();
	const { signup, isLoading } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		country: '',
		location: '',
		password: '',
		confirmPassword: '',
	});
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		phone: '',
		country: '',
		location: '',
		password: '',
		confirmPassword: '',
	});

	useEffect(() => {
		if (!formData.country || !formData.location) {
			fetch('https://ipapi.co/json/')
				.then((res) => res.json())
				.then((data) => {
					if (data) {
						if (data.country_name) {
							setFormData((prev) => ({ ...prev, country: data.country_name }));
						}
						if (data.city) {
							setFormData((prev) => ({ ...prev, location: data.city }));
						}
					}
				})
				.catch(() => {});
		}
	}, []);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});

		// Clear error when user types
		if (errors[name as keyof typeof errors]) {
			setErrors({
				...errors,
				[name]: '',
			});
		}
	};

	const validateForm = () => {
		let valid = true;
		const newErrors = { ...errors };

		if (!formData.name.trim()) {
			newErrors.name = 'Name is required';
			valid = false;
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
			valid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid';
			valid = false;
		}

		if (!formData.phone.trim()) {
			newErrors.phone = 'Phone number is required';
			valid = false;
		} else if (
			!/^\+?[0-9\s\-()]{10,15}$/.test(formData.phone.replace(/\s+/g, ''))
		) {
			newErrors.phone = 'Phone number is invalid';
			valid = false;
		}

		if (!formData.country.trim()) {
			newErrors.country = 'Country is required';
			valid = false;
		}

		if (!formData.location.trim()) {
			newErrors.location = 'City/Location is required';
			valid = false;
		}

		if (!formData.password) {
			newErrors.password = 'Password is required';
			valid = false;
		} else if (formData.password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters';
			valid = false;
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			try {
				// Normalize phone to E.164-like (digits only, keep leading + if present)
				const onlyDigits = formData.phone.replace(/\D/g, '');
				const normalizedPhone = formData.phone.trim().startsWith('+')
					? `+${onlyDigits}`
					: onlyDigits;

				await signup(
					formData.name,
					formData.email,
					normalizedPhone,
					formData.password,
					formData.country,
					formData.location
				);
				// The auth context will handle navigation to verification page
			} catch (error) {
				console.error('Signup error:', error);
			}
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 flex flex-col items-center justify-center p-6">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							Create an account
						</CardTitle>
						<CardDescription className="text-center">
							Enter your details to create your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<div className="relative">
									<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										name="name"
										placeholder="Full Name"
										className="pl-9"
										value={formData.name}
										onChange={handleChange}
									/>
								</div>
								{errors.name && (
									<p className="text-xs text-red-500">{errors.name}</p>
								)}
							</div>

							<div className="space-y-2">
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										name="email"
										type="email"
										placeholder="Email"
										className="pl-9"
										value={formData.email}
										onChange={handleChange}
									/>
								</div>
								{errors.email && (
									<p className="text-xs text-red-500">{errors.email}</p>
								)}
							</div>

							<div className="space-y-2">
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										name="phone"
										type="tel"
										placeholder="Phone Number"
										className="pl-9"
										value={formData.phone}
										onChange={handleChange}
									/>
								</div>
								{errors.phone && (
									<p className="text-xs text-red-500">{errors.phone}</p>
								)}
							</div>

							<div className="space-y-2">
								<label htmlFor="country" className="text-sm font-medium">
									Country (auto-detected)
								</label>
								<Input
									id="country"
									name="country"
									value={formData.country}
									readOnly
									className="bg-muted cursor-not-allowed"
								/>
								{errors.country && (
									<p className="text-xs text-red-500">{errors.country}</p>
								)}
							</div>

							<div className="space-y-2">
								<label htmlFor="location" className="text-sm font-medium">
									City/Location
								</label>
								<div className="relative">
									<Input
										id="location"
										name="location"
										placeholder="Enter your city or location"
										value={formData.location}
										onChange={handleChange}
									/>
								</div>
								{errors.location && (
									<p className="text-xs text-red-500">{errors.location}</p>
								)}
							</div>

							<div className="space-y-2">
								<label htmlFor="password" className="text-sm font-medium">
									Password
								</label>
								<Input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									value={formData.password}
									onChange={handleChange}
								/>
								{errors.password && (
									<p className="text-xs text-red-500">{errors.password}</p>
								)}
							</div>

							<div className="space-y-2">
								<label
									htmlFor="confirmPassword"
									className="text-sm font-medium"
								>
									Confirm Password
								</label>
								<Input
									id="confirmPassword"
									name="confirmPassword"
									type={showPassword ? 'text' : 'password'}
									placeholder="Confirm Password"
									value={formData.confirmPassword}
									onChange={handleChange}
								/>
								{errors.confirmPassword && (
									<p className="text-xs text-red-500">
										{errors.confirmPassword}
									</p>
								)}
							</div>

							<Button
								type="submit"
								className="w-full"
								variant="default"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating Account...
									</>
								) : (
									'Create Account'
								)}
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex flex-col space-y-2">
						<div className="text-sm text-center text-muted-foreground">
							By creating an account, you agree to our{' '}
							<Link
								href="#"
								className="underline text-vibrant-orange hover:text-vibrant-orange/80"
							>
								Terms of Service
							</Link>{' '}
							and{' '}
							<Link
								href="#"
								className="underline text-vibrant-orange hover:text-vibrant-orange/80"
							>
								Privacy Policy
							</Link>
						</div>
						<div className="text-sm text-center">
							Already have an account?{' '}
							<Link
								href="/login"
								className="text-vibrant-orange hover:text-vibrant-orange/80 font-medium"
							>
								Sign in
							</Link>
						</div>
					</CardFooter>
				</Card>
			</main>
		</div>
	);
}
