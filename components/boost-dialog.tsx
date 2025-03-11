'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function BoostDialog() {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		const handleClickOutside = (event: MouseEvent) => {
			const rect = dialog.getBoundingClientRect();
			const isInDialog =
				rect.top <= event.clientY &&
				event.clientY <= rect.bottom &&
				rect.left <= event.clientX &&
				event.clientX <= rect.right;
			if (!isInDialog) {
				dialog.close();
			}
		};

		dialog.addEventListener('click', handleClickOutside);
		return () => dialog.removeEventListener('click', handleClickOutside);
	}, []);

	return (
		<>
			<Button
				size="icon"
				className="h-14 w-14 rounded-full bg-vibrant-orange hover:bg-orange-600 text-white"
				onClick={() => dialogRef.current?.showModal()}
			>
				<Sparkles className="h-5 w-5" />
			</Button>

			<dialog
				ref={dialogRef}
				className="modal p-0 rounded-lg shadow-xl backdrop:bg-black/50"
			>
				<div className="bg-card p-6 w-[90vw] max-w-md">
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-xl font-semibold">Boost Your Listing</h3>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={() => dialogRef.current?.close()}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>

					<div className="space-y-4">
						<div className="bg-muted p-4 rounded-lg">
							<h4 className="font-medium mb-2">Premium Boost</h4>
							<p className="text-sm text-muted-foreground mb-4">
								Get 3x more visibility for your listing
							</p>
							<Button className="w-full bg-vibrant-orange hover:bg-orange-600">
								Boost for $9.99
							</Button>
						</div>

						<div className="bg-muted p-4 rounded-lg">
							<h4 className="font-medium mb-2">Super Boost</h4>
							<p className="text-sm text-muted-foreground mb-4">
								Get 5x more visibility and featured placement
							</p>
							<Button className="w-full bg-vibrant-orange hover:bg-orange-600">
								Boost for $19.99
							</Button>
						</div>

						<div className="bg-muted p-4 rounded-lg">
							<h4 className="font-medium mb-2">Ultra Boost</h4>
							<p className="text-sm text-muted-foreground mb-4">
								Get 10x more visibility, featured placement, and priority
								support
							</p>
							<Button className="w-full bg-vibrant-orange hover:bg-orange-600">
								Boost for $29.99
							</Button>
						</div>
					</div>
				</div>
			</dialog>
		</>
	);
}
