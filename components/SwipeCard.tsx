'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User } from '@/types/user';
import {
	motion,
	useAnimation,
	useMotionValue,
	useTransform,
} from 'framer-motion';
import { Heart, Undo2, X } from 'lucide-react';
import { useEffect } from 'react';

interface SwipeCardProps {
	profile: User;
	isActive: boolean;
	onSwipe: (direction: 'left' | 'right') => void;
	canUndo?: boolean;
	onUndo?: () => void;
}

export function SwipeCard({
	profile,
	isActive,
	onSwipe,
	canUndo,
	onUndo,
}: SwipeCardProps) {
	const controls = useAnimation();
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-200, 200], [-30, 30]);
	const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

	useEffect(() => {
		if (!isActive) {
			controls.start({ x: 0, y: 0, scale: 0.95, opacity: 0.5 });
		} else {
			controls.start({ scale: 1, opacity: 1 });
		}
	}, [isActive, controls]);

	const handleDragEnd = async (event: any, info: any) => {
		const offset = info.offset.x;
		const velocity = info.velocity.x;

		if (offset > 100 || velocity > 500) {
			await controls.start({ x: 200, opacity: 0 });
			onSwipe('right');
		} else if (offset < -100 || velocity < -500) {
			await controls.start({ x: -200, opacity: 0 });
			onSwipe('left');
		} else {
			controls.start({ x: 0, opacity: 1 });
		}
	};

	return (
		<motion.div
			className="absolute w-full"
			style={{ x, rotate, opacity }}
			drag={isActive ? 'x' : false}
			dragConstraints={{ left: 0, right: 0 }}
			onDragEnd={handleDragEnd}
			animate={controls}
		>
			<Card className="overflow-hidden">
				<div className="relative h-[400px]">
					<img
						src={profile.imageUrl}
						alt={profile.name}
						className="w-full h-full object-cover"
					/>
					<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
						<h3 className="text-2xl font-semibold">
							{profile.name}, {profile.age}
						</h3>
						<p className="text-sm opacity-90">{profile.occupation}</p>
						<p className="text-sm opacity-90">{profile.location}</p>
					</div>
				</div>
				<div className="p-4">
					<p className="text-muted-foreground">{profile.bio}</p>
					<div className="mt-4 flex justify-center gap-4">
						<Button
							size="lg"
							variant="outline"
							className="rounded-full h-12 w-12 p-0"
							onClick={onUndo}
							disabled={!canUndo}
							aria-label="Undo last swipe"
						>
							<Undo2 className="h-6 w-6" />
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="rounded-full h-12 w-12 p-0"
							onClick={() => onSwipe('left')}
							aria-label="Dislike"
						>
							<X className="h-6 w-6" />
						</Button>
						<Button
							size="lg"
							className="rounded-full h-12 w-12 p-0 bg-rose-500 hover:bg-rose-600"
							onClick={() => onSwipe('right')}
							aria-label="Like"
						>
							<Heart className="h-6 w-6" />
						</Button>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
