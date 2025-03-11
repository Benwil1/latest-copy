'use client';

import {
	Building,
	Home,
	MessageSquare,
	Search,
	Settings,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
	const pathname = usePathname();

	const isActive = (path: string) => {
		return pathname === path;
	};

	return (
		<div className="fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around py-2 z-50 safe-area-bottom">
			<Link href="/home" className="flex flex-col items-center p-1">
				<Home
					className={`h-5 w-5 ${
						isActive('/home') ? 'text-primary' : 'text-muted-foreground'
					}`}
				/>
				<span
					className={`text-[10px] ${
						isActive('/home')
							? 'text-primary font-medium'
							: 'text-muted-foreground'
					}`}
				>
					Home
				</span>
				{isActive('/home') && (
					<div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5"></div>
				)}
			</Link>
			<Link href="/explore" className="flex flex-col items-center p-1">
				<Search
					className={`h-5 w-5 ${
						isActive('/explore') ? 'text-primary' : 'text-muted-foreground'
					}`}
				/>
				<span
					className={`text-[10px] ${
						isActive('/explore')
							? 'text-primary font-medium'
							: 'text-muted-foreground'
					}`}
				>
					Explore
				</span>
				{isActive('/explore') && (
					<div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5"></div>
				)}
			</Link>
			<Link href="/matches" className="flex flex-col items-center p-1">
				<MessageSquare
					className={`h-5 w-5 ${
						isActive('/matches') ? 'text-primary' : 'text-muted-foreground'
					}`}
				/>
				<span
					className={`text-[10px] ${
						isActive('/matches')
							? 'text-primary font-medium'
							: 'text-muted-foreground'
					}`}
				>
					Matches
				</span>
				{isActive('/matches') && (
					<div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5"></div>
				)}
			</Link>
			<Link
				href="/apartments/explore"
				className="flex flex-col items-center p-1"
			>
				<Building
					className={`h-5 w-5 ${
						pathname.includes('/apartments')
							? 'text-primary'
							: 'text-muted-foreground'
					}`}
				/>
				<span
					className={`text-[10px] ${
						pathname.includes('/apartments')
							? 'text-primary font-medium'
							: 'text-muted-foreground'
					}`}
				>
					Apartments
				</span>
				{pathname.includes('/apartments') && (
					<div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5"></div>
				)}
			</Link>
			<Link href="/profile" className="flex flex-col items-center p-1">
				<User
					className={`h-5 w-5 ${
						isActive('/profile') ? 'text-primary' : 'text-muted-foreground'
					}`}
				/>
				<span
					className={`text-[10px] ${
						isActive('/profile')
							? 'text-primary font-medium'
							: 'text-muted-foreground'
					}`}
				>
					Profile
				</span>
				{isActive('/profile') && (
					<div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5"></div>
				)}
			</Link>
			<Link href="/settings" className="flex flex-col items-center p-1">
				<Settings
					className={`h-5 w-5 ${
						isActive('/settings') ? 'text-primary' : 'text-muted-foreground'
					}`}
				/>
				<span
					className={`text-[10px] ${
						isActive('/settings')
							? 'text-primary font-medium'
							: 'text-muted-foreground'
					}`}
				>
					Settings
				</span>
				{isActive('/settings') && (
					<div className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5"></div>
				)}
			</Link>
		</div>
	);
}
