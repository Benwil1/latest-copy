'use client';

import { RomieSwipeLanding } from '@/components/romieswipe-landing';
import { useAuth } from '@/context/auth-context';
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
		<div className="w-full min-h-screen">
			<RomieSwipeLanding />
		</div>
	);
}
