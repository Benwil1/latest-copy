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
					className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-primary/5 hover:border-primary/20 border border-transparent hover:shadow-md hover:shadow-primary/10 focus:bg-primary/5 focus:border-primary/20 group"
				>
					<div className="flex items-center gap-2 text-sm font-semibold leading-none group-hover:text-primary transition-colors duration-300">
						<span className="group-hover:scale-110 transition-transform duration-300">
						{icon}
						</span>
						{title}
					</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
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
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 shadow-lg shadow-primary/5">
			{/* Animated gradient border */}
			<div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
			
			<div className="w-full flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6 lg:px-10">
				{/* Logo with glow effect */}
				<Link 
					href="/" 
					className="flex items-center gap-2 group relative"
				>
					<div className="absolute inset-0 bg-primary/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
					<span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent tracking-tight group-hover:scale-105 transition-transform duration-300">
						RomieSwipe
					</span>
					<div className="h-2 w-2 rounded-full bg-primary animate-pulse opacity-70"></div>
				</Link>

				{/* Navigation with animated underlines */}
				<nav className="hidden md:flex items-center gap-1 lg:gap-2">
					<Link
						href="/home"
						className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
							isActive('/home') 
								? 'text-primary' 
								: 'text-muted-foreground hover:text-foreground'
						}`}
					>
						<span className="relative z-10 flex items-center gap-2">
							<Home className="h-4 w-4" />
							Home
						</span>
						{isActive('/home') && (
							<div className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"></div>
						)}
						<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
					</Link>
					
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger
									className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
										pathname.includes('/apartments')
											? 'text-primary'
											: 'text-muted-foreground hover:text-foreground'
									}`}
								>
									<span className="relative z-10 flex items-center gap-2">
										<Building className="h-4 w-4" />
									Apartments
									</span>
									{pathname.includes('/apartments') && (
										<div className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"></div>
									)}
									<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl">
										<li className="row-span-3">
											<NavigationMenuLink asChild>
												<Link
													className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 no-underline outline-none focus:shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
													href="/apartments/explore"
												>
													<Building className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform duration-300" />
													<div className="mb-2 mt-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
						className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
							isActive('/explore') 
								? 'text-primary' 
								: 'text-muted-foreground hover:text-foreground'
						}`}
					>
						<span className="relative z-10 flex items-center gap-2">
							<Search className="h-4 w-4" />
						Explore
						</span>
						{isActive('/explore') && (
							<div className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"></div>
						)}
						<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
					</Link>
					
					<Link
						href="/matches"
						className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
							isActive('/matches') 
								? 'text-primary' 
								: 'text-muted-foreground hover:text-foreground'
						}`}
					>
						<span className="relative z-10 flex items-center gap-2">
							<MessageSquare className="h-4 w-4" />
						Matches
						</span>
						{isActive('/matches') && (
							<div className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"></div>
						)}
						<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
					</Link>
					
					<Link
						href="/likes"
						className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
							isActive('/likes') 
								? 'text-primary' 
								: 'text-muted-foreground hover:text-foreground'
						}`}
					>
						<span className="relative z-10 flex items-center gap-2">
							<Heart className="h-4 w-4" />
						Likes
						</span>
						{isActive('/likes') && (
							<div className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"></div>
						)}
						<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
					</Link>
				</nav>

				{/* Action buttons with modern styling */}
				<div className="flex items-center gap-2 sm:gap-3">
					<ModeToggle />
					{user?.role === 'admin' && (
						<Button
							variant="outline"
							size="sm"
							asChild
							className="font-semibold text-primary border-primary/50 hover:bg-primary/10 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
						>
							<Link href="/admin">Admin</Link>
						</Button>
					)}
					<Button
						variant="ghost"
						size="icon"
						title="Notifications"
						asChild
						className="relative group rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
					>
						<Link href="/notifications">
							<Bell className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
							<span className="sr-only">Notifications</span>
							<Badge
								variant="destructive"
								className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse shadow-lg shadow-red-500/50"
							>
								2
							</Badge>
						</Link>
					</Button>
					<Button 
						variant="ghost" 
						size="icon" 
						title="Logout" 
						onClick={logout}
						className="rounded-lg hover:bg-destructive/10 hover:shadow-lg hover:shadow-destructive/10 transition-all duration-300 group"
					>
						<LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
						<span className="sr-only">Logout</span>
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="hidden md:inline-flex rounded-lg hover:bg-primary/10 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
						asChild
					>
						<Link href="/profile">
							<User className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
							<span className="sr-only">Profile</span>
						</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
