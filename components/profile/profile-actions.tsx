import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

export function ProfileActions() {
	return (
		<div className="flex gap-6 justify-center">
			<Button
				variant="outline"
				size="icon"
				aria-label="Dislike"
				className="bg-background border-2 border-destructive text-destructive hover:bg-destructive/10"
			>
				<X className="w-6 h-6" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				aria-label="Like"
				className="bg-background border-2 border-primary text-primary hover:bg-primary/10"
			>
				<Heart className="w-6 h-6" />
			</Button>
		</div>
	);
}
