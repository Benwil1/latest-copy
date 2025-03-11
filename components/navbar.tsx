'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { UserButton } from '@/components/user-button';
import {
	Building,
	Home,
	MessageSquare,
	PlusCircle,
	Search,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
	const pathname = usePathname();

	const isActive = (path: string) => {
		return pathname === path;
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
				<Link href="/" className="flex items-center gap-1 sm:gap-2">
					<span className="text-xl sm:text-2xl font-bold text-primary">
						RoomEase
					</span>
				</Link>

				<nav className="hidden md:flex items-center gap-4 sm:gap-6">
					<Link
						href="/"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							isActive('/') ? 'text-primary' : 'text-muted-foreground'
						}`}
					>
						Home
					</Link>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger
									className={`text-sm font-medium ${
										pathname.includes('/apartments')
											? 'text-primary'
											: 'text-muted-foreground'
									}`}
								>
									Apartments
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid gap-3 p-4 w-[200px]">
										<li>
											<NavigationMenuLink asChild>
												<Link
													href="/apartments/explore"
													className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
												>
													<div className="text-sm font-medium leading-none">
														Explore
													</div>
													<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
														Browse available apartments
													</p>
												</Link>
											</NavigationMenuLink>
										</li>
										<li>
											<NavigationMenuLink asChild>
												<Link
													href="/apartments/post"
													className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
												>
													<div className="text-sm font-medium leading-none">
														Post
													</div>
													<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
														List your apartment
													</p>
												</Link>
											</NavigationMenuLink>
										</li>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<Link
						href="/search"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							isActive('/search') ? 'text-primary' : 'text-muted-foreground'
						}`}
					>
						Search
					</Link>
					<Link
						href="/messages"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							isActive('/messages') ? 'text-primary' : 'text-muted-foreground'
						}`}
					>
						Messages
					</Link>
					<Link
						href="/profile"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							isActive('/profile') ? 'text-primary' : 'text-muted-foreground'
						}`}
					>
						Profile
					</Link>
				</nav>

				<div className="flex items-center gap-2 sm:gap-4">
					<Button
						asChild
						variant="default"
						className="hidden md:flex text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 bg-vibrant-orange hover:bg-orange-600 dark:bg-elegant-orange dark:hover:bg-orange-700"
					>
						<Link href="/apartments/post">Post an Apartment</Link>
					</Button>
					<ModeToggle />
					<UserButton />
				</div>

				<div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around py-2 z-50">
					<Link href="/" className="flex flex-col items-center p-2">
						<Home
							className={`h-5 w-5 ${
								isActive('/') ? 'text-primary' : 'text-muted-foreground'
							}`}
						/>
						<span
							className={`text-xs ${
								isActive('/')
									? 'text-primary font-medium'
									: 'text-muted-foreground'
							}`}
						>
							Home
						</span>
						{isActive('/') && (
							<div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
						)}
					</Link>
					<Link
						href="/apartments/explore"
						className="flex flex-col items-center p-2"
					>
						<Building
							className={`h-5 w-5 ${
								pathname.includes('/apartments')
									? 'text-primary'
									: 'text-muted-foreground'
							}`}
						/>
						<span
							className={`text-xs ${
								pathname.includes('/apartments')
									? 'text-primary font-medium'
									: 'text-muted-foreground'
							}`}
						>
							Apartments
						</span>
						{pathname.includes('/apartments') && (
							<div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
						)}
					</Link>
					<Link href="/search" className="flex flex-col items-center p-2">
						<Search
							className={`h-5 w-5 ${
								isActive('/search') ? 'text-primary' : 'text-muted-foreground'
							}`}
						/>
						<span
							className={`text-xs ${
								isActive('/search')
									? 'text-primary font-medium'
									: 'text-muted-foreground'
							}`}
						>
							Search
						</span>
						{isActive('/search') && (
							<div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
						)}
					</Link>
					<Link href="/messages" className="flex flex-col items-center p-2">
						<MessageSquare
							className={`h-5 w-5 ${
								isActive('/messages') ? 'text-primary' : 'text-muted-foreground'
							}`}
						/>
						<span
							className={`text-xs ${
								isActive('/messages')
									? 'text-primary font-medium'
									: 'text-muted-foreground'
							}`}
						>
							Messages
						</span>
						{isActive('/messages') && (
							<div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
						)}
					</Link>
					<Link href="/profile" className="flex flex-col items-center p-2">
						<User
							className={`h-5 w-5 ${
								isActive('/profile') ? 'text-primary' : 'text-muted-foreground'
							}`}
						/>
						<span
							className={`text-xs ${
								isActive('/profile')
									? 'text-primary font-medium'
									: 'text-muted-foreground'
							}`}
						>
							Profile
						</span>
						{isActive('/profile') && (
							<div className="w-1.5 h-1.5 rounded-full bg-primary mt-1"></div>
						)}
					</Link>
				</div>
			</div>
		</header>
	);
}
