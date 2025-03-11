"use client"

import { useEffect, useRef, useCallback } from "react"
import { MapPin } from "lucide-react"
import { useTheme } from "next-themes"

interface ListingMapProps {
  location: string
}

export default function ListingMap({ location }: ListingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  const drawMap = useCallback(() => {
    if (mapRef.current) {
      // Clear previous content
      while (mapRef.current.firstChild) {
        mapRef.current.removeChild(mapRef.current.firstChild)
      }

      const canvas = document.createElement("canvas")
      canvas.width = mapRef.current.clientWidth
      canvas.height = mapRef.current.clientHeight
      mapRef.current.appendChild(canvas)

      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Draw a placeholder map with theme-aware colors
        const isDark = theme === "dark"

        // Background color
        ctx.fillStyle = isDark ? "#1A2236" : "#e5e7eb"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Roads color
        ctx.strokeStyle = isDark ? "#2A3349" : "#ffffff"
        ctx.lineWidth = 3

        // Horizontal roads
        for (let i = 1; i < 5; i++) {
          ctx.beginPath()
          ctx.moveTo(0, canvas.height * (i / 5))
          ctx.lineTo(canvas.width, canvas.height * (i / 5))
          ctx.stroke()
        }

        // Vertical roads
        for (let i = 1; i < 5; i++) {
          ctx.beginPath()
          ctx.moveTo(canvas.width * (i / 5), 0)
          ctx.lineTo(canvas.width * (i / 5), canvas.height)
          ctx.stroke()
        }

        // Draw location marker
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2

        // Draw pin shadow
        ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.2)"
        ctx.beginPath()
        ctx.arc(centerX, centerY + 2, 10, 0, Math.PI * 2)
        ctx.fill()

        // Draw pin - use elegant primary color in dark mode
        ctx.fillStyle = isDark ? "#3B68D9" : "#1E3A8A"
        ctx.beginPath()
        ctx.arc(centerX, centerY, 12, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = isDark ? "#1A2236" : "#ffffff"
        ctx.beginPath()
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }, [theme])

  useEffect(() => {
    drawMap()

    // Handle theme changes
    const handleThemeChange = () => {
      drawMap()
    }

    if (mapRef.current) {
      mapRef.current.setAttribute("data-map-container", "true")
      mapRef.current.addEventListener("theme-changed", handleThemeChange)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.removeEventListener("theme-changed", handleThemeChange)
      }
    }
  }, [drawMap])

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full"></div>
      <div className="absolute bottom-4 left-4 bg-background border p-2 rounded-md shadow-md flex items-center">
        <MapPin className="h-4 w-4 text-primary mr-2" />
        <span className="text-sm font-medium">{location}</span>
      </div>
    </div>
  )
}

