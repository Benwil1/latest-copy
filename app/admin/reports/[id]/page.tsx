'use client';

import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const mockReports = [
	{
		id: 1,
		type: 'listing',
		target: 'Luxury Loft Uptown',
		reason: 'Inappropriate content',
		status: 'open',
	},
	{
		id: 2,
		type: 'user',
		target: 'Michael Chen',
		reason: 'Spam',
		status: 'resolved',
	},
];

export default function ReportDetailsPage() {
	const router = useRouter();
	const params = useParams();
	const report = mockReports.find((r) => String(r.id) === params.id);
	const [editReport, setEditReport] = useState(report);

	if (!report) return <div className="p-8">Report not found.</div>;

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
				<h2 className="text-2xl font-bold text-center mb-8">Report Details</h2>
				<div className="space-y-6">
					<div className="space-y-2">
						<label className="block text-sm font-medium">Type</label>
						<div className="rounded bg-muted px-3 py-2">
							{editReport.type.charAt(0).toUpperCase() +
								editReport.type.slice(1)}
						</div>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium">Target</label>
						<div className="rounded bg-muted px-3 py-2">
							{editReport.target}
						</div>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium">Reason</label>
						<div className="rounded bg-muted px-3 py-2">
							{editReport.reason}
						</div>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium">Status</label>
						<div className="rounded bg-muted px-3 py-2">
							{editReport.status}
						</div>
					</div>
					<hr className="my-4 border-muted" />
					{editReport.status === 'open' && (
						<Button
							className="w-full mt-2"
							onClick={() =>
								setEditReport({ ...editReport, status: 'resolved' })
							}
						>
							Resolve (Mock)
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
