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
				<header className="p-4 flex justify-between items-center">
					<Link href="/home" className="text-2xl font-bold text-vibrant-orange">
						RoomieMatch
					</Link>
					<div className="flex items-center gap-4">
						<button
							className="text-gray-400 hover:text-gray-300"
							aria-label="Notifications"
						>
							<Bell className="h-6 w-6" />
						</button>
						<div className="text-gray-400">
							<ModeToggle />
						</div>
					</div>
				</header>

				<main className="container mx-auto p-4">
					<div className="flex items-center mb-4">
						<h1 className="text-2xl font-semibold">Explore Roommates</h1>
					</div>

					<Card
						ref={cardRef}
						className={`overflow-hidden rounded-2xl shadow-lg transition-all duration-300 h-[calc(100vh-12rem)] ${
							swipeDirection === 'left'
								? 'animate-swipe-left'
								: swipeDirection === 'right'
								? 'animate-swipe-right'
								: ''
						}`}
						style={
							isDragging
								? {
										transform: `translateX(${offsetX}px) rotate(${
											offsetX * 0.05
										}deg)`,
										transition: 'none',
								  }
								: undefined
						}
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
					>
						<div className="relative h-full">
							<img
								src={currentRoommate.image}
								alt={currentRoommate.name}
								className="h-full w-full object-cover"
							/>
							{offsetX > 50 && (
								<div className="absolute top-4 left-4 bg-green-500 text-white rounded-full p-2 transform rotate-[-15deg]">
									<Heart className="h-8 w-8" />
								</div>
							)}
							{offsetX < -50 && (
								<div className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 transform rotate-[15deg]">
									<X className="h-8 w-8" />
								</div>
							)}
							<div className="absolute bottom-0 inset-x-0 bg-gradient-from-transparent bg-gradient-to-b from-transparent via-black/70 to-black h-2/5 p-4">
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-2">
										<h2 className="text-2xl font-semibold text-white">
											{currentRoommate.name}, {currentRoommate.age}
										</h2>
										{currentRoommate.verified && (
											<CheckCircle className="h-5 w-5 text-blue-500" />
										)}
									</div>
									<Badge variant="secondary" className="text-sm">
										{currentRoommate.compatibility}% Match
									</Badge>
								</div>

								<div className="flex items-center gap-4 text-gray-200 mb-3">
									<div className="flex items-center">
										<DollarSign className="h-4 w-4 mr-1" />
										<span>${currentRoommate.budget}/mo</span>
									</div>
									<div className="flex items-center">
										<MapPin className="h-4 w-4 mr-1" />
										<span>{currentRoommate.location}</span>
									</div>
									<div className="flex items-center">
										<Calendar className="h-4 w-4 mr-1" />
										<span>{currentRoommate.moveIn}</span>
									</div>
								</div>

								<div className="flex flex-wrap gap-2">
									{currentRoommate.tags.map((tag) => (
										<Badge key={tag} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
							</div>
						</div>
					</Card>

					<div className="fixed bottom-20 inset-x-0">
						<div className="flex justify-center items-center gap-6">
							<button
								className="h-12 w-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transform transition-transform hover:scale-110"
								onClick={() => handleSwipe('left')}
								aria-label="Pass"
							>
								<X className="h-6 w-6 text-red-500" />
							</button>

							<button
								className="h-12 w-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transform transition-transform hover:scale-110"
								onClick={() => handleSwipe('right')}
								aria-label="Like"
							>
								<Heart className="h-6 w-6 text-green-500" />
							</button>
						</div>
					</div>
				</main>

				<MobileNav />
			</div>
		</ProtectedRoute>
	);
}
