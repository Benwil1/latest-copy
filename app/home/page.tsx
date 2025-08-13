'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import MobileNav from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import apiClient from '@/lib/api-client';
import {
	Bell,
	Calendar,
	CheckCircle,
	DollarSign,
	Flag,
	Heart,
	Info,
	MapPin,
	Star,
	Undo2,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

// Type definition for user data from backend
interface User {
        id: string;
        name: string;
        age?: number;
        nationality?: string;
        profile_picture?: string;
        budget?: number;
        location?: string;
        move_in_date?: string;
        bio?: string;
        interests?: string[];
        verification_status?: string;
        lifestyle?: any;
}

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
		interests: ['Hiking', 'Cooking', 'Reading', 'Photography'],
		lifestyle: {
			cleanliness: 'Very clean',
			noise: 'Quiet',
			schedule: 'Early riser',
			pets: 'Pet-friendly',
		},
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
		interests: ['Fitness', 'Travel', 'Music', 'Cooking'],
		lifestyle: {
			cleanliness: 'Clean',
			noise: 'Moderate',
			schedule: 'Night owl',
			pets: 'No pets',
		},
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
		interests: ['Art', 'Design', 'Movies', 'Cats'],
		lifestyle: {
			cleanliness: 'Average',
			noise: "Don't mind noise",
			schedule: 'Flexible',
			pets: 'Has pets',
		},
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
		interests: ['Technology', 'Cooking', 'Gaming', 'Movies'],
		lifestyle: {
			cleanliness: 'Very clean',
			noise: 'Quiet',
			schedule: 'Early riser',
			pets: 'No pets',
		},
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
		interests: ['Food', 'Business', 'Movies', 'Travel'],
		lifestyle: {
			cleanliness: 'Very clean',
			noise: 'Quiet',
			schedule: 'Early riser',
			pets: 'Pet-friendly',
		},
	},
];

export default function HomePage() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
	const [showDetails, setShowDetails] = useState(false);
	const [startX, setStartX] = useState(0);
	const [offsetX, setOffsetX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
	const [passedProfiles, setPassedProfiles] = useState<string[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const [matchCount, setMatchCount] = useState(0);
	const [actionHistory, setActionHistory] = useState<
		{ type: 'like' | 'dislike'; userId: string }[]
	>([]);

	// Fetch users from backend on component mount
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const response = await apiClient.getUsers();
				if (response && Array.isArray(response)) {
					setUsers(response);
				} else {
					console.error('Invalid users response:', response);
					setError('Failed to load users');
				}
			} catch (error) {
				console.error('Failed to fetch users:', error);
				setError('Failed to load potential roommates');
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	const currentRoommate = users[currentIndex];

	const handleSwipe = async (direction: string) => {
		if (!currentRoommate) return;

		setSwipeDirection(direction);
		const action = direction === 'right' ? 'like' : 'dislike';
		
		try {
			// Call backend API to record the like/dislike action
			if (direction === 'right') {
				await apiClient.likeUser(currentRoommate.id);
				setLikedProfiles((prev) => [...prev, currentRoommate.id]);
			} else {
				await apiClient.dislikeUser(currentRoommate.id);
				setPassedProfiles((prev) => [...prev, currentRoommate.id]);
			}

			setActionHistory((prev) => [
				...prev,
				{ type: action, userId: currentRoommate.id },
			]);

			// TODO: Check for matches and show match notification if needed
			
		} catch (error) {
			console.error('Failed to record swipe action:', error);
			// Still proceed with UI update even if API call fails
		}

		setTimeout(() => {
			setSwipeDirection(null);
			if (currentIndex < users.length - 1) {
				setCurrentIndex(currentIndex + 1);
			} else {
				setCurrentIndex(0);
			}
			setShowDetails(false);
			setOffsetX(0);
		}, 300);
	};

	const handleUndo = () => {
		if (actionHistory.length === 0) return;
		const lastAction = actionHistory[actionHistory.length - 1];
		if (lastAction.type === 'like') {
			setLikedProfiles((prev) =>
				prev.filter((id) => id !== lastAction.userId)
			);
		} else if (lastAction.type === 'dislike') {
			setPassedProfiles((prev) =>
				prev.filter((id) => id !== lastAction.userId)
			);
		}
		setCurrentIndex(users.findIndex((r) => r.id === lastAction.userId));
		setActionHistory((prev) => prev.slice(0, -1));
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
			// Reset position
			setOffsetX(0);
		}
	};

	// Mouse event handlers for desktop
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
			handleSwipe('right');
		} else if (offsetX < -100) {
			handleSwipe('left');
		} else {
			setOffsetX(0);
		}
	};

	// Add global mouse up listener
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

		document.addEventListener('mouseup', handleMouseUpGlobal);
		return () => document.removeEventListener('mouseup', handleMouseUpGlobal);
	}, [isDragging, offsetX]);

	useEffect(() => {
		setMatchCount(Math.floor(Math.random() * 5) + 1);
	}, []);

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-background">
				<main className="container mx-auto px-0 sm:px-4 py-4">
					{/* Loading state */}
					{loading && (
						<div className="flex items-center justify-center min-h-[60vh]">
							<div className="text-center">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange mx-auto mb-4"></div>
								<p className="text-muted-foreground">Loading potential roommates...</p>
							</div>
						</div>
					)}

					{/* Error state */}
					{error && !loading && (
						<div className="flex items-center justify-center min-h-[60vh]">
							<div className="text-center">
								<p className="text-red-500 mb-4">{error}</p>
								<button 
									onClick={() => window.location.reload()} 
									className="px-4 py-2 bg-vibrant-orange text-white rounded-lg hover:bg-orange-600"
								>
									Try Again
								</button>
							</div>
						</div>
					)}

					{/* No users state */}
					{!loading && !error && users.length === 0 && (
						<div className="flex items-center justify-center min-h-[60vh]">
							<div className="text-center">
								<p className="text-muted-foreground mb-4">No potential roommates found.</p>
								<p className="text-sm text-muted-foreground mb-4">
									Try adjusting your preferences or check back later.
								</p>
								<button 
									onClick={() => window.location.reload()} 
									className="px-4 py-2 bg-vibrant-orange text-white rounded-lg hover:bg-orange-600"
								>
									Refresh
								</button>
							</div>
						</div>
					)}

					{/* Main content - only show when not loading and no error and users exist */}
					{!loading && !error && users.length > 0 && currentRoommate && (
						<>
					{/* Progress bar showing profiles viewed */}
					<div className="max-w-3xl mx-auto mb-4 px-4">
						<div className="flex items-center gap-1">
							{users.map((_, index) => (
								<div
									key={index}
									className={`h-1 flex-1 rounded-full transition-all duration-300 ${
										index === currentIndex
											? 'bg-vibrant-orange'
											: index < currentIndex
											? 'bg-vibrant-orange/30'
											: 'bg-gray-200 dark:bg-gray-700'
									}`}
								/>
							))}
						</div>
					</div>

					<div className="max-w-3xl mx-auto">
						<Card
							ref={cardRef}
							className={`overflow-hidden rounded-3xl shadow-2xl transition-all duration-300 h-[calc(100vh-16rem)] md:h-[calc(100vh-10rem)] md:max-h-[800px] mx-0 sm:mx-4 bg-gradient-to-br from-pink-100 to-purple-100 ${
								swipeDirection === 'left'
									? 'animate-swipe-left'
									: swipeDirection === 'right'
									? 'animate-swipe-right'
									: ''
							} ${isDragging ? 'scale-[1.02]' : ''}`}
							style={
								isDragging
									? {
											transform: `translateX(${offsetX}px) scale(1.02)`,
											cursor: 'grabbing',
									  }
									: { cursor: 'grab' }
							}
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
										src={currentRoommate.profile_picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3'}
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

								{/* Info button */}
								<Button
									variant="outline"
									size="icon"
									className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white z-20"
									onClick={toggleDetails}
								>
									<Info className="h-5 w-5" />
								</Button>

								{/* Details overlay */}
								{showDetails && (
									<div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-30 p-6 overflow-y-auto">
										<div className="flex justify-between items-start mb-6">
											<h2 className="text-2xl font-bold text-white">
												{currentRoommate.name}, {currentRoommate.age}
											</h2>
											<Button
												variant="ghost"
												size="icon"
												className="text-white hover:bg-white/20"
												onClick={toggleDetails}
											>
												<X className="h-5 w-5" />
											</Button>
										</div>

										<div className="space-y-6 text-white">
											{/* Bio */}
											<div>
												<h3 className="text-lg font-semibold mb-2">About</h3>
												<p className="text-white/90">{currentRoommate.bio}</p>
											</div>

											{/* Interests */}
											<div>
												<h3 className="text-lg font-semibold mb-2">
													Interests
												</h3>
												<div className="flex flex-wrap gap-2">
													{currentRoommate.interests.map((interest, index) => (
														<Badge
															key={index}
															variant="secondary"
															className="bg-white/20 text-white border-white/30"
														>
															{interest}
														</Badge>
													))}
												</div>
											</div>

											{/* Lifestyle */}
											<div>
												<h3 className="text-lg font-semibold mb-2">
													Lifestyle
												</h3>
												<div className="grid grid-cols-2 gap-3">
													<div>
														<p className="text-sm text-white/70">Cleanliness</p>
														<p className="font-medium">
															{currentRoommate.lifestyle.cleanliness}
														</p>
													</div>
													<div>
														<p className="text-sm text-white/70">Noise Level</p>
														<p className="font-medium">
															{currentRoommate.lifestyle.noise}
														</p>
													</div>
													<div>
														<p className="text-sm text-white/70">Schedule</p>
														<p className="font-medium">
															{currentRoommate.lifestyle.schedule}
														</p>
													</div>
													<div>
														<p className="text-sm text-white/70">Pets</p>
														<p className="font-medium">
															{currentRoommate.lifestyle.pets}
														</p>
													</div>
												</div>
											</div>

											{/* Housing Details */}
											<div>
												<h3 className="text-lg font-semibold mb-2">
													Housing Details
												</h3>
												<div className="space-y-2">
													<div className="flex justify-between">
														<span className="text-white/70">Budget:</span>
														<span className="font-medium">
															${currentRoommate.budget}/month
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-white/70">Location:</span>
														<span className="font-medium">
															{currentRoommate.location}
														</span>
													</div>
													<div className="flex justify-between">
														<span className="text-white/70">Move-in:</span>
														<span className="font-medium">
															{currentRoommate.move_in_date || 'Not specified'}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}

								{/* Profile info */}
								<div className="absolute bottom-0 inset-x-0 p-6 pb-28 z-10">
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<div>
												<h2 className="text-3xl font-bold text-white flex items-center gap-2">
													{currentRoommate.name}{' '}
													{currentRoommate.verified && (
														<CheckCircle className="h-6 w-6 text-vibrant-orange" />
													)}
												</h2>
												<p className="text-lg text-gray-200">
													{currentRoommate.age && `${currentRoommate.age} • `}
													{currentRoommate.nationality || currentRoommate.location || 'Location not specified'}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<Badge
													variant="secondary"
													className="text-sm px-3 py-1.5 bg-white/20 text-white border-white/30"
												>
													<Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
													{currentRoommate.compatibility}% Match
												</Badge>
											</div>
										</div>

										<div className="flex items-center gap-4 text-white text-lg">
											<div className="flex items-center gap-1">
												<DollarSign className="h-5 w-5 text-vibrant-orange" />$
												{currentRoommate.budget}/mo
											</div>
											<div className="flex items-center gap-1">
												<MapPin className="h-5 w-5 text-vibrant-orange" />
												{currentRoommate.location}
											</div>
											<div className="flex items-center gap-1">
												<Calendar className="h-5 w-5 text-vibrant-orange" />
												{currentRoommate.move_in_date || 'Not specified'}
											</div>
										</div>

										<div className="flex flex-wrap gap-2">
											{currentRoommate.tags.slice(0, 3).map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="bg-white/10 hover:bg-white/20 transition-colors text-white border-none"
												>
													{tag}
												</Badge>
											))}
											{currentRoommate.tags.length > 3 && (
												<Badge
													variant="secondary"
													className="bg-white/10 hover:bg-white/20 transition-colors text-white border-none"
												>
													+{currentRoommate.tags.length - 3} more
												</Badge>
											)}
										</div>
									</div>
								</div>

								{/* Action buttons */}
								<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-20">
									{actionHistory.length > 0 && (
										<button
											className="h-14 w-14 flex items-center justify-center rounded-full bg-white shadow-xl hover:bg-gray-50 transform transition-all hover:scale-110 active:scale-95 border-2 border-blue-500/20"
											onClick={handleUndo}
											aria-label="Undo"
										>
											<Undo2 className="h-8 w-8 text-blue-500" />
										</button>
									)}
									<button
										className="h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-xl hover:bg-gray-50 transform transition-all hover:scale-110 active:scale-95 border-2 border-red-500/20"
										onClick={() => handleSwipe('left')}
										aria-label="Pass"
									>
										<X className="h-8 w-8 text-red-500" />
									</button>
									<button
										className="h-20 w-20 flex items-center justify-center rounded-full bg-vibrant-orange shadow-xl hover:bg-orange-600 transform transition-all hover:scale-110 active:scale-95 border-2 border-orange-300"
										onClick={() => handleSwipe('right')}
										aria-label="Like"
									>
										<Heart className="h-10 w-10 text-white" />
									</button>
								</div>
							</div>
						</Card>
					</div>
				</>
				)}
				</main>


				<MobileNav />
			</div>
		</ProtectedRoute>
	);
}
