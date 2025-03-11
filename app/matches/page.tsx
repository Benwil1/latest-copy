'use client';

import MobileNav from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useEffect, useState } from 'react';

// Sample matches data
const matches = [
	{
		id: 1,
		name: 'Sarah Johnson',
		age: 26,
		image:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		lastActive: 'Just now',
		compatibility: 92,
		verified: true,
		unread: true,
		lastMessage:
			"Hey, I'm interested in your apartment! Is it still available?",
		online: true,
		property: 'Modern Studio',
		location: 'Downtown',
		budget: 1200,
		moveIn: 'Immediate',
	},
	{
		id: 2,
		name: 'Michael Chen',
		age: 28,
		image:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		lastActive: '2h ago',
		compatibility: 85,
		verified: true,
		unread: false,
		lastMessage: 'The apartment looks great! When can I schedule a viewing?',
		online: false,
		property: 'Spacious 2-Bed',
		location: 'Midtown',
		budget: 1500,
		moveIn: 'Next month',
	},
	{
		id: 3,
		name: 'Emma Rodriguez',
		age: 24,
		image:
			'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3',
		lastActive: '3h ago',
		compatibility: 78,
		verified: false,
		unread: false,
		lastMessage: 'Thanks for the info about the neighborhood!',
		online: false,
		property: 'Luxury Loft',
		location: 'Uptown',
		budget: 1800,
		moveIn: 'Flexible',
	},
];

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
	const [activeTab, setActiveTab] = useState('matches');
	const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
	const [messageText, setMessageText] = useState('');
	const [searchQuery, setSearchQuery] = useState('');
	const [showCallModal, setShowCallModal] = useState<{
		type: 'audio' | 'video';
		isOpen: boolean;
	}>({
		type: 'audio',
		isOpen: false,
	});
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

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

	// Filter matches based on search query
	const filteredMatches = matches.filter(
		(match) =>
			match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			match.location.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const currentMatch = matches.find((match) => match.id === selectedMatch);

	return (
		<div className="min-h-screen pb-16 flex flex-col">
			<header className="p-3 flex justify-between items-center safe-area-top bg-background/80 backdrop-blur-sm z-10">
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 p-0"
					onClick={() => router.back()}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
				<div className="text-xl font-bold text-vibrant-orange">RoomieMatch</div>
				<ModeToggle />
			</header>

			<main className="flex-1 flex flex-col overflow-hidden">
				<div className="flex-1 max-w-3xl mx-auto w-full">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="h-full flex flex-col"
					>
						<div className="px-3 pt-2 pb-1">
							<TabsList className="grid w-full grid-cols-2 h-9">
								<TabsTrigger value="matches" className="text-xs">
									Matches
								</TabsTrigger>
								<TabsTrigger
									value="chat"
									disabled={!selectedMatch}
									className="text-xs"
								>
									Chat
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent
							value="matches"
							className="p-3 space-y-3 flex-1 overflow-auto"
						>
							<div className="relative">
								<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search matches..."
									className="pl-8 h-8 text-xs"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>

							<div className="space-y-3">
								{filteredMatches.map((match) => (
									<Card
										key={match.id}
										className="overflow-hidden cursor-pointer transition-colors hover:bg-muted/50"
										onClick={() => handleInitiateMessage(match.id)}
									>
										<div className="flex">
											<div className="w-24 sm:w-32">
												<img
													src={match.image || '/placeholder.svg'}
													alt={match.name}
													className="w-full h-full object-cover"
												/>
											</div>
											<CardContent className="flex-1 p-4">
												<div className="flex items-center justify-between mb-2">
													<div>
														<h3 className="font-medium">
															{match.name}, {match.age}
														</h3>
														<p className="text-xs text-muted-foreground">
															Active {match.lastActive}
														</p>
													</div>
													<Badge variant="orange" className="text-xs">
														{match.compatibility}% Match
													</Badge>
												</div>

												<div className="grid grid-cols-3 gap-2 text-sm">
													<div className="flex items-center">
														<MapPin className="h-4 w-4 mr-1 text-vibrant-orange" />
														<span className="text-muted-foreground">
															{match.location}
														</span>
													</div>
													<div className="flex items-center">
														<DollarSign className="h-4 w-4 mr-1 text-vibrant-orange" />
														<span className="text-muted-foreground">
															${match.budget}
														</span>
													</div>
													<div className="flex items-center">
														<Calendar className="h-4 w-4 mr-1 text-vibrant-orange" />
														<span className="text-muted-foreground">
															{match.moveIn}
														</span>
													</div>
												</div>
											</CardContent>
										</div>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent
							value="chat"
							className="flex-1 flex flex-col h-[calc(100vh-8rem)]"
						>
							{selectedMatch && currentMatch && (
								<div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
									{/* Chat Header */}
									<div className="p-2 border-b flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div
												className="cursor-pointer"
												onClick={() => {
													setIsLoading(true);
													router.push(`/roommate/${currentMatch.id}`);
													setTimeout(() => setIsLoading(false), 1000);
												}}
											>
												<Avatar className="h-7 w-7 hover:ring-2 hover:ring-vibrant-orange transition-all">
													<AvatarImage
														src={currentMatch.image}
														alt={currentMatch.name}
													/>
													<AvatarFallback>
														{currentMatch.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
											</div>

											<div>
												<div className="flex items-center gap-1">
													<h3 className="font-medium text-xs">
														{currentMatch.name}
													</h3>
													{currentMatch.verified && (
														<CheckCircle className="h-3 w-3 text-vibrant-orange" />
													)}
												</div>
												<p className="text-[10px] text-muted-foreground">
													{currentMatch.online ? 'Online' : 'Offline'}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 rounded-full hover:bg-muted"
												onClick={() =>
													setShowCallModal({ type: 'audio', isOpen: true })
												}
											>
												<Phone className="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 rounded-full hover:bg-muted"
												onClick={() =>
													setShowCallModal({ type: 'video', isOpen: true })
												}
											>
												<Video className="h-3 w-3" />
											</Button>
										</div>
									</div>

									{/* Property Card - Make it more compact on mobile */}
									<div className="px-2 pt-2">
										<div className="p-1.5 border rounded-md flex items-center gap-2 bg-muted/30">
											<div className="h-6 w-6 rounded overflow-hidden shrink-0">
												<img
													src="/placeholder.svg?height=32&width=32"
													alt={currentMatch.property}
													className="h-full w-full object-cover"
												/>
											</div>
											<div className="min-w-0">
												<h4 className="font-medium text-[10px] truncate">
													{currentMatch.property}
												</h4>
												<p className="text-[8px] text-muted-foreground">
													Discussing this property
												</p>
											</div>
										</div>
									</div>

									{/* Messages - Make sure this area can scroll properly */}
									<div className="flex-1 overflow-y-auto p-2 space-y-2">
										{messages.map((message) => (
											<div
												key={message.id}
												className={`flex ${
													message.sender === 'me'
														? 'justify-end'
														: 'justify-start'
												}`}
											>
												{message.sender === 'them' && (
													<Avatar className="h-5 w-5 mr-1 mt-1 shrink-0">
														<AvatarImage
															src={currentMatch.image}
															alt={currentMatch.name}
														/>
														<AvatarFallback>
															{currentMatch.name.charAt(0)}
														</AvatarFallback>
													</Avatar>
												)}
												<div
													className={`max-w-[75%] rounded-2xl px-2 py-1.5 ${
														message.sender === 'me'
															? 'bg-vibrant-orange text-white dark:bg-elegant-orange'
															: 'bg-secondary dark:bg-dark-accent'
													}`}
												>
													<p className="text-xs break-words">{message.text}</p>
													<p
														className={`text-[10px] mt-0.5 ${
															message.sender === 'me'
																? 'text-white/70'
																: 'text-muted-foreground'
														}`}
													>
														{message.time}
													</p>
												</div>
											</div>
										))}
									</div>

									{/* Message Input and Icebreakers - Make more compact */}
									<div className="p-2 border-t">
										<div className="flex items-center gap-1 mb-2">
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 rounded-full p-0"
											>
												<Paperclip className="h-3 w-3" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 rounded-full p-0"
											>
												<ImageIcon className="h-3 w-3" />
											</Button>
											<Input
												placeholder="Type a message..."
												value={messageText}
												onChange={(e) => setMessageText(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														handleSendMessage();
													}
												}}
												className="flex-1 h-7 text-xs"
											/>
											<Button
												size="icon"
												className="h-7 w-7 rounded-full bg-vibrant-orange hover:bg-orange-600 dark:bg-elegant-orange dark:hover:bg-orange-700 p-0"
												onClick={handleSendMessage}
												disabled={!messageText.trim()}
											>
												<Send className="h-3 w-3" />
											</Button>
										</div>

										<div className="border-t pt-1.5">
											<p className="text-[10px] font-medium mb-1 text-muted-foreground">
												Quick Replies
											</p>
											<div className="flex flex-wrap gap-1">
												{icebreakers.map((text, index) => (
													<Button
														key={index}
														variant="outline"
														size="sm"
														className="text-[10px] rounded-full h-6 px-1.5 py-0"
														onClick={() => setMessageText(text)}
													>
														{text}
													</Button>
												))}
											</div>
										</div>
									</div>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</main>

			{/* Call Modal */}
			{showCallModal.isOpen && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
					<Card className="w-full max-w-xs animate-in fade-in slide-in-from-bottom-4">
						<div className="p-3 flex items-center justify-between">
							<h3 className="font-medium text-sm">
								{showCallModal.type === 'audio' ? 'Audio' : 'Video'} Call with{' '}
								{currentMatch?.name}
							</h3>
							<Button
								variant="ghost"
								size="icon"
								className="h-7 w-7 p-0"
								onClick={() =>
									setShowCallModal({ type: 'audio', isOpen: false })
								}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
						<div className="p-3 space-y-3">
							{showCallModal.type === 'video' && (
								<div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
									<div className="text-center">
										<Video className="h-10 w-10 mx-auto mb-1 text-muted-foreground" />
										<p className="text-xs text-muted-foreground">
											Video preview
										</p>
									</div>
								</div>
							)}

							<div className="flex justify-center gap-3">
								{showCallModal.type === 'video' && (
									<Button
										variant="outline"
										size="icon"
										className="rounded-full h-10 w-10 p-0"
									>
										<Video className="h-4 w-4" />
									</Button>
								)}
								<Button
									variant="outline"
									size="icon"
									className="rounded-full h-10 w-10 p-0"
								>
									<Mic className="h-4 w-4" />
								</Button>
								<Button
									variant="destructive"
									size="icon"
									className="rounded-full h-10 w-10 p-0"
									onClick={() =>
										setShowCallModal({ type: 'audio', isOpen: false })
									}
								>
									<PhoneOff className="h-4 w-4" />
								</Button>
							</div>

							<div className="text-center text-xs text-muted-foreground">
								<p>Calling {currentMatch?.name}...</p>
							</div>
						</div>
					</Card>
				</div>
			)}

			<MobileNav />
		</div>
	);
}
