"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// This is a wrapper component that ensures consistent styling for cards across the app
export function CardWrapper({ className, children, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn("bg-card border-border", className)} {...props}>
      {children}
    </Card>
  )
}

export function CardHeaderWrapper({ className, ...props }: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn("", className)} {...props} />
}

export function CardTitleWrapper({ className, ...props }: React.ComponentProps<typeof CardTitle>) {
  return <CardTitle className={cn("text-foreground", className)} {...props} />
}

export function CardDescriptionWrapper({ className, ...props }: React.ComponentProps<typeof CardDescription>) {
  return <CardDescription className={cn("text-muted-foreground", className)} {...props} />
}

export function CardContentWrapper({ className, ...props }: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("text-foreground", className)} {...props} />
}

export function CardFooterWrapper({ className, ...props }: React.ComponentProps<typeof CardFooter>) {
  return <CardFooter className={cn("", className)} {...props} />
}

