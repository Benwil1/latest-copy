"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Video, X } from "lucide-react"

interface VideoUploadProps {
  onVideoSelected?: (file: File) => void
}

export function VideoUpload({ onVideoSelected }: VideoUploadProps) {
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showRecordingUI, setShowRecordingUI] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
      onVideoSelected?.(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRecordClick = async () => {
    setShowRecordingUI(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setVideoPreview(url)

        // Convert blob to file
        const file = new File([blob], "recorded-video.webm", { type: "video/webm" })
        onVideoSelected?.(file)

        // Clean up
        chunksRef.current = []
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setShowRecordingUI(false)
    }
  }

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      chunksRef.current = []
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setShowRecordingUI(false)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }

    // Clean up
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }

    setIsRecording(false)
    setShowRecordingUI(false)
    chunksRef.current = []
  }

  const removeVideo = () => {
    setVideoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <input type="file" ref={fileInputRef} accept="video/*" className="hidden" onChange={handleFileChange} />

      {!videoPreview && !showRecordingUI && (
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2"
            onClick={handleUploadClick}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span>Upload Video</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-2"
            onClick={handleRecordClick}
          >
            <Video className="h-8 w-8 text-muted-foreground" />
            <span>Record Video</span>
          </Button>
        </div>
      )}

      {showRecordingUI && (
        <Card className="p-4 space-y-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} className="w-full h-full" muted autoPlay playsInline />
          </div>

          <div className="flex justify-center gap-4">
            {!isRecording ? (
              <Button variant="default" className="rounded-full px-6" onClick={startRecording}>
                Start Recording
              </Button>
            ) : (
              <Button variant="destructive" className="rounded-full px-6" onClick={stopRecording}>
                Stop Recording
              </Button>
            )}

            <Button variant="outline" className="rounded-full px-6" onClick={cancelRecording}>
              Cancel
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Record a short video introduction (30-60 seconds) to help potential roommates get to know you better.
          </p>
        </Card>
      )}

      {videoPreview && (
        <div className="space-y-2">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video src={videoPreview} className="w-full h-full" controls />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={removeVideo}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Your video introduction has been added. You can record a new one or continue with this one.
          </p>
        </div>
      )}
    </div>
  )
}
