'use client';

import {
	ArrowRight,
	Bed,
	CheckCircle,
	ChevronDown,
	Heart,
	Home,
	Menu,
	MessageSquare,
	Search,
	Shield,
	Sparkles,
	Star,
	Users,
	Wifi,
	X,
	Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { ModeToggle } from './mode-toggle';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface TestimonialProps {
	quote: string;
	author: string;
	role: string;
	avatar?: string;
}

interface FeatureProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

export function RomieSwipeLanding() {
	const [isVisible, setIsVisible] = useState<Set<string>>(new Set());
	const observerRef = useRef<IntersectionObserver | null>(null);

	// Intersection Observer for scroll animations
	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible((prev) => new Set(prev).add(entry.target.id));
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -100px 0px',
			}
		);

		// Observe all elements with scroll animation classes
		const elements = document.querySelectorAll('[data-scroll-animate]');
		elements.forEach((el) => {
			if (el.id) {
				observerRef.current?.observe(el);
			}
		});

		return () => {
			elements.forEach((el) => {
				observerRef.current?.unobserve(el);
			});
		};
	}, []);

	const features: FeatureProps[] = [
		{
			icon: <Zap className="h-8 w-8 text-primary" />,
			title: 'Smart Matching',
			description:
				'Our AI-powered algorithm finds your perfect roommate based on lifestyle, habits, and preferences.',
		},
		{
			icon: <MessageSquare className="h-8 w-8 text-primary" />,
			title: 'Easy Communication',
			description:
				'Chat directly with potential roommates and get to know them better before making any commitments.',
		},
		{
			icon: <Shield className="h-8 w-8 text-primary" />,
			title: 'Verified Profiles',
			description:
				'Every user is verified through our comprehensive background check system for your safety and peace of mind.',
		},
		{
			icon: <Star className="h-8 w-8 text-primary" />,
			title: 'Compatibility Score',
			description:
				"See at a glance how well you'll get along with potential roommates with our unique compatibility rating.",
		},
		{
			icon: <Sparkles className="h-8 w-8 text-primary" />,
			title: 'Premium Features',
			description:
				'Access advanced filters, priority matching, and exclusive features to find your ideal roommate faster.',
		},
		{
			icon: <CheckCircle className="h-8 w-8 text-primary" />,
			title: 'Safe & Secure',
			description:
				'Your data is protected with enterprise-grade security. We prioritize your privacy and safety.',
		},
	];

	const testimonials: TestimonialProps[] = [
		{
			quote:
				"RomieSwipe helped me find a roommate who shares my love for quiet evenings and clean spaces. We've been living together for 6 months now without a single argument!",
			author: 'Sarah Johnson',
			role: 'Graduate Student',
			avatar:
				'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop',
		},
		{
			quote:
				'After a string of terrible roommate experiences, RomieSwipe connected me with someone who perfectly complements my lifestyle. The compatibility score was spot on!',
			author: 'Michael Chen',
			role: 'Software Engineer',
			avatar:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop',
		},
		{
			quote:
				'As someone new to the city, RomieSwipe made finding a roommate stress-free. I was matched with someone who had similar interests and budget requirements.',
			author: 'Olivia Rodriguez',
			role: 'Marketing Specialist',
			avatar:
				'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop',
		},
	];

	return (
		<div className="flex flex-col min-h-screen bg-background">
			{/* Floating Particles Background - Reduced on mobile for performance */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
				{[...Array(15)].map((_, i) => (
					<div
						key={i}
						className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/20 float-particle hidden sm:block ${
							i % 3 === 0
								? 'float-particle-delayed'
								: i % 3 === 1
								? 'float-particle-slow'
								: ''
						}`}
						style={{
							left: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${20 + Math.random() * 10}s`,
						}}
					/>
				))}
			</div>

			{/* Hero Section */}
			<section
				id="hero"
				className="relative py-12 sm:py-16 md:py-24 lg:py-32 xl:py-40 overflow-hidden z-10"
			>
				{/* Enhanced background gradient effects */}
				<div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(217_91%_60%_/_0.12),transparent_60%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(217_91%_60%_/_0.08),transparent_50%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(217_91%_60%_/_0.04),transparent_70%)]" />
				</div>

				{/* Subtle grid pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,hsl(217_91%_60%_/_0.02)_50%,transparent_100%)] bg-[length:100px_100px] opacity-30" />

				{/* Floating shapes with better animation - Responsive sizes */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-primary/8 rounded-full blur-3xl animate-float opacity-60" />
					<div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-primary/6 rounded-full blur-3xl animate-float-delayed opacity-50" />
					<div className="absolute top-1/2 right-1/3 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-primary/4 rounded-full blur-2xl animate-float opacity-40" />
				</div>

				<div className="w-full relative z-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-center max-w-7xl mx-auto">
						<div
							id="hero-content"
							data-scroll-animate="slide-up"
							className={`space-y-6 scroll-slide-up ${
								isVisible.has('hero-content') ? 'visible' : ''
							}`}
						>
							<Badge
								className="mb-6 text-sm px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-all duration-300 inline-flex items-center gap-2"
								variant="outline"
							>
								<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
								Find Your Perfect Match
							</Badge>
							<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6">
								Find Your{' '}
								<span className="relative inline-block">
									<span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
										Perfect Roommate
									</span>
									<span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 rounded-full blur-sm" />
								</span>
							</h1>
							<p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-lg leading-relaxed">
								Swipe, match, and connect with potential roommates who match
								your lifestyle and budget.{' '}
								<span className="text-foreground font-medium">
									No more roommate horror stories.
								</span>
							</p>
							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
								<Button
									asChild
									size="lg"
									className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 h-auto group relative overflow-hidden bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] w-full sm:w-auto"
								>
									<Link
										href="/signup"
										className="flex items-center justify-center"
									>
										Get Started
										<ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
									</Link>
								</Button>
								<Button
									asChild
									size="lg"
									variant="outline"
									className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 h-auto border-2 hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] w-full sm:w-auto"
								>
									<Link href="/login" className="text-center">
										I Already Have an Account
									</Link>
								</Button>
							</div>
						</div>
						<div
							id="hero-iphones"
							data-scroll-animate="scale-in"
							className={`relative scroll-scale-in ${
								isVisible.has('hero-iphones') ? 'visible' : ''
							}`}
						>
							{/* Two iPhone Mockups Side by Side - Responsive layout */}
							<div className="relative w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 items-center justify-center mt-8 lg:mt-0">
								{/* Left iPhone - Detailed Profile Card */}
								<div className="relative w-full max-w-[240px] sm:max-w-[260px] md:w-[240px] lg:w-[280px] flex-shrink-0">
									{/* iPhone Frame */}
									<div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3.5rem] p-[6px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-[3px] border-slate-700/50">
										{/* Inner frame glow */}
										<div className="absolute inset-[3px] rounded-[3rem] bg-gradient-to-br from-slate-800/50 to-slate-900/50" />

										{/* Notch */}
										<div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-b-3xl z-30 shadow-lg">
											<div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-700/50 rounded-full" />
										</div>

										{/* Screen */}
										<div className="relative bg-background rounded-[3rem] overflow-hidden shadow-2xl border border-slate-700/30 h-[600px]">
											{/* Status Bar */}
											<div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background via-background/95 to-transparent z-10 flex items-center justify-between px-6 pt-2 backdrop-blur-sm">
												<span className="text-[10px] font-bold text-foreground tracking-tight">
													9:41
												</span>
												<div className="flex items-center gap-1">
													<div className="w-1 h-1 rounded-full bg-foreground/70" />
													<div className="w-1 h-1 rounded-full bg-foreground/70" />
													<div className="w-1 h-1 rounded-full bg-foreground/70" />
												</div>
											</div>

											{/* Detailed Profile Card */}
											<div className="h-full pt-8 px-3 pb-3 overflow-hidden">
												<div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-lg overflow-hidden border border-slate-200/60 dark:border-slate-700/50 -mt-14">
													{/* Image Section */}
													<div className="relative h-[200px]">
														<img
															src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
															alt="Room"
															className="w-full h-full object-cover"
														/>
														<div className="absolute top-3 left-3">
															<span className="bg-primary text-white text-[10px] font-semibold px-3 py-1 rounded-full">
																OFFER
															</span>
														</div>
													</div>

													{/* Profile Info Section */}
													<div className="p-4 space-y-3">
														{/* Profile Header */}
														<div className="flex items-center gap-3">
															<div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-primary">
																<img
																	src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"
																	alt="Alex"
																	className="w-full h-full object-cover"
																/>
															</div>
															<div>
																<h3 className="text-base font-bold text-slate-900 dark:text-white">
																	Alex W.
																</h3>
																<p className="text-[10px] text-slate-500 dark:text-slate-400">
																	Member since July 2024
																</p>
															</div>
														</div>

														{/* Room Details */}
														<div className="space-y-1.5">
															<p className="text-xs font-semibold text-slate-900 dark:text-white">
																Room 30 sqm
															</p>
															<p className="text-[10px] text-slate-600 dark:text-slate-400">
																Berlin Mitte, Senefelderstr. 10, 10321
															</p>
															<p className="text-[10px] text-slate-600 dark:text-slate-400">
																Unlimited starting 1 Jan 2025
															</p>
															<p className="text-sm font-bold text-slate-900 dark:text-white">
																800€/month
															</p>
														</div>

														{/* Features */}
														<div>
															<p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
																Features
															</p>
															<div className="flex flex-wrap gap-1.5">
																{[
																	'Bed',
																	'Furnished',
																	'Desk',
																	'TV',
																	'Kitchen',
																	'Pet friendly',
																	'Balcony',
																	'Wifi',
																].map((feature) => (
																	<span
																		key={feature}
																		className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full"
																	>
																		{feature}
																	</span>
																))}
															</div>
														</div>

														{/* Good to know */}
														<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5">
															<p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
																Good to know
															</p>
															<p className="text-[9px] text-slate-600 dark:text-slate-400 leading-relaxed">
																The flat is located in a quiet neighborhood with
																great public transport connections.
															</p>
														</div>

														{/* CTA Button */}
														<button className="w-full bg-primary text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-1">
															Go to chat <ArrowRight className="h-3 w-3" />
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Right iPhone - Explore Listings */}
								<div className="relative w-full max-w-[240px] sm:max-w-[260px] md:w-[240px] lg:w-[280px] flex-shrink-0">
									{/* iPhone Frame */}
									<div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3.5rem] p-[6px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-[3px] border-slate-700/50">
										{/* Inner frame glow */}
										<div className="absolute inset-[3px] rounded-[3rem] bg-gradient-to-br from-slate-800/50 to-slate-900/50" />

										{/* Notch */}
										<div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-b-3xl z-30 shadow-lg">
											<div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-slate-700/50 rounded-full" />
										</div>

										{/* Screen */}
										<div className="relative bg-background rounded-[3rem] overflow-hidden shadow-2xl border border-slate-700/30 h-[500px] sm:h-[550px] md:h-[600px]">
											{/* Status Bar */}
											<div className="absolute top-0 left-0 right-0 h-10 sm:h-12 bg-gradient-to-b from-background via-background/95 to-transparent z-10 flex items-center justify-between px-4 sm:px-6 pt-2 backdrop-blur-sm">
												<span className="text-[9px] sm:text-[10px] font-bold text-foreground tracking-tight">
													9:41
												</span>
												<div className="flex items-center gap-0.5 sm:gap-1">
													<div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-foreground/70" />
													<div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-foreground/70" />
													<div className="w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-foreground/70" />
												</div>
											</div>

											{/* Explore Listings Content */}
											<div className="h-full pt-10 sm:pt-12 pb-14 sm:pb-16 flex flex-col">
												{/* Header */}
												<div className="px-4 pt-2 pb-3">
													<h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
														Explore Listings
													</h2>

													{/* Tabs */}
													<div className="flex gap-2 mb-3">
														<button className="text-xs font-semibold text-slate-900 dark:text-white border-b-2 border-primary pb-1">
															Offers
														</button>
														<button className="text-xs font-medium text-slate-500 dark:text-slate-400 pb-1">
															Searches
														</button>
													</div>

													{/* Search Bar */}
													<div className="relative">
														<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
														<input
															type="text"
															placeholder="Q City or area"
															className="w-full bg-slate-100 dark:bg-slate-800 text-xs py-2 pl-9 pr-8 rounded-xl border-0 focus:ring-2 focus:ring-primary/20"
														/>
														<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
													</div>
												</div>

												{/* Listing Cards */}
												<div className="flex-1 overflow-hidden px-4 space-y-3">
													{/* Listing Card 1 - Starts from profile section (image cut off) */}
													<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-slate-200/60 dark:border-slate-700/50 -mt-12">
														<div className="p-3">
															<div className="flex items-center gap-2 mb-2">
																<div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-600">
																	<img
																		src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"
																		alt="Juli"
																		className="w-full h-full object-cover"
																	/>
																</div>
																<span className="text-[10px] font-semibold text-slate-900 dark:text-white">
																	Juli D.
																</span>
															</div>
															<p className="text-[10px] text-slate-600 dark:text-slate-400 mb-1">
																Room 18sqm • Furnished
															</p>
															<p className="text-[10px] text-slate-600 dark:text-slate-400 mb-1">
																Berlin Mitte
															</p>
															<p className="text-[10px] text-slate-600 dark:text-slate-400 mb-1">
																Limited 1 Sep, 2024 - 2 Dec, 2024
															</p>
															<p className="text-xs font-bold text-slate-900 dark:text-white">
																Price 1200€
															</p>
														</div>
													</div>

													{/* Listing Card 2 */}
													<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden border border-slate-200/60 dark:border-slate-700/50">
														<div className="relative h-32">
															<img
																src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"
																alt="Room"
																className="w-full h-full object-cover"
															/>
														</div>
														<div className="p-3">
															<div className="flex items-center gap-2 mb-2">
																<div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-600">
																	<img
																		src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3"
																		alt="Tobi"
																		className="w-full h-full object-cover"
																	/>
																</div>
																<span className="text-[10px] font-semibold text-slate-900 dark:text-white">
																	Tobi S.
																</span>
															</div>
															<p className="text-[10px] text-slate-600 dark:text-slate-400 mb-1">
																Room 25sqm • Furnished
															</p>
															<p className="text-[10px] text-slate-600 dark:text-slate-400 mb-1">
																Berlin Mitte
															</p>
															<p className="text-xs font-bold text-slate-900 dark:text-white">
																Price 950€
															</p>
														</div>
													</div>
												</div>

												{/* Bottom Navigation */}
												<div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-around px-2">
													{['Explore', 'Save', 'Create', 'Chat', 'Profile'].map(
														(item, idx) => (
															<button
																key={item}
																className="flex flex-col items-center gap-1"
															>
																<div
																	className={`w-5 h-5 rounded-full ${
																		idx === 0
																			? 'bg-primary'
																			: 'bg-slate-300 dark:bg-slate-600'
																	}`}
																/>
																<span className="text-[8px] text-slate-600 dark:text-slate-400">
																	{item}
																</span>
															</button>
														)
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id="features"
				className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30 relative overflow-hidden z-10"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(217_91%_60%_/_0.03),transparent_70%)]" />
				<div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
					<div
						id="features-header"
						data-scroll-animate="fade-in"
						className={`text-center mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto scroll-fade-in ${
							isVisible.has('features-header') ? 'visible' : ''
						}`}
					>
						<Badge
							className="mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm bg-primary/10 text-primary border-primary/20"
							variant="outline"
						>
							Features
						</Badge>
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-4 sm:px-0">
							Everything You Need to Find the Perfect Roommate
						</h2>
						<p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
							Our platform is designed to make finding a compatible roommate as
							easy and stress-free as possible.
						</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
						{features.map((feature, index) => (
							<div
								key={index}
								id={`feature-${index}`}
								data-scroll-animate="slide-up"
								className={`group relative bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/30 hover:-translate-y-2 scroll-slide-up ${
									isVisible.has(`feature-${index}`) ? 'visible' : ''
								}`}
								style={{ transitionDelay: `${index * 100}ms` }}
							>
								<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10">
									<div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
										<div className="text-primary scale-75 sm:scale-100">
											{feature.icon}
										</div>
									</div>
									<h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors">
										{feature.title}
									</h3>
									<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section
				id="how-it-works"
				className="py-12 sm:py-16 md:py-20 lg:py-24 relative z-10"
			>
				<div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
				<div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
					<div
						id="how-it-works-header"
						data-scroll-animate="fade-in"
						className={`text-center mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto scroll-fade-in ${
							isVisible.has('how-it-works-header') ? 'visible' : ''
						}`}
					>
						<Badge
							className="mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm bg-primary/10 text-primary border-primary/20"
							variant="outline"
						>
							How It Works
						</Badge>
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-4 sm:px-0">
							Finding a Roommate Made Simple
						</h2>
						<p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
							Our streamlined process makes finding your ideal roommate quick
							and easy.
						</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
						{[1, 2, 3].map((step, index) => {
							const steps = [
								{
									icon: <Users className="h-8 w-8" />,
									title: 'Create Your Profile',
									description:
										"Sign up and create a detailed profile about your lifestyle, preferences, and what you're looking for in a roommate.",
								},
								{
									icon: <Home className="h-8 w-8" />,
									title: 'Browse Matches',
									description:
										'Our algorithm will suggest potential roommates based on compatibility, location preferences, and budget.',
								},
								{
									icon: <MessageSquare className="h-8 w-8" />,
									title: 'Connect & Meet',
									description:
										'Chat with your matches, arrange meetups, and find your perfect roommate match.',
								},
							];
							const stepData = steps[index];
							return (
								<div
									key={index}
									id={`step-${index}`}
									data-scroll-animate="scale-in"
									className={`relative group scroll-scale-in ${
										isVisible.has(`step-${index}`) ? 'visible' : ''
									}`}
									style={{ transitionDelay: `${index * 150}ms` }}
								>
									{/* Connecting line - Only show on larger screens */}
									{index < 2 && (
										<div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-primary/20 -z-10" />
									)}
									<div className="relative flex flex-col items-center text-center bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
										<div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold text-base sm:text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
											{step}
										</div>
										<div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
											<div className="text-primary scale-75 sm:scale-100">
												{stepData.icon}
											</div>
										</div>
										<h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 group-hover:text-primary transition-colors">
											{stepData.title}
										</h3>
										<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
											{stepData.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section
				id="testimonials"
				className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30 relative overflow-hidden z-10"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,hsl(217_91%_60%_/_0.05),transparent_70%)]" />
				<div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
					<div
						id="testimonials-header"
						data-scroll-animate="fade-in"
						className={`text-center mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto scroll-fade-in ${
							isVisible.has('testimonials-header') ? 'visible' : ''
						}`}
					>
						<Badge
							className="mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm bg-primary/10 text-primary border-primary/20"
							variant="outline"
						>
							Testimonials
						</Badge>
						<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-4 sm:px-0">
							What Our Users Say
						</h2>
						<p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
							Thousands of people have found their perfect roommate through
							RomieSwipe.
						</p>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
						{testimonials.map((testimonial, index) => (
							<div
								key={index}
								id={`testimonial-${index}`}
								data-scroll-animate="slide-up"
								className={`group relative bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/30 hover:-translate-y-2 scroll-slide-up ${
									isVisible.has(`testimonial-${index}`) ? 'visible' : ''
								}`}
								style={{ transitionDelay: `${index * 100}ms` }}
							>
								<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								<div className="relative z-10">
									<div className="flex mb-4 sm:mb-6">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className="h-4 w-4 sm:h-5 sm:w-5 text-primary fill-primary"
											/>
										))}
									</div>
									<p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 italic leading-relaxed">
										"{testimonial.quote}"
									</p>
									<div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/50">
										{testimonial.avatar && (
											<div className="relative">
												<div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
													<img
														src={testimonial.avatar}
														alt={testimonial.author}
														className="object-cover w-full h-full"
													/>
												</div>
											</div>
										)}
										<div>
											<p className="text-sm sm:text-base font-bold text-foreground">
												{testimonial.author}
											</p>
											<p className="text-xs sm:text-sm text-muted-foreground">
												{testimonial.role}
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section - Redesigned */}
			<section
				id="signup"
				className="relative py-12 sm:py-16 md:py-24 lg:py-32 px-4 overflow-hidden z-10"
			>
				{/* Subtle background */}
				<div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(217_91%_60%_/_0.05),transparent_70%)]" />

				<div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10 max-w-7xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
						{/* Left side - Content */}
						<div
							id="cta-content"
							data-scroll-animate="slide-up"
							className={`space-y-8 scroll-slide-up ${
								isVisible.has('cta-content') ? 'visible' : ''
							}`}
						>
							<Badge
								className="mb-4 px-4 py-1.5 bg-primary/10 text-primary border-primary/20"
								variant="outline"
							>
								Get Started Today
							</Badge>
							<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
								Ready to Find Your{' '}
								<span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
									Perfect Match?
								</span>
							</h2>
							<p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
								Join thousands of satisfied users who have found their ideal
								living situation through RomieSwipe. Start your journey today.
							</p>

							{/* Stats */}
							<div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4">
								<div>
									<div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
										10K+
									</div>
									<div className="text-xs sm:text-sm text-muted-foreground">
										Active Users
									</div>
								</div>
								<div>
									<div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
										50K+
									</div>
									<div className="text-xs sm:text-sm text-muted-foreground">
										Matches Made
									</div>
								</div>
								<div>
									<div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
										98%
									</div>
									<div className="text-xs sm:text-sm text-muted-foreground">
										Satisfaction
									</div>
								</div>
							</div>

							<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
								<Button
									asChild
									size="lg"
									className="text-base px-8 py-6 h-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
								>
									<Link href="/signup" className="flex items-center">
										Get Started
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
								<Button
									asChild
									size="lg"
									variant="outline"
									className="text-base px-8 py-6 h-auto border-2 hover:bg-accent transition-all duration-300 hover:scale-105 font-semibold"
								>
									<Link href="/login">I Already Have an Account</Link>
								</Button>
							</div>
						</div>

						{/* Right side - Visual Card */}
						<div
							id="cta-visual"
							data-scroll-animate="scale-in"
							className={`relative scroll-scale-in ${
								isVisible.has('cta-visual') ? 'visible' : ''
							}`}
						>
							<div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-primary/20 backdrop-blur-sm shadow-2xl">
								{/* Decorative elements */}
								<div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full blur-3xl -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16" />
								<div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-primary/10 rounded-full blur-2xl translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12" />

								<div className="relative z-10 space-y-4 sm:space-y-6">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
											<Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
										</div>
										<div>
											<div className="text-sm sm:text-base font-semibold text-foreground">
												Quick Setup
											</div>
											<div className="text-xs sm:text-sm text-muted-foreground">
												5 minutes
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
											<Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary fill-primary" />
										</div>
										<div>
											<div className="text-sm sm:text-base font-semibold text-foreground">
												Verified Profiles
											</div>
											<div className="text-xs sm:text-sm text-muted-foreground">
												100% authentic
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
											<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
										</div>
										<div>
											<div className="text-sm sm:text-base font-semibold text-foreground">
												Instant Messaging
											</div>
											<div className="text-xs sm:text-sm text-muted-foreground">
												Connect easily
											</div>
										</div>
									</div>

									<div className="pt-4 sm:pt-6 border-t border-border/50">
										<div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
											<div className="flex -space-x-1.5 sm:-space-x-2">
												{[1, 2, 3, 4].map((i) => (
													<div
														key={i}
														className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 border-2 border-background"
													/>
												))}
											</div>
											<span className="ml-1 sm:ml-2">
												Join 10,000+ happy users
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 sm:py-12 md:py-16 bg-background border-t border-border/50 relative">
				<div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,hsl(217_91%_60%_/_0.02))]" />
				<div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 relative z-10">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 max-w-7xl mx-auto">
						<div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
							RomieSwipe
						</div>
						<div className="flex gap-4 sm:gap-6 md:gap-8 flex-wrap justify-center">
							<Link
								href="#"
								className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
							>
								Privacy Policy
							</Link>
							<Link
								href="#"
								className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
							>
								Terms of Service
							</Link>
							<Link
								href="#"
								className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
							>
								Contact Us
							</Link>
						</div>
					</div>
					<div className="mt-12 pt-8 text-center text-sm text-muted-foreground border-t border-border/50">
						© 2025 RomieSwipe. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
