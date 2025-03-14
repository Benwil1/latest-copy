'use client';

import { DwellMatchLanding } from '@/components/dwellmatch-landing';
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
		<div
			className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex flex-col items-center justify-center text-center px-0 mx-0"
		>
			<DwellMatchLanding />
		</div>
	);
}
