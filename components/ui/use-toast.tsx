"use client"

import { useState, useEffect, useCallback } from "react"

type ToastProps = {
  title: string
  description?: string
  duration?: number
}

type Toast = ToastProps & {
  id: string
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, duration = 5000 }: ToastProps) => {
    const id = `toast-${Date.now()}`
    const newToast = { id, title, description, duration }

    setToasts((prevToasts) => [...prevToasts, newToast])

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
      }, duration)
    }

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    // Add the Toast UI component to the DOM
    const toastContainer = document.getElementById("toast-container")

    if (!toastContainer && typeof document !== "undefined") {
      const container = document.createElement("div")
      container.id = "toast-container"
      container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2"
      document.body.appendChild(container)
    }

    // Render toasts
    const renderToasts = () => {
      const container = document.getElementById("toast-container")
      if (!container) return

      toasts.forEach((toast) => {
        const existingToast = document.getElementById(toast.id)
        if (!existingToast) {
          const toastElement = document.createElement("div")
          toastElement.id = toast.id
          toastElement.className =
            "bg-background border rounded-lg shadow-lg p-4 max-w-md animate-in slide-in-from-right-5 duration-300"

          const titleElement = document.createElement("div")
          titleElement.className = "font-medium"
          titleElement.textContent = toast.title
          toastElement.appendChild(titleElement)

          if (toast.description) {
            const descElement = document.createElement("div")
            descElement.className = "text-sm text-muted-foreground mt-1"
            descElement.textContent = toast.description
            toastElement.appendChild(descElement)
          }

          // Add close button
          const closeButton = document.createElement("button")
          closeButton.className = "absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
          closeButton.innerHTML = "×"
          closeButton.onclick = () => dismiss(toast.id)
          toastElement.appendChild(closeButton)

          container.appendChild(toastElement)
        }
      })

      // Remove dismissed toasts
      Array.from(container.children).forEach((child) => {
        if (!toasts.some((toast) => toast.id === child.id)) {
          child.classList.add("animate-out", "slide-out-to-right-5", "duration-300")
          setTimeout(() => {
            if (container.contains(child)) {
              container.removeChild(child)
            }
          }, 300)
        }
      })
    }

    renderToasts()

    return () => {
      // Clean up on unmount
      const container = document.getElementById("toast-container")
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container)
      }
    }
  }, [toasts, dismiss])

  return { toast, dismiss }
}

