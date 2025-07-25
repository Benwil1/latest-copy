import MobileNav from '@/components/mobile-nav';
import Navbar from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { CurrencyProvider } from '@/context/currency-context';
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
					content="width=device-width, initial-scale=1.0, viewport-fit=cover"
				/>
				<meta property="og:type" content="website" />
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" type="image/svg+xml" href="/icon.svg" />
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
			</head>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<CurrencyProvider>
						<AuthProvider>
							<MarketplaceProvider>
								<div className="flex min-h-screen flex-col">
									<Navbar />
									<main className="flex-1 mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 pb-16 md:pb-0 pt-0">
										{children}
									</main>
									<MobileNav />
								</div>
							</MarketplaceProvider>
						</AuthProvider>
					</CurrencyProvider>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
