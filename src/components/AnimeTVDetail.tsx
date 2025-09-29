"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { Play, X, ChevronLeft } from "lucide-react"
import { getPlayerUrl } from "../utils/playerUtils"
import { anilist, Anime } from "../services/anilist"
import { analytics } from "../services/analytics"
import { continueWatchingService } from "../services/continueWatching"
import GlobalNavbar from "./GlobalNavbar"
import { useLanguage } from "./LanguageContext"
import { translations } from "../data/i18n"
import Loading from "./Loading"
import { useIsMobile } from "../hooks/useIsMobile"
import HybridAnimeTVHeader from "./HybridAnimeTVHeader"

// ------------------ DISCORD WEBHOOK URL & FUNCTION ------------------
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1407868278398783579/zSYE2bkCULW7dIMllQ8RMODrPgFpk_V4cQFdQ55RK-BkSya-evn_QUxTRnOPmAz9Hreg"
/**
 * Send a Discord notification about someone watching an anime episode.
 * Colour: #02d9da
 */
async function sendDiscordAnimeTVWatchNotification(
  showTitle: string,
  episodeNumber: number,
  poster: string
) {
  try {
    const embed = {
      title: "✨ Someone is watching anime!",
      description: `**${showTitle}**\nEpisode ${episodeNumber}`,
      color: 0x02d9da,
      timestamp: new Date().toISOString(),
      thumbnail: poster ? { url: poster } : undefined,
    }
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Watch Bot",
        avatar_url: "https://em-content.zobj.net/source/twitter/376/clapper-board_1f3ac.png",
        embeds: [embed],
      }),
    })
  } catch (err) {
    console.error("Could not send Discord notification:", err)
  }
}
// --------------------------------------------------------

const AnimeTVDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState<number>(1)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState(0)
  const [isDub, setIsDub] = useState<boolean>(false)
  const [episodes, setEpisodes] = useState<{ id: number; episode_number: number; name: string }[]>([])
  const [seasonData, setSeasonData] = useState<Anime[]>([])

  const seasons = useMemo(() => {
    return anime?.relations?.edges
      .filter(edge => edge.relationType === "SEQUEL" || edge.relationType === "PREQUEL")
      .map(edge => edge.node) || []
  }, [anime])

  const { language } = useLanguage()
  const t = translations[language]
  const isMobile = useIsMobile()

  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) return
      setLoading(true)
      try {
        const response = await anilist.getAnimeDetails(parseInt(id))
        const animeData = response.data.Media
        if (anilist.isMovie(animeData)) {
          window.location.href = `/anime/movie/${id}`
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
    const fetchSeasonDetails = async () => {
      if (seasons.length > 0) {
        const seasonDetails = await Promise.all(
          seasons.map(season => anilist.getAnimeDetails(season.id).then(res => res.data.Media))
        )
        setSeasonData(seasonDetails)
      }
    }
    fetchSeasonDetails()
  }, [seasons])

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

  const generateEpisodes = (seasonIndex: number, animeData: any, seasonsDetails: any[]) => {
    let targetAnime = seasonIndex === 0 ? animeData : seasonsDetails[seasonIndex - 1]
    if (!targetAnime) return []

    const totalEpisodes = targetAnime.episodes || 0
    return Array.from({ length: totalEpisodes }, (_, i) => ({
      id: i + 1,
      episode_number: i + 1,
      name: targetAnime.title.english
        ? `Ep ${i + 1} - ${targetAnime.title.english}`
        : `Episode ${i + 1}`,
    }))
  }

  useEffect(() => {
    if (anime) {
      const eps = generateEpisodes(selectedSeason, anime, seasonData)
      setEpisodes(eps)
    }
  }, [anime, selectedSeason, seasonData])

  const handleWatchEpisode = (episodeNumber: number) => {
    if (!anime || !id) return

    // Pick correct anime depending on season
    let currentAnime = anime
    if (selectedSeason > 0 && seasonData[selectedSeason - 1]) {
      currentAnime = seasonData[selectedSeason - 1]
    }

    // Save to continue watching
    if (currentAnime) {
      continueWatchingService.addOrUpdateItem({
        type: 'anime',
        anilistId: currentAnime.id,
        title: anilist.getDisplayTitle(currentAnime),
        poster: currentAnime.coverImage?.large || currentAnime.coverImage?.medium || '',
        episode: episodeNumber,
        isDub: isDub,
        progress: 0
      });
    }

    setCurrentEpisode(episodeNumber)

    if (!currentAnime) return

    let poster = currentAnime.coverImage?.medium || currentAnime.coverImage?.large || ""
    sendDiscordAnimeTVWatchNotification(
      anilist.getDisplayTitle(currentAnime),
      episodeNumber,
      poster
    )

    const episodeDuration = currentAnime.duration ? currentAnime.duration * 60 : 24 * 60
    const newSessionId = analytics.startSession(
      "tv",
      currentAnime.id,
      anilist.getDisplayTitle(currentAnime),
      poster,
      1,
      episodeNumber,
      episodeDuration
    )
    setSessionId(newSessionId)
    setIsPlaying(true)
  }

  const handleClosePlayer = () => {
    if (sessionId) {
      const episodeDuration = anime?.duration ? anime.duration * 60 : 24 * 60
      const finalTime = Math.random() * episodeDuration
      analytics.endSession(sessionId, finalTime)
      setSessionId(null)
    }
    setIsPlaying(false)
    setCurrentEpisode(1)
  }

  if (loading) {
    return <Loading message="Loading anime details..." />
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Anime not found
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

  const currentAnime = selectedSeason === 0 ? anime : seasonData[selectedSeason - 1]

  if (isPlaying) {
    return (
      <div className="fixed inset-0 bg-black z-50">
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

        <iframe
          src={getPlayerUrl("vidify", {
            anilistId: currentAnime?.id.toString() || id!,
            mediaType: "anime",
            episodeNumber: currentEpisode,
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
          <HybridAnimeTVHeader
            anime={anime}
            isFavorited={isFavorited}
            onToggleFavorite={toggleFavorite}
            seasons={seasons}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
          />
        </div>
        {/* Episodes Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 p-6 transition-colors duration-300">
          <div className={`flex items-center justify-between mb-6 ${isMobile ? "flex-col space-y-4" : ""}`}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              Episodes ({currentAnime?.episodes || 0})
            </h2>
            {seasons.length > 0 && (
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="rounded-md border p-2 bg-gray-900 text-white"
              >
                <option value={0}>{anime.title.english || anime.title.romaji || anime.title.native}</option>
                {seasons.map((season, index) => (
                  <option key={season.id} value={index + 1}>
                    {season.title.english || season.title.romaji || season.title.native}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className={`group bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 
                  border border-pink-200/50 dark:border-gray-600/50 overflow-hidden hover:shadow-lg 
                  transition-all duration-300 ${isMobile ? 'rounded-lg' : 'rounded-xl'}`}
              >
                <div className={isMobile ? 'p-3' : 'p-4'}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white px-3 py-1 
                                     rounded-full text-sm font-semibold">
                        {episode.episode_number}
                      </span>
                      <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'} text-gray-900 dark:text-white 
                                     group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors`}>
                        {episode.name}
                      </h3>
                    </div>
                    <div className={`flex items-center space-x-2 ${isMobile ? 'flex-col' : ''}`}>
                      <button
                        onClick={() => handleWatchEpisode(episode.episode_number)}
                        className="bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white px-3 py-1 rounded-lg 
                                 font-semibold hover:opacity-95 transition-colors 
                                 flex items-center space-x-2"
                        title="Watch Episode"
                      >
                        <Play className="w-4 h-4" />
                        <span>Watch</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimeTVDetail
