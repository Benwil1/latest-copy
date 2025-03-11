import React from 'react';

export const metadata = {
	title: 'Apartments | RoomieMatch',
	description: 'Find your perfect apartment on RoomieMatch',
};

export default function ApartmentsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="min-h-screen">{children}</div>;
}
