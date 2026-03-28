"use client"

import React from "react"
import { X, Download } from "lucide-react"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  tmdbId: string
  mediaType: "movie" | "tv"
  seasonNumber?: number
  episodeNumber?: number
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  tmdbId,
  mediaType,
  seasonNumber,
  episodeNumber,
}) => {
  if (!isOpen) return null

  // Generate vidvault URL based on media type
  let embedUrl: string
  if (mediaType === "movie") {
    embedUrl = `https://vidvault.ru/movie/${tmdbId}`
  } else {
    embedUrl = `https://vidvault.ru/tv/${tmdbId}/${seasonNumber || 1}/${episodeNumber || 1}`
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
        {/* Header with title and close button */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Download</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1"
            aria-label="Close download"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Embedded iframe */}
        <div className="w-full aspect-video">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            title="Download Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            referrerPolicy="origin-when-cross-origin"
          />
        </div>

        {/* Footer with source info */}
        <div className="px-4 py-2 bg-gray-800 text-gray-400 text-sm text-center">
          Source: vidvault.ru
        </div>
      </div>
    </div>
  )
}

export default DownloadModal