'use client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/auth-context';
import confetti from 'canvas-confetti';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useRef, useState } from 'react';
import { Roommate, roommates } from '../explore/roommates-data';

export default function LikesPage() {
	const { user, updateProfile } = useAuth();
	const { toast } = useToast();
	const router = useRouter();
	const [matchModal, setMatchModal] = useState<{
		open: boolean;
		roommate: Roommate | null;
	}>({ open: false, roommate: null });
	const [profileModal, setProfileModal] = useState<{
		open: boolean;
		roommate: Roommate | null;
	}>({ open: false, roommate: null });
	const [dislikedIds, setDislikedIds] = useState<string[]>([]);
	const [notMatchModal, setNotMatchModal] = useState<{ open: boolean; roommate: Roommate | null }>({ open: false, roommate: null });
	const myPhoto =
		user?.profilePicture ||
		'https://ui-avatars.com/api/?name=You&background=random';

	// Users who liked me, but I haven't liked back
	const likesYou: Roommate[] = roommates.filter(
		(roommate: Roommate) =>
			roommate.likedUserIds?.includes(user?.id || '') &&
			!user?.likedUserIds?.includes(roommate.id.toString())
	);

	const handleLikeBack = (roommate: Roommate) => {
		if (!user) return;
		const isMutual = roommate.likedUserIds?.includes(user.id || '');
		updateProfile({
			likedUserIds: [...(user.likedUserIds || []), roommate.id.toString()],
		});
		if (isMutual) {
			confetti({
				particleCount: 120,
				spread: 80,
				origin: { y: 0.6 },
				zIndex: 9999,
			});
			setMatchModal({ open: true, roommate });
			toast({
				title: "🎉 It's a Match!",
				description: `You and ${roommate.name} have liked each other. Start a conversation now!`,
				duration: 4000,
			});
		} else {
			confetti({
				particleCount: 80,
				spread: 70,
				origin: { y: 0.6 },
				zIndex: 9999,
				colors: ['#60a5fa', '#64748b', '#a3a3a3'], // blue/gray confetti
			});
			setNotMatchModal({ open: true, roommate });
			toast({
				title: "Not a Match Yet",
				description: `${roommate.name} hasn't liked you back yet. We'll let you know if they do!`,
				duration: 3500,
			});
		}
	};

	const handleDislike = (roommate: Roommate) => {
		setDislikedIds((prev) => [...prev, roommate.id.toString()]);
		confetti({
			particleCount: 60,
			spread: 60,
			origin: { y: 0.7 },
			zIndex: 9999,
			colors: ['#60a5fa', '#64748b', '#a3a3a3'], // blue/gray confetti
		});
		toast({
			title: 'Removed from Likes',
			description: `${roommate.name} has been removed from your Likes.`,
			duration: 2500,
			variant: 'destructive',
		});
		setTimeout(() => {
			setDislikedIds((prev) => prev.filter((id) => id !== roommate.id.toString()));
		}, 400);
	};

	return (
		<div className="min-h-screen py-8 container mx-auto">
			<h1 className="text-2xl font-bold mb-6">Who Likes You</h1>
			{likesYou.length === 0 ? (
				<div className="flex flex-col items-center justify-center mt-24">
					<span className="text-6xl mb-4">👀</span>
					<div className="text-center text-muted-foreground text-lg">
						No one has liked you yet.
						<br />
						Keep exploring and you'll show up here!
					</div>
				</div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
					{likesYou.map((roommate, i) => (
						<Fragment key={roommate.id}>
							<div
								className={`relative group rounded-xl overflow-hidden shadow-lg bg-background cursor-pointer transition-transform duration-300 hover:scale-105 ${
									dislikedIds.includes(roommate.id.toString())
										? 'animate-dislike-card pointer-events-none opacity-0'
										: ''
								}`}
								style={{
									transform: `rotate(${
										(i % 2 === 0 ? 1 : -1) * (Math.random() * 2 + 1)
									}deg)`,
								}}
								onClick={(e) => {
									if (
										(e.target as HTMLElement).closest(
											'.like-back-btn, .dislike-btn'
										)
									)
										return;
									setProfileModal({ open: true, roommate });
								}}
							>
								<div className="relative aspect-[4/5] w-full overflow-hidden">
									<img
										src={roommate.image}
										alt={roommate.name}
										className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
									/>
									{/* Floating Like Back button */}
									<Button
										size="icon"
										className="like-back-btn absolute bottom-2 right-2 z-10 bg-white/90 hover:bg-vibrant-orange text-vibrant-orange hover:text-white shadow-lg border-2 border-white mt-2"
										onClick={(e) => {
											e.stopPropagation();
											handleLikeBack(roommate);
										}}
										aria-label="Like Back"
									>
										<span role="img" aria-label="Like Back">
											🏠
										</span>
									</Button>
									{/* Floating Dislike button */}
									<Button
										size="icon"
										variant="outline"
										className="dislike-btn absolute bottom-2 left-2 z-10 bg-white/90 hover:bg-destructive text-destructive hover:text-white shadow-lg border-2 border-white mt-2"
										onClick={(e) => {
											e.stopPropagation();
											handleDislike(roommate);
										}}
										aria-label="Dislike"
									>
										<span role="img" aria-label="Dislike">
											❌
										</span>
									</Button>
									{/* Bottom overlay */}
									<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-3 py-2 pb-14 flex flex-col items-start">
										<div className="flex items-center gap-2 text-white text-base font-bold drop-shadow">
											<span className="truncate max-w-[80vw] sm:max-w-[120px]">
												{roommate.name}
											</span>
											{roommate.verified && (
												<CheckCircle className="h-4 w-4 text-vibrant-orange" />
											)}
										</div>
									</div>
								</div>
							</div>
						</Fragment>
					))}
				</div>
			)}
			{/* Profile Modal */}
			{profileModal.open && profileModal.roommate && (
				<div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 dark:bg-black/80 animate-fade-in">
					<div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl dark:shadow-orange-900 p-6 flex flex-col items-center max-w-xs w-full relative">
						<button
							className="absolute top-3 right-3 text-muted-foreground hover:text-primary dark:text-zinc-400 dark:hover:text-vibrant-orange"
							onClick={() => setProfileModal({ open: false, roommate: null })}
							aria-label="Close"
						>
							×
						</button>
						<img
							src={profileModal.roommate.image}
							alt={profileModal.roommate.name}
							className="w-28 h-28 rounded-full border-4 border-vibrant-orange object-cover object-center bg-muted dark:bg-zinc-800 mb-4"
						/>
						<h2 className="text-xl font-bold mb-1 dark:text-white">
							{profileModal.roommate.name}, {profileModal.roommate.age}
						</h2>
						<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
							{profileModal.roommate.verified && (
								<CheckCircle className="h-4 w-4 text-vibrant-orange" />
							)}
						</div>
						<div className="text-center text-sm text-muted-foreground mb-4">
							{profileModal.roommate.bio}
						</div>
						<Button
							className="w-full mb-2 bg-vibrant-orange hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white"
							onClick={() => {
								handleLikeBack(profileModal.roommate!);
								setProfileModal({ open: false, roommate: null });
							}}
						>
							Like Back 🏠
						</Button>
						<Button
							variant="outline"
							className="w-full dark:border-zinc-700 dark:text-white dark:bg-zinc-800"
							onClick={() => setProfileModal({ open: false, roommate: null })}
						>
							Close
						</Button>
					</div>
				</div>
			)}
			{/* Match Modal */}
			{matchModal.open && matchModal.roommate && (
				<div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 dark:bg-black/80 animate-fade-in">
					<div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl dark:shadow-orange-900 p-8 flex flex-col items-center max-w-xs w-full relative">
						<button
							className="absolute top-3 right-3 text-muted-foreground hover:text-primary dark:text-zinc-400 dark:hover:text-vibrant-orange"
							onClick={() => setMatchModal({ open: false, roommate: null })}
							aria-label="Close"
						>
							×
						</button>
						<h2 className="text-3xl font-bold text-vibrant-orange mb-4 dark:text-orange-400">
							It's a Match!
						</h2>
						<div className="flex items-center justify-center gap-4 mb-4">
							<img
								src={myPhoto}
								alt="You"
								className="w-20 h-20 rounded-full border-4 border-vibrant-orange object-cover object-center bg-muted dark:bg-zinc-800"
							/>
							<span className="text-4xl">🏠</span>
							<img
								src={matchModal.roommate.image}
								alt={matchModal.roommate.name}
								className="w-20 h-20 rounded-full border-4 border-vibrant-orange object-cover object-center bg-muted dark:bg-zinc-800"
							/>
						</div>
						<div className="text-center text-lg font-medium mb-6 dark:text-white">
							You and{' '}
							<span className="text-vibrant-orange dark:text-orange-400">
								{matchModal.roommate.name}
							</span>{' '}
							have liked each other!
						</div>
						<Button
							className="w-full mb-2 bg-vibrant-orange hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-400 dark:text-white"
							onClick={() => {
								setMatchModal({ open: false, roommate: null });
								router.push(`/matches`);
							}}
						>
							Start Chat
						</Button>
						<Button
							variant="outline"
							className="w-full dark:border-zinc-700 dark:text-white dark:bg-zinc-800"
							onClick={() => setMatchModal({ open: false, roommate: null })}
						>
							Close
						</Button>
					</div>
				</div>
			)}
			{/* Not a Match Modal */}
			{notMatchModal.open && notMatchModal.roommate && (
				<div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 dark:bg-black/80 animate-fade-in">
					<div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl dark:shadow-blue-900 p-8 flex flex-col items-center max-w-xs w-full relative">
						<button
							className="absolute top-3 right-3 text-muted-foreground hover:text-primary dark:text-zinc-400 dark:hover:text-blue-400"
							onClick={() => setNotMatchModal({ open: false, roommate: null })}
							aria-label="Close"
						>
							×
						</button>
						<h2 className="text-2xl font-bold text-blue-500 mb-4 dark:text-blue-400">
							Not a Match Yet
						</h2>
						<span className="text-5xl mb-4">😔</span>
						<div className="text-center text-lg font-medium mb-6 dark:text-white">
							{notMatchModal.roommate.name} hasn't liked you back yet.<br />We'll let you know if they do!
						</div>
						<Button
							variant="outline"
							className="w-full dark:border-zinc-700 dark:text-white dark:bg-zinc-800"
							onClick={() => setNotMatchModal({ open: false, roommate: null })}
						>
							Close
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
