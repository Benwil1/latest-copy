'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const mockListings = [
	{
		id: 1,
		title: 'Modern Studio Downtown',
		owner: 'Sarah Johnson',
		status: 'active',
	},
	{
		id: 2,
		title: 'Spacious 2-Bed Midtown',
		owner: 'Michael Chen',
		status: 'pending',
	},
	{
		id: 3,
		title: 'Luxury Loft Uptown',
		owner: 'Emma Rodriguez',
		status: 'flagged',
	},
];

export default function ListingDetailsPage() {
	const router = useRouter();
	const params = useParams();
	const listing = mockListings.find((l) => String(l.id) === params.id);
	const [editListing, setEditListing] = useState(listing);

	if (!listing) return <div className="p-8">Listing not found.</div>;

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 py-8">
			<div className="w-full max-w-lg bg-background dark:bg-card/80 rounded-2xl shadow-2xl p-8 relative">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.push('/admin')}
					className="absolute left-4 top-4"
				>
					← Back to Admin
				</Button>
				<h2 className="text-2xl font-bold text-center mb-8">Edit Listing</h2>
				<div className="space-y-6">
					<div className="space-y-2">
						<label className="block text-sm font-medium">Title</label>
						<Input
							value={editListing?.title ?? ''}
							onChange={(e) =>
								editListing && setEditListing({ ...editListing, title: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium">Owner</label>
						<Input
							value={editListing?.owner ?? ''}
							onChange={(e) =>
								editListing && setEditListing({ ...editListing, owner: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium">Status</label>
						<select
							className="w-full rounded-md border border-border bg-muted p-2"
							value={editListing?.status ?? ''}
							onChange={(e) =>
								editListing && setEditListing({ ...editListing, status: e.target.value })
							}
							title="Listing Status"
						>
							<option value="active">Active</option>
							<option value="pending">Pending</option>
							<option value="flagged">Flagged</option>
						</select>
					</div>
					<hr className="my-4 border-muted" />
					<Button className="w-full mt-2">Save (Mock)</Button>
				</div>
			</div>
		</div>
	);
}
