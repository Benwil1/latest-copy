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
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForgotPasswordPage() {
	const router = useRouter();
	const { resetPassword, isLoading } = useAuth();
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!email.trim()) {
			setError('Email is required');
			return;
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			setError('Email is invalid');
			return;
		}

		try {
			await resetPassword(email);
			// The auth context will handle navigation and toast
		} catch (error) {
			console.error('Password reset error:', error);
			setError('Failed to send password reset email. Please try again.');
		}
	};

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 flex flex-col items-center justify-center p-6">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center">
							Forgot Password
						</CardTitle>
						<CardDescription className="text-center">
							Enter your email address and we'll send you a link to reset your
							password
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										type="email"
										placeholder="Email"
										className="pl-9"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											setError('');
										}}
									/>
								</div>
								{error && <p className="text-xs text-red-500">{error}</p>}
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
										Sending Reset Link...
									</>
								) : (
									'Send Reset Link'
								)}
							</Button>
						</form>
					</CardContent>
					<CardFooter>
						<div className="text-sm text-center w-full">
							Remember your password?{' '}
							<Link
								href="/login"
								className="text-vibrant-orange hover:text-vibrant-orange/80 font-medium"
							>
								Back to login
							</Link>
						</div>
					</CardFooter>
				</Card>
			</main>
		</div>
	);
}
