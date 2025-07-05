'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Badge } from '@/components/ui/badge';
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
import { useAuth } from '@/context/auth-context';
import {
	Bell,
	Building,
	Heart,
	Home,
	LogOut,
	Menu,
	MessageSquare,
	PlusCircle,
	Search,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ListItemProps {
	href: string;
	title: string;
	icon: ReactNode;
	children: ReactNode;
}

function ListItem({ href, title, icon, children }: ListItemProps) {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					href={href}
					className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
				>
					<div className="flex items-center gap-2 text-sm font-medium leading-none">
						{icon}
						{title}
					</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
}

export default function Navbar() {
	const pathname = usePathname();
	const { logout, user } = useAuth();

	const isActive = (path: string) => {
		return pathname === path;
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1600px]">
				<Link href="/" className="flex items-center gap-1 sm:gap-2">
					<span className="text-xl sm:text-2xl font-bold text-primary">
						RomieSwipe
					</span>
				</Link>

				<nav className="hidden md:flex items-center gap-6 lg:gap-8">
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
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
										<li className="row-span-3">
											<NavigationMenuLink asChild>
												<Link
													className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
													href="/apartments/explore"
												>
													<Building className="h-6 w-6 text-primary" />
													<div className="mb-2 mt-4 text-lg font-medium">
														Explore Apartments
													</div>
													<p className="text-sm leading-tight text-muted-foreground">
														Browse available apartments and find your perfect
														match.
													</p>
												</Link>
											</NavigationMenuLink>
										</li>
										<ListItem
											href="/apartments/post"
											title="Post an Apartment"
											icon={<PlusCircle className="h-4 w-4" />}
										>
											List your apartment and find potential roommates.
										</ListItem>
										<ListItem
											href="/apartments/saved"
											title="Saved Apartments"
											icon={<Heart className="h-4 w-4" />}
										>
											View your saved apartments and favorites.
										</ListItem>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<Link
						href="/explore"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							isActive('/explore') ? 'text-primary' : 'text-muted-foreground'
						}`}
					>
						Explore
					</Link>
					<Link
						href="/matches"
						className={`text-sm font-medium transition-colors hover:text-primary ${
							isActive('/matches') ? 'text-primary' : 'text-muted-foreground'
						}`}
					>
						Matches
					</Link>
				</nav>

				<div className="flex items-center gap-4">
					<ModeToggle />
					{user?.role === 'admin' && (
						<Button
							variant="outline"
							size="sm"
							asChild
							className="font-semibold text-primary border-primary hover:bg-primary/10"
						>
							<Link href="/admin">Admin</Link>
						</Button>
					)}
					<Button
						variant="ghost"
						size="icon"
						title="Notifications"
						asChild
						className="relative"
					>
						<Link href="/notifications">
							<Bell className="h-5 w-5" />
							<span className="sr-only">Notifications</span>
							<Badge
								variant="destructive"
								className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
							>
								2
							</Badge>
						</Link>
					</Button>
					<Button variant="ghost" size="icon" title="Logout" onClick={logout}>
						<LogOut className="h-5 w-5" />
						<span className="sr-only">Logout</span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="hidden md:inline-flex"
						asChild
					>
						<Link href="/profile">
							<User className="h-5 w-5" />
							<span className="sr-only">Profile</span>
						</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
