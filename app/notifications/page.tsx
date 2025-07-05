'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Bell,
	Building,
	Check,
	Clock,
	Heart,
	Home,
	MessageSquare,
	MoreHorizontal,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Notification {
	id: string;
	type: 'match' | 'message' | 'apartment' | 'system';
	title: string;
	message: string;
	timestamp: string;
	isRead: boolean;
	avatar?: string;
	userName?: string;
	actionUrl?: string;
}

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: '1',
			type: 'match',
			title: 'New Match!',
			message: 'You matched with Sarah Johnson',
			timestamp: '2 minutes ago',
			isRead: false,
			avatar: '/placeholder.svg',
			userName: 'Sarah J.',
			actionUrl: '/matches',
		},
		{
			id: '2',
			type: 'message',
			title: 'New Message',
			message: 'Alex sent you a message about the apartment',
			timestamp: '1 hour ago',
			isRead: false,
			avatar: '/placeholder.svg',
			userName: 'Alex M.',
			actionUrl: '/matches',
		},
		{
			id: '3',
			type: 'apartment',
			title: 'Apartment Update',
			message: 'The apartment you saved is now available for viewing',
			timestamp: '3 hours ago',
			isRead: true,
			actionUrl: '/apartments/explore',
		},
		{
			id: '4',
			type: 'system',
			title: 'Welcome to RomieSwipe!',
			message: 'Your account has been successfully created',
			timestamp: '1 day ago',
			isRead: true,
		},
		{
			id: '5',
			type: 'match',
			title: 'New Match!',
			message: 'You matched with Mike Chen',
			timestamp: '2 days ago',
			isRead: true,
			avatar: '/placeholder.svg',
			userName: 'Mike C.',
			actionUrl: '/matches',
		},
	]);

	const markAsRead = (id: string) => {
		setNotifications((prev) =>
			prev.map((notification) =>
				notification.id === id
					? { ...notification, isRead: true }
					: notification
			)
		);
	};

	const markAllAsRead = () => {
		setNotifications((prev) =>
			prev.map((notification) => ({ ...notification, isRead: true }))
		);
	};

	const deleteNotification = (id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		);
	};

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'match':
				return <Heart className="h-5 w-5 text-red-500" />;
			case 'message':
				return <MessageSquare className="h-5 w-5 text-blue-500" />;
			case 'apartment':
				return <Building className="h-5 w-5 text-green-500" />;
			case 'system':
				return <Bell className="h-5 w-5 text-gray-500" />;
			default:
				return <Bell className="h-5 w-5" />;
		}
	};

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	return (
		<div className="min-h-screen bg-background">
			<div className="container max-w-4xl mx-auto p-4 sm:p-6">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-2xl font-bold text-foreground">
							Notifications
						</h1>
						<p className="text-muted-foreground mt-1">
							{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
						</p>
					</div>
					{unreadCount > 0 && (
						<Button
							variant="outline"
							onClick={markAllAsRead}
							className="flex items-center gap-2"
						>
							<Check className="h-4 w-4" />
							Mark all as read
						</Button>
					)}
				</div>

				{/* Notifications List */}
				<div className="space-y-4">
					{notifications.length === 0 ? (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<Bell className="h-12 w-12 text-muted-foreground mb-4" />
								<h3 className="text-lg font-medium text-foreground mb-2">
									No notifications
								</h3>
								<p className="text-muted-foreground text-center">
									You're all caught up! New notifications will appear here.
								</p>
							</CardContent>
						</Card>
					) : (
						notifications.map((notification) => (
							<Card
								key={notification.id}
								className={`transition-all duration-200 hover:shadow-md ${
									!notification.isRead
										? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
										: ''
								}`}
							>
								<CardContent className="p-4">
									<div className="flex items-start gap-4">
										{/* Avatar/Icon */}
										<div className="flex-shrink-0">
											{notification.avatar ? (
												<Avatar className="h-10 w-10">
													<AvatarImage src={notification.avatar} />
													<AvatarFallback>
														{notification.userName?.charAt(0) || 'U'}
													</AvatarFallback>
												</Avatar>
											) : (
												<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
													{getNotificationIcon(notification.type)}
												</div>
											)}
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<h3 className="font-medium text-foreground">
															{notification.title}
														</h3>
														{!notification.isRead && (
															<Badge variant="secondary" className="text-xs">
																New
															</Badge>
														)}
													</div>
													<p className="text-muted-foreground text-sm mb-2">
														{notification.message}
													</p>
													<div className="flex items-center gap-4">
														<span className="flex items-center gap-1 text-xs text-muted-foreground">
															<Clock className="h-3 w-3" />
															{notification.timestamp}
														</span>
														{notification.actionUrl && (
															<Link href={notification.actionUrl}>
																<Button
																	variant="link"
																	size="sm"
																	className="p-0 h-auto text-primary hover:text-primary/80"
																>
																	View
																</Button>
															</Link>
														)}
													</div>
												</div>

												{/* Actions */}
												<div className="flex items-center gap-2">
													{!notification.isRead && (
														<Button
															variant="ghost"
															size="sm"
															onClick={() => markAsRead(notification.id)}
															title="Mark as read"
														>
															<Check className="h-4 w-4" />
														</Button>
													)}
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																title="More options"
															>
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => markAsRead(notification.id)}
															>
																Mark as read
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	deleteNotification(notification.id)
																}
																className="text-red-600"
															>
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>
			</div>
		</div>
	);
}
