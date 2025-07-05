import React from 'react';

export const metadata = {
	title: 'Apartments | RoommieSwipe',
	description: 'Find your perfect apartment on RoommieSwipe',
};

export default function ApartmentsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="min-h-screen">{children}</div>;
}
