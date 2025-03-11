import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { MarketplaceProvider } from '@/context/marketplace-context';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'RoomieMatch | Find Your Perfect Roommate',
	description:
		'Swipe, match, and connect with potential roommates in your area',
	icons: {
		icon: [
			{ url: '/favicon.ico', sizes: 'any' },
			{ url: '/icon.svg', type: 'image/svg+xml' },
		],
		apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
	},
	generator: 'v0.dev',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
				/>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</head>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>
						<MarketplaceProvider>
							<div className="flex min-h-screen flex-col">
								<main className="flex-1">{children}</main>
							</div>
						</MarketplaceProvider>
					</AuthProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}

import './globals.css';
