'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	AlertTriangle,
	BarChart2,
	CheckCircle,
	Home,
	Menu,
	Users,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock data
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

const USERS_PER_PAGE = 5;

type UserKey =
	| 'id'
	| 'name'
	| 'email'
	| 'status'
	| 'role'
	| 'createdAt'
	| 'location';

export default function AdminPage() {
	const [userSearch, setUserSearch] = useState('');
	const [listingSearch, setListingSearch] = useState('');
	const [activeTab, setActiveTab] = useState('dashboard');
	const [userSort, setUserSort] = useState({ key: 'name', direction: 'asc' });
	const [userPage, setUserPage] = useState(1);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [users, setUsers] = useState(mockUsers);
	const [listings, setListings] = useState(mockListings);
	const [reports, setReports] = useState(mockReports);

	const filteredUsers = users.filter(
		(u) =>
			u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
			u.email.toLowerCase().includes(userSearch.toLowerCase())
	);

	const sortedUsers = [...filteredUsers].sort((a, b) => {
		const { key, direction } = userSort;
		if (key === 'createdAt') {
			const aDate = new Date(a[key as keyof typeof a] as string);
			const bDate = new Date(b[key as keyof typeof b] as string);
			if (aDate < bDate) return direction === 'asc' ? -1 : 1;
			if (aDate > bDate) return direction === 'asc' ? 1 : -1;
			return 0;
		} else {
			const aValue = a[key as keyof typeof a] as string | number;
			const bValue = b[key as keyof typeof b] as string | number;
			if (aValue < bValue) return direction === 'asc' ? -1 : 1;
			if (aValue > bValue) return direction === 'asc' ? 1 : -1;
			return 0;
		}
	});

	const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);
	const paginatedUsers = sortedUsers.slice(
		(userPage - 1) * USERS_PER_PAGE,
		userPage * USERS_PER_PAGE
	);

	const filteredListings = listings.filter((l) =>
		l.title.toLowerCase().includes(listingSearch.toLowerCase())
	);

	function handleSort(key: UserKey) {
		setUserSort((prev) => {
			if (prev.key === key) {
				return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
			}
			return { key, direction: 'asc' };
		});
	}

	function handlePageChange(newPage) {
		if (newPage < 1 || newPage > totalPages) return;
		setUserPage(newPage);
	}

	function handleBanUnban(userId, newStatus) {
		setUsers((prev) =>
			prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
		);
	}

	function handleApprove(listingId) {
		setListings((prev) =>
			prev.map((l) => (l.id === listingId ? { ...l, status: 'active' } : l))
		);
	}

	function handleDeleteListing(listingId) {
		setListings((prev) => prev.filter((l) => l.id !== listingId));
	}

	function handleResolve(reportId) {
		setReports((prev) =>
			prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved' } : r))
		);
	}

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-muted">
			{/* Sidebar for desktop, drawer for mobile */}
			{/* Mobile Top Bar */}
			<div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-20">
				<div className="flex items-center gap-2">
					<BarChart2 className="h-6 w-6 text-primary" />
					<span className="text-xl font-bold tracking-tight">Admin</span>
				</div>
				<button
					onClick={() => setSidebarOpen((v) => !v)}
					className="p-2 rounded-md hover:bg-muted focus:outline-none"
					title="Open navigation menu"
				>
					<Menu className="h-6 w-6" />
				</button>
			</div>
			{/* Sidebar Drawer (mobile) */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-30 bg-black/40 md:hidden"
					onClick={() => setSidebarOpen(false)}
				>
					<aside
						className="absolute left-0 top-0 h-full w-64 bg-background border-r border-border flex flex-col px-4 py-6 shadow-md"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="mb-8 flex items-center gap-2">
							<BarChart2 className="h-7 w-7 text-primary" />
							<span className="text-2xl font-bold tracking-tight">Admin</span>
						</div>
						<nav className="flex-1 space-y-2">
							{[
								'dashboard',
								'users',
								'listings',
								'moderation',
								'analytics',
							].map((tab) => (
								<button
									key={tab}
									onClick={() => {
										setActiveTab(tab);
										setSidebarOpen(false);
									}}
									className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
										activeTab === tab
											? 'bg-primary/10 text-primary font-semibold'
											: 'hover:bg-muted-foreground/10 text-muted-foreground'
									}`}
								>
									{tab === 'dashboard' && <BarChart2 className="h-5 w-5" />}
									{tab === 'users' && <Users className="h-5 w-5" />}
									{tab === 'listings' && <Home className="h-5 w-5" />}
									{tab === 'moderation' && (
										<AlertTriangle className="h-5 w-5" />
									)}
									{tab === 'analytics' && <BarChart2 className="h-5 w-5" />}
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							))}
						</nav>
						<div className="mt-auto pt-8 border-t border-border">
							<button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
								<XCircle className="h-5 w-5" /> Logout
							</button>
						</div>
					</aside>
				</div>
			)}
			{/* Sidebar for desktop */}
			<aside className="hidden md:flex w-64 bg-background border-r border-border flex-col min-h-screen px-4 py-6 shadow-md">
				<div className="mb-8 flex items-center gap-2">
					<BarChart2 className="h-7 w-7 text-primary" />
					<span className="text-2xl font-bold tracking-tight">Admin</span>
				</div>
				<nav className="flex-1 space-y-2">
					<button
						onClick={() => setActiveTab('dashboard')}
						className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
							activeTab === 'dashboard'
								? 'bg-primary/10 text-primary font-semibold'
								: 'hover:bg-muted-foreground/10 text-muted-foreground'
						}`}
					>
						<BarChart2 className="h-5 w-5" /> Dashboard
					</button>
					<button
						onClick={() => setActiveTab('users')}
						className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
							activeTab === 'users'
								? 'bg-primary/10 text-primary font-semibold'
								: 'hover:bg-muted-foreground/10 text-muted-foreground'
						}`}
					>
						<Users className="h-5 w-5" /> Users
					</button>
					<button
						onClick={() => setActiveTab('listings')}
						className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
							activeTab === 'listings'
								? 'bg-primary/10 text-primary font-semibold'
								: 'hover:bg-muted-foreground/10 text-muted-foreground'
						}`}
					>
						<Home className="h-5 w-5" /> Listings
					</button>
					<button
						onClick={() => setActiveTab('moderation')}
						className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
							activeTab === 'moderation'
								? 'bg-primary/10 text-primary font-semibold'
								: 'hover:bg-muted-foreground/10 text-muted-foreground'
						}`}
					>
						<AlertTriangle className="h-5 w-5" /> Moderation
					</button>
					<button
						onClick={() => setActiveTab('analytics')}
						className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
							activeTab === 'analytics'
								? 'bg-primary/10 text-primary font-semibold'
								: 'hover:bg-muted-foreground/10 text-muted-foreground'
						}`}
					>
						<BarChart2 className="h-5 w-5" /> Analytics
					</button>
				</nav>
				<div className="mt-auto pt-8 border-t border-border">
					<button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
						<XCircle className="h-5 w-5" /> Logout
					</button>
				</div>
			</aside>
			{/* Main Content */}
			<main className="flex-1 flex flex-col min-h-screen">
				{/* Top Bar (desktop only) */}
				<header className="hidden md:flex items-center justify-between px-8 py-4 border-b border-border bg-background/80 sticky top-0 z-10">
					<h1 className="text-2xl font-bold">
						{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
					</h1>
					<div className="flex items-center gap-4">
						<Input
							placeholder="Search..."
							className="w-64 bg-muted border border-border"
						/>
						<div className="flex items-center gap-2">
							<img
								src="/placeholder.svg"
								alt="Admin"
								className="h-10 w-10 rounded-full border border-border"
							/>
							<span className="font-medium">Admin</span>
						</div>
					</div>
				</header>
				{/* Main Section Responsive Padding */}
				<section className="flex-1 p-2 sm:p-4 md:p-8 bg-muted/50 min-h-0 overflow-y-auto">
					{/* Dashboard Content Responsive Grid */}
					{activeTab === 'dashboard' && (
						<div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
								<Card className="bg-background dark:bg-card/80 border border-border shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl">
									<CardHeader className="flex flex-row items-center gap-3">
										<Users className="h-6 w-6 text-primary" />
										<CardTitle className="text-lg">Users</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-3xl font-bold">{users.length}</div>
										<div className="text-muted-foreground text-sm">
											Total users
										</div>
									</CardContent>
								</Card>
								<Card className="bg-background dark:bg-card/80 border border-border shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl">
									<CardHeader className="flex flex-row items-center gap-3">
										<Home className="h-6 w-6 text-primary" />
										<CardTitle className="text-lg">Listings</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-3xl font-bold">{listings.length}</div>
										<div className="text-muted-foreground text-sm">
											Total listings
										</div>
									</CardContent>
								</Card>
								<Card className="bg-background dark:bg-card/80 border border-border shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl">
									<CardHeader className="flex flex-row items-center gap-3">
										<AlertTriangle className="h-6 w-6 text-yellow-500" />
										<CardTitle className="text-lg">Reports</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-3xl font-bold">{reports.length}</div>
										<div className="text-muted-foreground text-sm">
											Open reports
										</div>
									</CardContent>
								</Card>
								<Card className="bg-background dark:bg-card/80 border border-border shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl">
									<CardHeader className="flex flex-row items-center gap-3">
										<BarChart2 className="h-6 w-6 text-primary" />
										<CardTitle className="text-lg">Active</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="text-3xl font-bold">
											{users.filter((u) => u.status === 'active').length}
										</div>
										<div className="text-muted-foreground text-sm">
											Active users
										</div>
									</CardContent>
								</Card>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
								<Card className="bg-background dark:bg-card/80 border border-border shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl">
									<CardHeader>
										<CardTitle>Recent Activity</CardTitle>
									</CardHeader>
									<CardContent>
										<ul className="space-y-3 text-sm">
											<li>Sarah Johnson created a new listing.</li>
											<li>Michael Chen was banned by admin.</li>
											<li>Emma Rodriguez updated her profile.</li>
											<li>New report submitted for "Luxury Loft Uptown".</li>
										</ul>
									</CardContent>
								</Card>
								<Card className="bg-background dark:bg-card/80 border border-border shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl">
									<CardHeader>
										<CardTitle>Visitors (Last 7 Days)</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="h-32 flex items-center justify-center text-muted-foreground">
											<span>Chart coming soon...</span>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					)}
					{/* Users, Listings, Moderation, Analytics: use card layout for mobile, table for md+ */}
					{activeTab === 'users' && (
						<div>
							<div className="mb-4 flex items-center gap-2">
								<Input
									placeholder="Search users by name or email..."
									value={userSearch}
									onChange={(e) => {
										setUserSearch(e.target.value);
										setUserPage(1);
									}}
									className="max-w-xs bg-muted border border-border"
								/>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{paginatedUsers.length === 0 ? (
									<div className="col-span-full text-center text-muted-foreground py-12">
										No users found.
									</div>
								) : (
									paginatedUsers.map((user) => (
										<div
											key={user.id}
											className="rounded-xl bg-background dark:bg-card/80 border border-border shadow-xl p-6 flex flex-col gap-3 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl"
										>
											<div className="flex items-center justify-between mb-2">
												<span className="font-semibold text-lg line-clamp-1">
													{user.name}
												</span>
												<Badge
													variant={
														user.status === 'active' ? 'success' : 'destructive'
													}
												>
													{user.status}
												</Badge>
											</div>
											<div className="text-sm text-muted-foreground mb-1">
												{user.email}
											</div>
											<div className="flex flex-wrap gap-2 text-xs mb-1">
												<Badge
													variant={
														user.role === 'admin' ? 'default' : 'secondary'
													}
												>
													{user.role}
												</Badge>
												<span>•</span>
												<span>{user.location}</span>
												<span>•</span>
												<span>
													{new Date(user.createdAt).toLocaleDateString(
														undefined,
														{ year: 'numeric', month: 'short', day: 'numeric' }
													)}
												</span>
											</div>
											<div className="flex gap-2 mt-auto">
												{user.status === 'active' ? (
													<Button
														size="sm"
														variant="destructive"
														className="flex-1"
														onClick={() => handleBanUnban(user.id, 'banned')}
													>
														Ban
													</Button>
												) : (
													<Button
														size="sm"
														variant="success"
														className="flex-1"
														onClick={() => handleBanUnban(user.id, 'active')}
													>
														Unban
													</Button>
												)}
												<Link
													href={`/admin/users/${user.id}`}
													className="flex-1"
												>
													<Button
														size="sm"
														variant="outline"
														className="w-full"
													>
														Edit
													</Button>
												</Link>
											</div>
										</div>
									))
								)}
							</div>
							{/* Pagination Controls */}
							{totalPages > 1 && (
								<div className="flex justify-end items-center gap-2 p-3">
									<Button
										size="sm"
										variant="outline"
										onClick={() => handlePageChange(userPage - 1)}
										disabled={userPage === 1}
									>
										Prev
									</Button>
									<span className="text-xs text-muted-foreground">
										Page {userPage} of {totalPages}
									</span>
									<Button
										size="sm"
										variant="outline"
										onClick={() => handlePageChange(userPage + 1)}
										disabled={userPage === totalPages}
									>
										Next
									</Button>
								</div>
							)}
						</div>
					)}
					{activeTab === 'listings' && (
						<div>
							<div className="mb-4 flex items-center gap-2">
								<Input
									placeholder="Search listings by title..."
									value={listingSearch}
									onChange={(e) => setListingSearch(e.target.value)}
									className="max-w-xs bg-muted border border-border"
								/>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{listings.length === 0 ? (
									<div className="col-span-full text-center text-muted-foreground py-12">
										No listings found.
									</div>
								) : (
									listings.map((listing) => (
										<div
											key={listing.id}
											className="rounded-xl bg-background dark:bg-card/80 border border-border shadow-xl p-6 flex flex-col gap-3 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl"
										>
											<div className="flex items-center justify-between mb-2">
												<span className="font-semibold text-lg line-clamp-1">
													{listing.title}
												</span>
												<Badge
													variant={
														listing.status === 'active'
															? 'success'
															: listing.status === 'pending'
															? 'secondary'
															: 'destructive'
													}
												>
													{listing.status}
												</Badge>
											</div>
											<div className="text-sm text-muted-foreground mb-2">
												Owner: {listing.owner}
											</div>
											<div className="flex gap-2 mt-auto">
												{listing.status !== 'active' && (
													<Button
														size="sm"
														variant="success"
														className="flex-1"
														onClick={() => handleApprove(listing.id)}
													>
														Approve
													</Button>
												)}
												<Link
													href={`/admin/listings/${listing.id}`}
													className="flex-1"
												>
													<Button
														size="sm"
														variant="outline"
														className="w-full"
													>
														Edit
													</Button>
												</Link>
												<Button
													size="sm"
													variant="destructive"
													className="flex-1"
													onClick={() => handleDeleteListing(listing.id)}
												>
													Delete
												</Button>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					)}
					{activeTab === 'moderation' && (
						<div>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
								{reports.length === 0 ? (
									<div className="col-span-full text-center text-muted-foreground py-12">
										No reports found.
									</div>
								) : (
									reports.map((report) => (
										<div
											key={report.id}
											className="rounded-xl bg-background dark:bg-card/80 border border-border shadow-xl p-6 flex flex-col gap-3 transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl"
										>
											<div className="flex items-center justify-between mb-2">
												<span className="font-semibold text-lg line-clamp-1">
													{report.type.charAt(0).toUpperCase() +
														report.type.slice(1)}
												</span>
												<Badge
													variant={
														report.status === 'open' ? 'destructive' : 'success'
													}
												>
													{report.status}
												</Badge>
											</div>
											<div className="text-sm text-muted-foreground mb-1">
												Target: {report.target}
											</div>
											<div className="text-sm text-muted-foreground mb-1">
												Reason: {report.reason}
											</div>
											<div className="flex gap-2 mt-auto">
												{report.status === 'open' && (
													<Button
														size="sm"
														variant="success"
														className="flex-1"
														onClick={() => handleResolve(report.id)}
													>
														Resolve
													</Button>
												)}
												<Link
													href={`/admin/reports/${report.id}`}
													className="flex-1"
												>
													<Button
														size="sm"
														variant="outline"
														className="w-full"
													>
														View
													</Button>
												</Link>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					)}
					{activeTab === 'analytics' && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<Card className="bg-background dark:bg-card/80 border border-border shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl">
								<CardHeader>
									<CardTitle>User Growth</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-40 flex items-center justify-center text-muted-foreground">
										<span>Chart coming soon...</span>
									</div>
								</CardContent>
							</Card>
							<Card className="bg-background dark:bg-card/80 border border-border shadow-xl transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl">
								<CardHeader>
									<CardTitle>Listings Activity</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="h-40 flex items-center justify-center text-muted-foreground">
										<span>Chart coming soon...</span>
									</div>
								</CardContent>
							</Card>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}
