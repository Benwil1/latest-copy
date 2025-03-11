'use client';

import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';

interface ImageCarouselProps {
	images: string[];
}

export function ImageCarousel({ images }: ImageCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const nextImage = () => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
	};

	const previousImage = () => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
	};

	return (
		<div className="relative w-full">
			<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
				<img
					src={images[currentIndex]}
					alt={`Apartment image ${currentIndex + 1}`}
					className="h-full w-full object-cover"
				/>

				<div className="absolute inset-0 flex items-center justify-between p-4">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
						onClick={previousImage}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
						onClick={nextImage}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>

				<Button
					variant="outline"
					size="icon"
					className="absolute right-4 top-4 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
					onClick={() => setIsFullscreen(true)}
				>
					<Expand className="h-4 w-4" />
				</Button>

				<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
					{images.map((_, index) => (
						<button
							key={index}
							className={`h-1.5 w-1.5 rounded-full transition-all ${
								index === currentIndex ? 'w-4 bg-white' : 'bg-white/50'
							}`}
							onClick={() => setCurrentIndex(index)}
						/>
					))}
				</div>
			</div>

			<Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
				<DialogContent className="max-w-7xl border-none bg-black p-0">
					<Button
						variant="outline"
						size="icon"
						className="absolute right-4 top-4 z-50 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
						onClick={() => setIsFullscreen(false)}
					>
						<X className="h-4 w-4" />
					</Button>
					<div className="relative aspect-[16/9] w-full">
						<img
							src={images[currentIndex]}
							alt={`Apartment image ${currentIndex + 1}`}
							className="h-full w-full object-contain"
						/>
						<div className="absolute inset-0 flex items-center justify-between p-4">
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
								onClick={previousImage}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
								onClick={nextImage}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
