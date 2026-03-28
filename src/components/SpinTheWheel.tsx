"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { X } from "lucide-react"
import { tmdb } from "../services/tmdb"

interface SpinTheWheelProps {
  isOpen: boolean
  onClose: () => void
  showId: number
  onWatchEpisode: (seasonNumber: number, episodeNumber: number) => void
}

interface SeasonOption {
  season_number: number
  name: string
  episode_count: number
}

interface EpisodeOption {
  episode_number: number
  name: string
}

type SpinPhase = "seasons" | "episodes" | "result" | null

// Rainbow colors for the wheel
const WHEEL_COLORS = [
  "#FF6B6B", // Red
  "#FFE66D", // Yellow
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Light Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Mint
]

const SpinTheWheel: React.FC<SpinTheWheelProps> = ({
  isOpen,
  onClose,
  showId,
  onWatchEpisode,
}) => {
  const [seasons, setSeasons] = useState<SeasonOption[]>([])
  const [episodes, setEpisodes] = useState<EpisodeOption[]>([])
  const [phase, setPhase] = useState<SpinPhase>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null)
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wheelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setIsLoaded(true)
      if (!seasons.length) {
        fetchSeasons()
      }
    } else {
      setTimeout(() => {
        setIsLoaded(false)
        setPhase(null)
        setSelectedSeason(null)
        setSelectedEpisode(null)
        setCurrentRotation(0)
      }, 300)
    }
  }, [isOpen])

  const fetchSeasons = async () => {
    try {
      const data = await tmdb.getTVDetails(showId)
      if (data.seasons) {
        const filteredSeasons = data.seasons
          .filter((s: any) => s.season_number > 0 && s.episode_count > 0)
          .sort((a: any, b: any) => a.season_number - b.season_number)
          .map((s: any) => ({
            season_number: s.season_number,
            name: s.name || `Season ${s.season_number}`,
            episode_count: s.episode_count,
          }))
        setSeasons(filteredSeasons)
      }
    } catch (error) {
      console.error("Failed to fetch seasons:", error)
    }
  }

  const fetchEpisodes = async (seasonNumber: number) => {
    try {
      const data = await tmdb.getTVSeasons(showId, seasonNumber)
      if (data.episodes) {
        const episodeList = data.episodes
          .sort((a: any, b: any) => a.episode_number - b.episode_number)
          .map((e: any) => ({
            episode_number: e.episode_number,
            name: e.name || `Episode ${e.episode_number}`,
          }))
        setEpisodes(episodeList)
      }
    } catch (error) {
      console.error("Failed to fetch episodes:", error)
    }
  }

  // Draw the wheel on canvas
  const drawWheel = useCallback((items: string[], rotation: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10
    const itemCount = items.length
    const sliceAngle = (2 * Math.PI) / itemCount

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw each slice
    items.forEach((item, index) => {
      const startAngle = index * sliceAngle - Math.PI / 2 + rotation
      const endAngle = startAngle + sliceAngle

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = WHEEL_COLORS[index % WHEEL_COLORS.length]
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + sliceAngle / 2)
      ctx.textAlign = "right"
      ctx.fillStyle = "#333"
      ctx.font = "bold 16px Arial"
      ctx.fillText(item, radius - 20, 5)
      ctx.restore()
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 25, 0, 2 * Math.PI)
    ctx.fillStyle = "#fff"
    ctx.fill()
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw inner circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#FF6B6B")
    gradient.addColorStop(0.5, "#4ECDC4")
    gradient.addColorStop(1, "#45B7D1")
    ctx.fillStyle = gradient
    ctx.fill()
  }, [])

  // Update wheel when items or rotation changes
  useEffect(() => {
    if (!isLoaded) return

    const items = phase === "seasons" 
      ? seasons.map(s => `S${s.season_number}`)
      : phase === "episodes"
      ? episodes.map(e => `E${e.episode_number}`)
      : []

    if (items.length > 0) {
      drawWheel(items, currentRotation)
    }
  }, [isLoaded, phase, seasons, episodes, currentRotation, drawWheel])

  const startSpin = () => {
    const items = phase === "seasons" 
      ? seasons 
      : phase === "episodes"
      ? episodes
      : []

    if (items.length === 0) return

    setIsSpinning(true)

    // Determine random selection
    const randomIndex = Math.floor(Math.random() * items.length)
    const selectedItem = items[randomIndex]
    const itemAngle = 360 / items.length

    // Calculate target angle
    // The pointer is at the top (270 degrees or -90 degrees)
    // We need to rotate so the selected item is at the top
    const targetRotation = 360 * 5 + (270 - (randomIndex * itemAngle + itemAngle / 2))

    // Add current rotation to get total rotation
    const totalRotation = currentRotation + targetRotation

    // Animate
    const duration = 4000
    const startTime = Date.now()
    const startRotation = currentRotation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3)
      
      const newRotation = startRotation + (totalRotation - startRotation) * eased
      setCurrentRotation(newRotation)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        // Set final rotation to exact position
        setCurrentRotation(totalRotation % 360)

        if (phase === "seasons") {
          const season = seasons[randomIndex]
          setSelectedSeason(season.season_number)
          fetchEpisodes(season.season_number)
          setPhase("episodes")
        } else if (phase === "episodes") {
          setSelectedEpisode(episodes[randomIndex].episode_number)
          setPhase("result")
        }
      }
    }

    requestAnimationFrame(animate)
  }

  const handleWatch = () => {
    if (selectedSeason && selectedEpisode) {
      onWatchEpisode(selectedSeason, selectedEpisode)
      onClose()
    }
  }

  const reset = () => {
    setPhase("seasons")
    setSelectedSeason(null)
    setSelectedEpisode(null)
    setCurrentRotation(0)
    setIsSpinning(false)
  }

  if (!isOpen) return null

  const items = phase === "seasons" 
    ? seasons.map(s => `S${s.season_number}`)
    : phase === "episodes"
    ? episodes.map(e => `E${e.episode_number}`)
    : []

  return (
    <div 
      className={`fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="relative w-full max-w-lg bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 rounded-2xl shadow-2xl border border-pink-200/50 dark:border-gray-700/50 overflow-hidden transform scale-100">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600">
          <div className="flex items-center space-x-2 text-white">
            <span className="text-2xl">🎰</span>
            <span className="font-semibold text-xl">Spin the Wheel</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!phase && (
            <div className="text-center py-8">
              <p className="text-gray-700 dark:text-gray-200 text-lg mb-8">
                Feeling lucky? Let the wheel decide for you!
              </p>
              <button
                onClick={() => setPhase("seasons")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:opacity-95 transition-opacity shadow-lg"
              >
                Start Spin
              </button>
            </div>
          )}

          {(phase === "seasons" || phase === "episodes") && (
            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-200 text-lg font-medium mb-4">
                {phase === "seasons" 
                  ? "🎯 Pick a Season" 
                  : `Season ${selectedSeason} - Pick an Episode`}
              </p>

              {/* Wheel Container */}
              <div className="relative mb-6">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                  <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[35px] border-t-red-500 drop-shadow-xl" />
                </div>

                {/* Wheel Canvas */}
                <div className="flex justify-center">
                  <canvas
                    ref={canvasRef}
                    width={300}
                    height={300}
                    className="rounded-full shadow-2xl border-4 border-gray-800"
                  />
                </div>

                {/* Center decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border-4 border-gray-800 z-10" />
              </div>

              <button
                onClick={startSpin}
                disabled={isSpinning || items.length === 0}
                className={`bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-12 py-4 rounded-xl font-bold text-xl hover:opacity-95 transition-all shadow-lg transform hover:scale-105 ${
                  isSpinning || items.length === 0 ? "opacity-50 cursor-not-allowed transform-none" : ""
                }`}
              >
                {isSpinning ? "🎲 Spinning..." : "🎰 SPIN!"}
              </button>
            </div>
          )}

          {phase === "result" && (
            <div className="text-center py-8">
              <div className="mb-8 p-8 bg-white/60 dark:bg-gray-800/60 rounded-2xl border-4 border-pink-400">
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">🎉 Your random pick:</p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  Season {selectedSeason}, Episode {selectedEpisode}
                </p>
              </div>
              
              <button
                onClick={handleWatch}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:opacity-95 transition-opacity w-full mb-4 shadow-lg"
              >
                ▶ Watch Now
              </button>
              
              <button
                onClick={reset}
                className="text-pink-500 dark:text-pink-400 hover:text-purple-500 transition-colors text-base font-medium"
              >
                ↻ Spin Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SpinTheWheel