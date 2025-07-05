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
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
	const router = useRouter();
	const { login, isLoading } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
			valid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid';
			valid = false;
		}

		if (!formData.password) {
			newErrors.password = 'Password is required';
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			try {
				await login(formData.email, formData.password);
				// The auth context will handle navigation to home page
			} catch (error) {
				console.error('Login error:', error);
			}
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 flex flex-col items-center justify-center p-6">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							Welcome back
						</CardTitle>
						<CardDescription className="text-center">
							Enter your credentials to sign in to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
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
									<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										name="password"
										type={showPassword ? 'text' : 'password'}
										placeholder="Password"
										className="pl-9"
										value={formData.password}
										onChange={handleChange}
									/>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="absolute right-1 top-1/2 transform -translate-y-1/2"
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? (
											<EyeOff className="h-4 w-4 text-muted-foreground" />
										) : (
											<Eye className="h-4 w-4 text-muted-foreground" />
										)}
									</Button>
								</div>
								{errors.password && (
									<p className="text-xs text-red-500">{errors.password}</p>
								)}
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-2">
									<input
										type="checkbox"
										id="remember"
										className="h-4 w-4 rounded border-gray-300 text-vibrant-orange focus:ring-vibrant-orange"
									/>
									<label
										htmlFor="remember"
										className="text-sm text-muted-foreground"
									>
										Remember me
									</label>
								</div>
								<Link
									href="/forgot-password"
									className="text-sm text-vibrant-orange hover:text-vibrant-orange/80"
								>
									Forgot password?
								</Link>
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
										Signing in...
									</>
								) : (
									'Sign In'
								)}
							</Button>
						</form>
					</CardContent>
					<CardFooter>
						<div className="text-sm text-center w-full">
							Don't have an account?{' '}
							<Link
								href="/signup"
								className="text-vibrant-orange hover:text-vibrant-orange/80 font-medium"
							>
								Sign up
							</Link>
						</div>
					</CardFooter>
				</Card>
			</main>
		</div>
	);
}
