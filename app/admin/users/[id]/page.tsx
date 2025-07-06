'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock fetch function (replace with real data fetching if backend is added)
const mockUsers = [
	{
		id: 1,
		name: 'Sarah Johnson',
		email: 'sarah@email.com',
		status: 'active',
		role: 'user',
		createdAt: '2024-04-01',
		location: 'New York, NY',
	},
	{
		id: 2,
		name: 'Michael Chen',
		email: 'michael@email.com',
		status: 'banned',
		role: 'user',
		createdAt: '2024-03-15',
		location: 'San Francisco, CA',
	},
	{
		id: 3,
		name: 'Emma Rodriguez',
		email: 'emma@email.com',
		status: 'active',
		role: 'user',
		createdAt: '2024-02-20',
		location: 'Austin, TX',
	},
	{
		id: 4,
		name: 'Admin User',
		email: 'admin@email.com',
		status: 'active',
		role: 'admin',
		createdAt: '2024-01-10',
		location: 'Remote',
	},
];

export default function UserDetailsPage() {
	const router = useRouter();
	const params = useParams();
	const user = mockUsers.find((u) => String(u.id) === params.id);
	const [editUser, setEditUser] = useState(user);

	if (!user) return <div className="p-8">User not found.</div>;

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
				<h2 className="text-2xl font-bold text-center mb-8">Edit User</h2>
				<div className="space-y-6">
					<div className="space-y-2">
						<label className="block text-sm font-medium">Name</label>
						<Input
							value={editUser?.name ?? ''}
							onChange={(e) =>
								editUser && setEditUser({ ...editUser, name: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium">Email</label>
						<Input
							value={editUser?.email ?? ''}
							onChange={(e) =>
								editUser && setEditUser({ ...editUser, email: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium">Location</label>
						<Input
							value={editUser?.location ?? ''}
							onChange={(e) =>
								editUser &&
								setEditUser({ ...editUser, location: e.target.value })
							}
						/>
					</div>
					<div className="flex gap-4">
						<div className="flex-1 space-y-2">
							<label className="block text-sm font-medium">Role</label>
							<select
								className="w-full rounded-md border border-border bg-muted p-2"
								value={editUser?.role ?? ''}
								onChange={(e) =>
									editUser && setEditUser({ ...editUser, role: e.target.value })
								}
								title="User Role"
							>
								<option value="user">User</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						<div className="flex-1 space-y-2">
							<label className="block text-sm font-medium">Status</label>
							<select
								className="w-full rounded-md border border-border bg-muted p-2"
								value={editUser?.status ?? ''}
								onChange={(e) =>
									editUser &&
									setEditUser({ ...editUser, status: e.target.value })
								}
								title="User Status"
							>
								<option value="active">Active</option>
								<option value="banned">Banned</option>
							</select>
						</div>
					</div>
					<div className="space-y-2">
						<label className="block text-sm font-medium">Created</label>
						<Input value={editUser?.createdAt ?? ''} disabled />
					</div>
					<hr className="my-4 border-muted" />
					<Button className="w-full mt-2">Save (Mock)</Button>
				</div>
			</div>
		</div>
	);
}
