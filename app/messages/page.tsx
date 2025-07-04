"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage as UIAvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Send, Image as ImageIcon, Paperclip, Phone, Video, ArrowLeft, Mic, PhoneOff, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

// Sample conversations data
const conversations = [
  {
    id: 1,
    user: {
      name: "Sarah Miller",
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
      online: true,
    },
    lastMessage: "Is the apartment still available?",
    time: "2m ago",
    unread: true,
    property: "Modern Studio Apartment",
  },
  {
    id: 2,
    user: {
      name: "Michael Chen",
      image: "/placeholder.svg?height=40&width=40",
      verified: true,
      online: false,
    },
    lastMessage: "I'd like to schedule a viewing for tomorrow",
    time: "1h ago",
    unread: false,
    property: "Cozy 2 Bedroom House",
  },
  {
    id: 3,
    user: {
      name: "Emma Wilson",
      image: "/placeholder.svg?height=40&width=40",
      verified: false,
      online: false,
    },
    lastMessage: "Thanks for the information!",
    time: "2d ago",
    unread: false,
    property: "Modern Studio Apartment",
  },
]

// Sample messages for the selected conversation
const messages = [
  {
    id: 1,
    sender: "them",
    text: "Hey, I'm interested in your apartment! Is it still available?",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Hi Sarah! Yes, it's still available. When would you like to move in?",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "them",
    text: "I'm looking to move in next month. Could you tell me more about the neighborhood?",
    time: "10:35 AM",
  },
  {
    id: 4,
    sender: "me",
    text: "The neighborhood is great! Lots of restaurants and a park nearby. It's also close to public transportation.",
    time: "10:38 AM",
  },
]

// Sample icebreakers
const icebreakers = [
  "What's your ideal move-in date?",
  "What are you looking for in a roommate?",
  "Do you have any pets?",
  "What's your typical daily schedule like?",
]

export default function MessagesPage() {
  const router = useRouter()
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")
  const [showCallModal, setShowCallModal] = useState<{ type: "audio" | "video"; isOpen: boolean }>({
    type: "audio",
    isOpen: false,
  })

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", messageText)
      setMessageText("")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Conversations List */}
      <div className="w-full md:w-80 border-r flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link href="/home" className="text-xl font-bold text-vibrant-orange cursor-pointer">
            RoomieMatch
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                selectedConversation.id === conversation.id ? "bg-muted" : ""
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.user.image} alt={conversation.user.name} />
                    <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {conversation.user.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <h3 className="font-medium truncate">{conversation.user.name}</h3>
                      {conversation.user.verified && <CheckCircle className="h-4 w-4 text-vibrant-orange" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                  </div>

                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>

                  <p className="text-xs text-primary mt-1">{conversation.property}</p>
                </div>

                {conversation.unread && (
                  <Badge className="bg-vibrant-orange dark:bg-elegant-orange rounded-full w-2 h-2 p-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedConversation.user.image} alt={selectedConversation.user.name} />
                  <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-medium">{selectedConversation.user.name}</h3>
                    {selectedConversation.user.verified && <CheckCircle className="h-4 w-4 text-vibrant-orange" />}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation.user.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                  onClick={() => setShowCallModal({ type: "audio", isOpen: true })}
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                  onClick={() => setShowCallModal({ type: "video", isOpen: true })}
                >
                  <Video className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Property Card */}
            <Card className="mx-4 mt-4">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded overflow-hidden relative">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt={selectedConversation.property}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedConversation.property}</h4>
                  <p className="text-sm text-muted-foreground">Discussing this property</p>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                  {message.sender === "them" && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarImage src={selectedConversation.user.image} alt={selectedConversation.user.name} />
                      <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      message.sender === "me"
                        ? "bg-vibrant-orange text-white dark:bg-elegant-orange"
                        : "bg-secondary dark:bg-dark-accent"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${message.sender === "me" ? "text-white/70" : "text-muted-foreground"}`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input and Icebreakers */}
            <div className="p-4 border-t space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ImageIcon className="h-5 w-5" alt="" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  className="rounded-full bg-vibrant-orange hover:bg-orange-600 dark:bg-elegant-orange dark:hover:bg-orange-700"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2 text-muted-foreground">Quick Replies</p>
                <div className="flex flex-wrap gap-2">
                  {icebreakers.map((text, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full"
                      onClick={() => setMessageText(text)}
                    >
                      {text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Call Modal */}
            {showCallModal.isOpen && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {showCallModal.type === "audio" ? "Audio" : "Video"} Call with {selectedConversation?.user.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowCallModal({ type: "audio", isOpen: false })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showCallModal.type === "video" && (
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Video preview</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center gap-4">
                      {showCallModal.type === "video" && (
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                          <Video className="h-5 w-5" />
                        </Button>
                      )}
                      <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                        <Mic className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full h-12 w-12"
                        onClick={() => setShowCallModal({ type: "audio", isOpen: false })}
                      >
                        <PhoneOff className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      <p>Calling {selectedConversation?.user.name}...</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="font-medium mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

