'use client';

import MobileNav from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth-context';
import {
	ArrowLeft,
	Calendar,
	CheckCircle,
	DollarSign,
	ImageIcon,
	MapPin,
	MessageSquare,
	Mic,
	Paperclip,
	Phone,
	PhoneOff,
	Search,
	Send,
	Video,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Roommate, roommates } from '../explore/page';

// Sample messages for a conversation
const messages = [
	{
		id: 1,
		sender: 'them',
		text: "Hey, I'm interested in your apartment! Is it still available?",
		time: '10:30 AM',
	},
	{
		id: 2,
		sender: 'me',
		text: "Hi Sarah! Yes, it's still available. When would you like to move in?",
		time: '10:32 AM',
	},
	{
		id: 3,
		sender: 'them',
		text: "I'm looking to move in next month. Could you tell me more about the neighborhood?",
		time: '10:35 AM',
	},
	{
		id: 4,
		sender: 'me',
		text: "The neighborhood is great! Lots of restaurants and a park nearby. It's also close to public transportation.",
		time: '10:38 AM',
	},
];

// Sample icebreakers
const icebreakers = [
	"What's your ideal move-in date?",
	'What are you looking for in a roommate?',
	'Do you have any pets?',
	"What's your typical daily schedule like?",
];

export default function MatchesPage() {
	const { user, updateProfile } = useAuth();
	const [activeTab, setActiveTab] = useState('matches');
	const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
	const [messageText, setMessageText] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [sidebarOpen, setSidebarOpen] = useState(false); // for mobile
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// Compute mutual matches
	const mutualMatches = useMemo<Roommate[]>(() => {
		if (!user) return [];
		return roommates.filter(
			(roommate: Roommate) =>
				user.likedUserIds?.includes(roommate.id.toString()) &&
				roommate.likedUserIds?.includes(user.id)
		);
	}, [user]);

	const filteredMatches = mutualMatches.filter(
		(match: Roommate) =>
			match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			match.location.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const currentMatch = mutualMatches.find(
		(match: Roommate) => match.id === selectedMatch
	);

	// Prevent unwanted zooming on mobile
	useEffect(() => {
		document
			.querySelector('meta[name="viewport"]')
			?.setAttribute(
				'content',
				'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
			);

		return () => {
			document
				.querySelector('meta[name="viewport"]')
				?.setAttribute('content', 'width=device-width, initial-scale=1.0');
		};
	}, []);

	// Handle initiating a new message/conversation
	const handleInitiateMessage = (matchId: number) => {
		setSelectedMatch(matchId);
		setActiveTab('chat');
	};

	// Handle sending a message
	const handleSendMessage = () => {
		if (messageText.trim()) {
			// In a real app, this would send the message to the backend
			console.log('Sending message:', messageText);
			setMessageText('');
		}
	};

	const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

	return (
		<div className="min-h-screen flex flex-col bg-background">
			<main className="flex-1 flex h-[100dvh]">
				{/* Sidebar (conversation list) */}
				{(!isMobile || !selectedMatch) && (
					<aside className="w-full max-w-xs border-r border-border bg-background flex flex-col h-full">
						<div className="p-4 border-b border-border flex items-center justify-between">
							<h2 className="text-xl font-bold text-vibrant-orange animate-fade-in-up">
								Messages
							</h2>
						</div>
						<div className="p-3">
							<input
								type="text"
								placeholder="Search..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full mb-3 px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange bg-muted transform-gpu hover:scale-105 transition-transform duration-200"
							/>
							<div className="space-y-2 overflow-y-auto max-h-[calc(100vh-10rem)]">
								{filteredMatches.map((match, index) => (
									<button
										key={match.id}
										onClick={() => setSelectedMatch(match.id)}
										className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 focus:bg-orange-100 dark:focus:bg-orange-950/30 text-left transform-gpu hover:scale-105 hover:translate-y-[-2px] hover:shadow-lg ${
											selectedMatch === match.id
												? 'bg-orange-100 dark:bg-orange-950/30 shadow-md'
												: ''
										}`}
										style={{
											animationDelay: `${index * 100}ms`,
											animation: 'fade-in-up 0.6s ease-out forwards',
										}}
									>
										<div className="relative">
											<Avatar className="h-12 w-12 transform-gpu hover:scale-110 transition-transform duration-300">
												<AvatarImage
													src={match.image}
													alt={match.name}
													className="object-cover w-full h-full"
												/>
												<AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
											</Avatar>
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1 min-w-0 gap-2">
												<div className="flex items-center gap-1 min-w-0">
													<h3 className="font-medium truncate max-w-[120px] sm:max-w-[160px]">
														{match.name}, {match.age}
													</h3>
													{match.verified && (
														<CheckCircle className="h-4 w-4 text-vibrant-orange shrink-0" />
													)}
												</div>
											</div>

											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Badge
														variant="secondary"
														className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
													>
														{match.compatibility}% match
													</Badge>
													<span className="text-xs text-muted-foreground">
														{match.location}
													</span>
												</div>
											</div>
										</div>
									</button>
								))}
							</div>
						</div>
					</aside>
				)}

				{/* Chat area */}
				{selectedMatch && currentMatch && (
					<section className="flex-1 flex flex-col h-[100dvh] max-h-[100dvh] bg-background">
						{/* Header */}
						<div className="flex items-center gap-4 p-4 border-b border-border bg-background sticky top-0 z-10">
							{isMobile && (
								<button
									onClick={() => setSelectedMatch(null)}
									className="mr-2"
									title="Back"
								>
									<ArrowLeft className="h-6 w-6 text-vibrant-orange" />
								</button>
							)}
							<Avatar className="h-10 w-10 ring-2 ring-vibrant-orange">
								<AvatarImage
									src={currentMatch.image}
									alt={currentMatch.name}
									className="object-cover w-full h-full"
								/>
								<AvatarFallback>{currentMatch.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<div className="flex items-center gap-2">
									<span className="font-bold text-lg text-foreground">
										{currentMatch.name}
									</span>
									{currentMatch.verified && (
										<CheckCircle className="h-5 w-5 text-vibrant-orange" />
									)}
								</div>
								<span className="text-xs text-muted-foreground">Matched!</span>
							</div>
							<div className="ml-auto flex gap-2">
								<Button variant="ghost" size="icon" title="Call">
									<Phone className="h-5 w-5" />
								</Button>
								<Button variant="ghost" size="icon" title="Video call">
									<Video className="h-5 w-5" />
								</Button>
							</div>
						</div>

						{/* Messages */}
						<div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-6 py-4 space-y-4 bg-background pb-24 md:pb-0">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${
										message.sender === 'me' ? 'justify-end' : 'justify-start'
									}`}
								>
									<div
										className={`max-w-[80vw] sm:max-w-md rounded-2xl px-4 py-2.5 shadow-sm text-sm break-words ${
											message.sender === 'me'
												? 'bg-vibrant-orange text-white rounded-br-md'
												: 'bg-muted text-foreground rounded-bl-md'
										}`}
									>
										<p>{message.text}</p>
										<p className="text-xs mt-1 text-right opacity-60">
											{message.time}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Message Input */}
						<div
							className="w-full border-t border-border flex items-center gap-2 px-2 sm:px-6 py-3 z-20 md:sticky md:bottom-0 md:bg-background fixed bottom-24 left-0 bg-background"
							style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.02)' }}
						>
							<Button variant="ghost" size="icon">
								<Paperclip className="h-5 w-5" />
							</Button>
							<Input
								placeholder="Message..."
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
								className="flex-1 rounded-full px-4 py-2 text-[16px] border border-border focus:ring-2 focus:ring-vibrant-orange"
								onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
							/>
							<Button
								size="icon"
								className="bg-vibrant-orange hover:bg-orange-600 rounded-full"
								onClick={handleSendMessage}
								disabled={!messageText.trim()}
							>
								<Send className="h-5 w-5" />
							</Button>
						</div>
					</section>
				)}
			</main>
			<MobileNav />
		</div>
	);
}
