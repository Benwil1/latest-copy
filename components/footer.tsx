import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-0 hidden md:block">
      <div className="container flex flex-col md:flex-row md:h-16 items-center justify-between gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold">RoomEase</span>
          </Link>
          <p className="text-sm text-muted-foreground">© 2025 RoomEase. All rights reserved.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

