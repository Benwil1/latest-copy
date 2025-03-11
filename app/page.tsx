'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { ArrowRight, Heart, MessageSquare, Search, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	// Redirect to home if already logged in
	useEffect(() => {
		if (user && !isLoading) {
			router.push('/home');
		}
	}, [user, isLoading, router]);

	return (
		<div className="relative flex flex-col min-h-screen bg-background overflow-hidden">
			{/* Animated gradient background */}
			<div className="absolute inset-0 bg-gradient-to-br from-background to-background">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#ff6b0020,transparent_70%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#ff6b0015,transparent_50%)]" />
			</div>

			{/* Floating shapes */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-vibrant-orange/5 rounded-full blur-3xl animate-float" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vibrant-orange/5 rounded-full blur-3xl animate-float-delayed" />
			</div>

			<header className="relative z-10 p-6 flex justify-between items-center">
				<div className="text-3xl font-bold bg-gradient-to-r from-vibrant-orange to-orange-500 bg-clip-text text-transparent">
					DwellMatch
				</div>
				<ModeToggle />
			</header>

			<main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
				<div className="max-w-xl mx-auto text-center mb-12">
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
						Find Your Perfect Roommate
					</h1>
					<p className="text-lg sm:text-xl text-muted-foreground mb-8">
						Swipe, match, and connect with potential roommates who match your
						lifestyle and budget.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							asChild
							size="lg"
							className="bg-vibrant-orange hover:bg-orange-600 text-white gap-2 h-12 px-8 text-lg"
						>
							<Link href="/signup">
								Get Started
								<ArrowRight className="h-5 w-5" />
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="gap-2 h-12 px-8 text-lg"
						>
							<Link href="/login">I Already Have an Account</Link>
						</Button>
					</div>
				</div>

				{/* Profile cards stack */}
				<div className="relative w-full max-w-sm h-96 mx-auto mb-16">
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-96">
						<div className="absolute top-0 left-0 w-full h-full">
							<div className="w-full h-full bg-card rounded-3xl shadow-lg transform -rotate-6 transition-transform hover:rotate-0 overflow-hidden">
								<div className="relative w-full h-full">
									<img
										src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"
										alt="Profile example"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
										<h3 className="text-2xl font-semibold mb-1">Olivia, 25</h3>
										<p className="text-lg text-white/90 mb-3">
											Downtown • $1300/mo
										</p>
										<div className="flex flex-wrap gap-2">
											<span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
												Student
											</span>
											<span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
												Clean
											</span>
											<span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
												Early bird
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-96">
						<div className="absolute top-0 left-0 w-full h-full">
							<div className="w-full h-full bg-card rounded-3xl shadow-lg transform rotate-3 transition-transform hover:rotate-0 overflow-hidden">
								<div className="relative w-full h-full">
									<img
										src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"
										alt="Profile example"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
										<h3 className="text-2xl font-semibold mb-1">Sarah, 26</h3>
										<p className="text-lg text-white/90 mb-3">
											Downtown • $1200/mo
										</p>
										<div className="flex flex-wrap gap-2">
											<span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
												Professional
											</span>
											<span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
												Pet-friendly
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-96">
						<div className="absolute top-0 left-0 w-full h-full">
							<div className="w-full h-full bg-card rounded-3xl shadow-lg transform transition-transform hover:rotate-0 overflow-hidden">
								<div className="relative w-full h-full">
									<img
										src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"
										alt="Profile example"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
									<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
										<h3 className="text-2xl font-semibold mb-1">Michael, 28</h3>
										<p className="text-lg text-white/90 mb-3">
											Midtown • $1500/mo
										</p>
										<div className="flex flex-wrap gap-2">
											<span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
												Student
											</span>
											<span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
												Night owl
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Features section */}
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
					<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm">
						<div className="h-14 w-14 rounded-full bg-vibrant-orange/10 flex items-center justify-center mb-4">
							<Search className="h-7 w-7 text-vibrant-orange" />
						</div>
						<h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
						<p className="text-muted-foreground">
							Find roommates that match your lifestyle, habits, and preferences.
						</p>
					</div>
					<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm">
						<div className="h-14 w-14 rounded-full bg-vibrant-orange/10 flex items-center justify-center mb-4">
							<MessageSquare className="h-7 w-7 text-vibrant-orange" />
						</div>
						<h3 className="text-xl font-semibold mb-3">Easy Communication</h3>
						<p className="text-muted-foreground">
							Chat with potential roommates and get to know them better.
						</p>
					</div>
					<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm">
						<div className="h-14 w-14 rounded-full bg-vibrant-orange/10 flex items-center justify-center mb-4">
							<Heart className="h-7 w-7 text-vibrant-orange" />
						</div>
						<h3 className="text-xl font-semibold mb-3">Perfect Match</h3>
						<p className="text-muted-foreground">
							Like and match with roommates you're interested in.
						</p>
					</div>
				</div>
			</main>

			<footer className="relative z-10 p-6 text-center">
				<p className="text-sm text-muted-foreground">
					© 2025 DwellMatch. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
