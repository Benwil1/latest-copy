"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { UserButton } from "@/components/user-button"
import { Home, Search, MessageSquare, PlusCircle, User, Settings, Menu } from "lucide-react"

export function MainSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: MessageSquare, label: "Messages", path: "/matches" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  return (
    <Sidebar className="hidden md:flex border-r border-border">
      <SidebarHeader className="border-b px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-vibrant-orange dark:text-elegant-orange">RoomieMatch</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild isActive={isActive(item.path)}>
                <Link href={item.path}>
                  <item.icon className="h-5 w-5 mr-2" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-vibrant-orange hover:text-vibrant-orange/90 dark:text-elegant-orange dark:hover:text-elegant-orange/90"
            >
              <Link href="/create-listing">
                <PlusCircle className="h-5 w-5 mr-2" />
                <span>Create Listing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex justify-between items-center">
          <UserButton />
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

export function MobileSidebarTrigger() {
  return (
    <div className="md:hidden">
      <SidebarTrigger>
        <Menu className="h-5 w-5" />
      </SidebarTrigger>
    </div>
  )
}

