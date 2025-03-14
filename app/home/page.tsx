'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import MobileNav from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
	Bell,
	Calendar,
	CheckCircle,
	DollarSign,
	Flag,
	Heart,
	MapPin,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

// Sample roommate data
const roommates = [
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
		compatibility: 92,
		verified: true,
		tags: ['Non-smoker', 'Pet-friendly', 'Early riser', 'Clean'],
		bio: 'Software engineer who loves hiking and cooking. Looking for a quiet and clean roommate.',
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
		compatibility: 85,
		verified: true,
		tags: ['Non-smoker', 'Night owl', 'Fitness enthusiast', 'Social'],
		bio: "Marketing professional who enjoys fitness and weekend adventures. I'm tidy and respectful of shared spaces.",
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
		compatibility: 78,
		verified: false,
		tags: ['Occasional smoker', 'Pet owner', 'Creative', 'Relaxed'],
		bio: "Graphic designer with a small cat. I'm creative, laid-back, and enjoy having friends over occasionally.",
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
		compatibility: 81,
		verified: true,
		tags: ['Non-smoker', 'Vegetarian', 'Early riser', 'Tech enthusiast'],
		bio: "Software developer who loves cooking Indian food. I'm clean, quiet, and respectful of shared spaces.",
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
		compatibility: 89,
		verified: true,
		tags: ['Non-smoker', 'Student', 'Clean', 'Foodie'],
		bio: 'Graduate student studying business. I enjoy trying new restaurants, watching movies, and keeping a tidy home.',
	},
];

export default function HomePage() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
	const [showDetails, setShowDetails] = useState(false);
	const [startX, setStartX] = useState(0);
	const [offsetX, setOffsetX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const cardRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	const currentRoommate = roommates[currentIndex];

	const handleSwipe = (direction: string) => {
		setSwipeDirection(direction);

		// Reset swipe direction and move to next profile after animation
		setTimeout(() => {
			setSwipeDirection(null);
			if (currentIndex < roommates.length - 1) {
				setCurrentIndex(currentIndex + 1);
			} else {
				// Reset to first profile when we reach the end
				setCurrentIndex(0);
			}
			setShowDetails(false);
			setOffsetX(0);
		}, 300);
	};

	const toggleDetails = () => {
		setShowDetails(!showDetails);
	};

	// Touch and mouse event handlers for swiping
	const handleTouchStart = (e: React.TouchEvent) => {
		setStartX(e.touches[0].clientX);
		setIsDragging(true);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging) return;
		const currentX = e.touches[0].clientX;
		const diff = currentX - startX;
		setOffsetX(diff);
	};

	const handleTouchEnd = () => {
		if (!isDragging) return;
		setIsDragging(false);

		if (offsetX > 100) {
			// Swiped right
			handleSwipe('right');
		} else if (offsetX < -100) {
			// Swiped left
			handleSwipe('left');
		} else {
			// Reset if not swiped far enough
			setOffsetX(0);
		}
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		setStartX(e.clientX);
		setIsDragging(true);
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		const currentX = e.clientX;
		const diff = currentX - startX;
		setOffsetX(diff);
	};

	const handleMouseUp = () => {
		if (!isDragging) return;
		setIsDragging(false);

		if (offsetX > 100) {
			// Swiped right
			handleSwipe('right');
		} else if (offsetX < -100) {
			// Swiped left
			handleSwipe('left');
		} else {
			// Reset if not swiped far enough
			setOffsetX(0);
		}
	};

	// Clean up mouse events when component unmounts
	useEffect(() => {
		const handleMouseUpGlobal = () => {
			if (isDragging) {
				setIsDragging(false);
				if (offsetX > 100) {
					handleSwipe('right');
				} else if (offsetX < -100) {
					handleSwipe('left');
				} else {
					setOffsetX(0);
				}
			}
		};

		window.addEventListener('mouseup', handleMouseUpGlobal);
		return () => {
			window.removeEventListener('mouseup', handleMouseUpGlobal);
		};
	}, [isDragging, offsetX]);

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-background">
				<main className="container mx-auto px-0 sm:px-4 py-4">
					{/* Progress bar showing profiles viewed */}
					<div className="max-w-3xl mx-auto mb-4 px-4">
						<div className="flex items-center gap-1">
							{roommates.map((_, index) => (
								<div
									key={index}
									className={`h-1 flex-1 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-vibrant-orange' : index < currentIndex ? 'bg-vibrant-orange/30' : 'bg-gray-200 dark:bg-gray-700'}`}
								/>
							))}
						</div>
					</div>

					<div className="max-w-3xl mx-auto">
						<Card
							ref={cardRef}
							className={`overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 h-[calc(100vh-16rem)] md:h-[calc(100vh-10rem)] md:max-h-[800px] mx-0 sm:mx-4 bg-gradient-to-br from-pink-100 to-purple-100 ${swipeDirection === 'left' ? 'animate-swipe-left' : swipeDirection === 'right' ? 'animate-swipe-right' : ''} ${isDragging ? 'scale-[1.02]' : ''}`}
							style={isDragging ? { transform: `translateX(${offsetX}px) scale(1.02)`, cursor: 'grabbing' } : { cursor: 'grab' }}
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
							onMouseDown={handleMouseDown}
							onMouseMove={handleMouseMove}
							onMouseUp={handleMouseUp}
							onMouseLeave={handleMouseUp}
						>
							<div className="relative h-full bg-background group">
								{/* Main profile image */}
								<div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.02]">
									<img
										src={currentRoommate.image}
										alt={currentRoommate.name}
										className="h-full w-full object-cover object-top rounded-3xl"
									/>
								</div>

								{/* Gradient overlays */}
								<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
								<div className="absolute inset-0 bg-gradient-to-t from-black/90 h-[40%] bottom-0 top-auto" />

								{/* Swipe indicators */}
								{offsetX > 50 && (
									<div className="absolute top-8 left-8 bg-green-500 text-white rounded-full p-4 transform rotate-[-15deg] z-20 shadow-xl animate-bounce-subtle">
										<Heart className="h-12 w-12" />
									</div>
								)}
								{offsetX < -50 && (
									<div className="absolute top-8 right-8 bg-red-500 text-white rounded-full p-4 transform rotate-[15deg] z-20 shadow-xl animate-bounce-subtle">
										<X className="h-12 w-12" />
									</div>
								)}

								{/* Profile info */}
								<div className="absolute bottom-0 inset-x-0 p-6 pb-28 z-10">
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<div>
												<h2 className="text-3xl font-bold text-white flex items-center gap-2">
													{currentRoommate.name} {currentRoommate.verified && (
														<CheckCircle className="h-6 w-6 text-vibrant-orange" />
													)}
												</h2>
												<p className="text-lg text-gray-200">{currentRoommate.age} • {currentRoommate.nationality}</p>
											</div>
											<Badge variant="orange" className="text-sm px-3 py-1.5">
												{currentRoommate.compatibility}% Match
											</Badge>
										</div>

										<div className="flex items-center gap-4 text-white text-lg">
											<div className="flex items-center gap-1">
												<DollarSign className="h-5 w-5 text-vibrant-orange" />
												${currentRoommate.budget}/mo
											</div>
											<div className="flex items-center gap-1">
												<MapPin className="h-5 w-5 text-vibrant-orange" />
												{currentRoommate.location}
											</div>
										</div>

										<div className="flex flex-wrap gap-2">
											{currentRoommate.tags.map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="bg-white/10 hover:bg-white/20 transition-colors text-white border-none"
												>
													{tag}
												</Badge>
											))}
										</div>
									</div>
								</div>

								{/* Action buttons */}
								<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-20">
									<button
										className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-xl hover:bg-gray-50 transform transition-all hover:scale-110 active:scale-95 border-2 border-red-500/20"
										onClick={() => handleSwipe('left')}
										aria-label="Pass"
									>
										<X className="h-8 w-8 text-red-500" />
									</button>

									<button
										className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-xl hover:bg-gray-50 transform transition-all hover:scale-110 active:scale-95 border-2 border-green-500/20"
										onClick={() => handleSwipe('right')}
										aria-label="Like"
									>
										<Heart className="h-8 w-8 text-green-500" />
									</button>
								</div>
							</div>
						</Card>
					</div>
				</main>

				<MobileNav />
			</div>
		</ProtectedRoute>
	);
}
