"use client"

import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Play, X, ChevronLeft } from "lucide-react"
import { anilist, Anime } from "../services/anilist"
import { analytics } from "../services/analytics"
import { continueWatchingService } from "../services/continueWatching"
import GlobalNavbar from "./GlobalNavbar"
import { useLanguage } from "./LanguageContext"
import { translations } from "../data/i18n"
import Loading from "./Loading"
import { useIsMobile } from "../hooks/useIsMobile"
import HybridAnimeMovieHeader from "./HybridAnimeMovieHeader"

// ------------------ DISCORD WEBHOOK URL & FUNCTION ------------------
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1407868278398783579/zSYE2bkCULW7dIMllQ8RMODrPgFpk_V4cQFdQ55RK-BkSya-evn_QUxTRnOPmAz9Hreg"

/**
 * Send a Discord notification about someone watching an anime movie.
 * Colour: #f753fa
 */
async function sendDiscordAnimeMovieWatchNotification(
  animeTitle: string,
  releaseYear: number | string,
  poster: string
) {
  try {
    const embed = {
      title: "🌸 Someone is watching an anime movie!",
      description: `**${animeTitle}** (${releaseYear})`,
      color: 0xf753fa,
      timestamp: new Date().toISOString(),
      thumbnail: poster ? { url: poster } : undefined,
    }

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Watch Bot",
        avatar_url:
          "https://em-content.zobj.net/source/twitter/376/clapper-board_1f3ac.png",
        embeds: [embed],
      }),
    })
  } catch (err) {
    console.error("Could not send Discord notification:", err)
  }
}

// --------------------------------------------------------

const AnimeMovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isDub, setIsDub] = useState<boolean>(false)
  const { language } = useLanguage()
  const t = translations[language]
  const isMobile = useIsMobile()

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) return setLoading(true)
      try {
        const response = await anilist.getAnimeDetails(parseInt(id))
        const animeData = response.data.Media

        if (!anilist.isMovie(animeData)) {
          window.location.href = `/anime/tv/${id}`
          return
        }

        setAnime(animeData)
      } catch (error) {
        console.error("Failed to fetch anime:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnime()
  }, [id])

  useEffect(() => {
    if (anime) {
      const favorites = JSON.parse(localStorage.getItem("favoriteAnime") || "[]")
      setIsFavorited(favorites.some((fav: any) => fav.id === anime.id))
    }
  }, [anime])

  const toggleFavorite = () => {
    if (!anime) return
    const favorites = JSON.parse(localStorage.getItem("favoriteAnime") || "[]")
    const exists = favorites.some((fav: any) => fav.id === anime.id)
    const updatedFavorites = exists
      ? favorites.filter((fav: any) => fav.id !== anime.id)
      : [...favorites, anime]

    localStorage.setItem("favoriteAnime", JSON.stringify(updatedFavorites))
    setIsFavorited(!exists)
  }

  // Direct playback (no warning step)
  const handleWatchMovie = () => {
    if (!anime || !id) return

    // Add to continue watching
    continueWatchingService.addOrUpdateItem({
      type: 'anime',
      anilistId: anime.id,
      title: anilist.getDisplayTitle(anime),
      poster: anime.coverImage?.large || anime.coverImage?.medium || '',
      episode: 1,
      isDub: isDub,
      progress: 0
    });

    let poster =
      anime.coverImage?.medium || anime.coverImage?.large || ""
    let releaseYear =
      anime.startDate?.year || anime.startDate?.toString() || ""

    sendDiscordAnimeMovieWatchNotification(
      anilist.getDisplayTitle(anime),
      releaseYear,
      poster
    )

    const movieDuration = anime.duration
      ? anime.duration * 60
      : 120 * 60

    const newSessionId = analytics.startSession(
      "movie",
      parseInt(id),
      anilist.getDisplayTitle(anime),
      null,
      undefined,
      undefined,
      movieDuration
    )
    setSessionId(newSessionId)
    setIsPlaying(true)
  }

  const handleClosePlayer = () => {
    if (sessionId) {
      const finalTime = Math.random() * (anime?.duration ? anime.duration * 60 : 7200)
      analytics.endSession(sessionId, finalTime)
      setSessionId(null)
    }
    setIsPlaying(false)
  }

  if (loading) {
    return <Loading message="Loading anime movie details..." />
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Anime movie not found
          </h2>
          <Link
            to="/anime"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
          >
            Back to Anime
          </Link>
        </div>
      </div>
    )
  }

  if (isPlaying) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Close button */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={handleClosePlayer}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Close Player"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Language selector (only shows on hover) */}
        <div className="absolute top-6 left-6 z-10 group">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 backdrop-blur-sm rounded-lg shadow-xl p-2 w-28 text-center text-white">
            <div className="text-xs text-gray-300 mb-2">Audio</div>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setIsDub(false)}
                className={`px-3 py-1 rounded-md text-sm ${!isDub ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                Sub
              </button>
              <button
                onClick={() => setIsDub(true)}
                className={`px-3 py-1 rounded-md text-sm ${isDub ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                Dub
              </button>
            </div>
          </div>
        </div>


        {/* Player iframe */}
        <iframe
          src={getPlayerUrl("vidify", {
            anilistId: id!,
            mediaType: "anime",
            episodeNumber: 1,
            isDub: isDub
          })}
          className="fixed top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <GlobalNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            to="/anime"
            className="text-pink-600 dark:text-pink-400 hover:underline ml-1"
          >
            <ChevronLeft />
          </Link>
          <HybridAnimeMovieHeader
            anime={anime}
            isFavorited={isFavorited}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        {/* Watch Button */}
        <div className="mb-8">
          <button
            onClick={handleWatchMovie}
            className="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] hover:opacity-95 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5" />
            <span>Watch Movie</span>
          </button>
        </div>

        {/* Characters Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-200/50 dark:border-gray-700/50 overflow-hidden mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white px-8 pt-8 mb-4">
            Characters & Voice Actors
          </h2>
          <div className="flex flex-wrap gap-6 px-8 pb-8">
            {anime.characters.edges.length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300">
                No character information available.
              </p>
            ) : (
              anime.characters.edges.slice(0, 12).map((edge) => (
                <div key={edge.node.id} className="flex-shrink-0 w-28 text-center">
                  <img
                    src={edge.node.image.large || edge.node.image.medium}
                    alt={edge.node.name.full}
                    className="w-28 h-28 object-cover rounded-full shadow-md mb-2 border border-gray-300 dark:border-gray-600"
                  />
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {edge.node.name.full}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {edge.role}
                  </p>
                  {edge.voiceActors.length > 0 && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 truncate">
                      {edge.voiceActors[0].name.full}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimeMovieDetail