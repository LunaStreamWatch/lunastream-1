"use client"

import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Play, X, ChevronLeft } from "lucide-react"
import { getPlayerUrl } from "../utils/playerUtils"
import { anilist, Anime } from "../services/anilist"
import { analytics } from "../services/analytics"
import { continueWatchingService } from "../services/continueWatching"
import { watchStatsService } from "../services/watchStats"
import GlobalNavbar from "./GlobalNavbar"
import { useLanguage } from "./LanguageContext"
import { translations } from "../data/i18n"
import Loading from "./Loading"
import { useIsMobile } from "../hooks/useIsMobile"
import HybridAnimeMovieHeader from "./HybridAnimeMovieHeader"

const AnimeMovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isDub, setIsDub] = useState(false)
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [seasons, setSeasons] = useState<Anime[]>([])
  const [selectedSeason, setSelectedSeason] = useState(0)
  const [episodes, setEpisodes] = useState<{ id: number; episode_number: number; name: string }[]>([])
  const [currentEpisode, setCurrentEpisode] = useState(1)

  const { language } = useLanguage()
  const t = translations[language]
  const isMobile = useIsMobile()

  const currentAnime = selectedSeason === 0 ? anime : seasons[selectedSeason - 1]

  // Fetch anime and related seasons
  useEffect(() => {
    const fetchAnime = async () => {
      if (!id) return setLoading(true)
      setLoading(true)
      try {
        const response = await anilist.getAnimeDetails(parseInt(id))
        const animeData = response.data.Media

        if (!anilist.isMovie(animeData)) {
          window.location.href = `/anime/tv/${id}`
          return
        }

        setAnime(animeData)

        const relatedEdges = animeData.relations?.edges.filter(
          edge => edge.relationType === "SEQUEL" || edge.relationType === "PREQUEL"
        ) || []

        const relatedSeasons = await Promise.all(
          relatedEdges.map(edge =>
            anilist.getAnimeDetails(edge.node.id).then(res => res.data.Media)
          )
        )
        relatedSeasons.sort((a, b) => a.id - b.id)
        setSeasons(relatedSeasons)
      } catch (error) {
        console.error("Failed to fetch anime:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnime()
  }, [id])

  // Update trailer
  useEffect(() => {
    if (!currentAnime?.trailer || currentAnime.trailer.site !== "youtube" || !currentAnime.trailer.id) {
      setTrailerUrl(null)
      return
    }
    setTrailerUrl(`https://www.youtube.com/embed/${currentAnime.trailer.id}`)
  }, [currentAnime])

  // Update episodes when currentAnime changes
  useEffect(() => {
    if (!currentAnime) return
    if (anilist.isMovie(currentAnime)) {
      setEpisodes([])
    } else {
      const totalEpisodes = currentAnime.episodes || 0
      const eps = Array.from({ length: totalEpisodes }, (_, i) => ({
        id: i + 1,
        episode_number: i + 1,
        name: currentAnime.title.english ? `Ep ${i + 1} - ${currentAnime.title.english}` : `Episode ${i + 1}`,
      }))
      setEpisodes(eps)
      setCurrentEpisode(1)
    }
  }, [currentAnime])

  // Favorites
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

  // Watch handlers
  const handleWatchMovie = () => {
    if (!currentAnime) return
    continueWatchingService.addOrUpdateItem({
      type: 'anime',
      anilistId: currentAnime.id,
      title: anilist.getDisplayTitle(currentAnime),
      poster: currentAnime.coverImage?.large || currentAnime.coverImage?.medium || '',
      episode: 1,
      isDub,
      progress: 0
    })

    watchStatsService.recordWatch()
    const duration = currentAnime.duration ? currentAnime.duration * 60 : 120 * 60
    const newSessionId = analytics.startSession(
      "movie",
      currentAnime.id,
      anilist.getDisplayTitle(currentAnime),
      currentAnime.bannerImage || null,
      undefined,
      undefined,
      duration
    )
    setSessionId(newSessionId)
    document.body.classList.add('player-active')
    setIsPlaying(true)
  }

  const handleWatchEpisode = (episodeNumber: number) => {
    if (!currentAnime) return
    continueWatchingService.addOrUpdateItem({
      type: 'anime',
      anilistId: currentAnime.id,
      title: anilist.getDisplayTitle(currentAnime),
      poster: currentAnime.coverImage?.large || currentAnime.coverImage?.medium || '',
      episode: episodeNumber,
      isDub,
      progress: 0
    })
    setCurrentEpisode(episodeNumber)

    watchStatsService.recordWatch()
    const duration = currentAnime.duration ? currentAnime.duration * 60 : 24 * 60
    const newSessionId = analytics.startSession(
      "tv",
      currentAnime.id,
      anilist.getDisplayTitle(currentAnime),
      currentAnime.bannerImage || null,
      1,
      episodeNumber,
      duration
    )
    setSessionId(newSessionId)
    document.body.classList.add('player-active')
    setIsPlaying(true)
  }

  const handleClosePlayer = () => {
    if (sessionId) {
      const finalTime = Math.random() * (currentAnime?.duration ? currentAnime.duration * 60 : 7200)
      analytics.endSession(sessionId, finalTime)
      setSessionId(null)
    }
    document.body.classList.remove('player-active')
    setIsPlaying(false)
  }

  if (loading) return <Loading message="Loading anime details..." />

  if (!anime) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Anime movie not found</h2>
        <Link to="/anime" className="text-pink-600 hover:underline">Back to Anime</Link>
      </div>
    </div>
  )

  if (isPlaying) return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="absolute top-6 right-6 z-10">
        <button onClick={handleClosePlayer} className="text-white hover:text-gray-300"><X className="w-8 h-8" /></button>
      </div>
      <iframe
        src={getPlayerUrl("vidnest", { anilistId: currentAnime?.id.toString()!, mediaType: "anime", episodeNumber: currentAnime.episodes ? currentEpisode : 1, isDub })}
        className="fixed top-0 left-0 w-full h-full border-0"
        allowFullScreen
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <GlobalNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/anime" className="text-pink-600 dark:text-pink-400 hover:underline ml-1">
            <ChevronLeft />
          </Link>
          <HybridAnimeMovieHeader
            anime={currentAnime}
            isFavorited={isFavorited}
            onToggleFavorite={toggleFavorite}
            seasons={seasons}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
          />
        </div>

        {trailerUrl && (
          <button
            onClick={() => setShowTrailer(true)}
            disabled={!trailerUrl}
            className="w-full flex justify-center items-center space-x-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
          >
            <Play className="w-5 h-5" />
            <span>{t.action_watch_trailer || "Watch Trailer"}</span>
          </button>
        )}

        {/* Show episode list if not a movie */}
        {!anilist.isMovie(currentAnime) ? (
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-pink-200/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Episodes ({episodes.length})</h2>
            <div className={isMobile ? "space-y-2" : "space-y-3"}>
              {episodes.map(ep => (
                <div key={ep.id} className="flex justify-between items-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                  <span className="font-semibold text-gray-900 dark:text-white">{ep.name}</span>
                  <button
                    onClick={() => handleWatchEpisode(ep.episode_number)}
                    className="bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:opacity-95"
                  >
                    <Play className="w-5 h-5" />
                    <span>Watch</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={handleWatchMovie}
            className="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] hover:opacity-95 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Play className="w-5 h-5" />
            <span>Watch Movie</span>
          </button>
        )}
      </div>

      {showTrailer && trailerUrl && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button onClick={() => setShowTrailer(false)} className="absolute top-6 right-6 text-white hover:text-gray-300"><X className="w-8 h-8" /></button>
          <iframe
            src={trailerUrl}
            className="w-11/12 md:w-3/4 h-3/4 rounded-2xl border-0 shadow-2xl"
            allowFullScreen
            title={`${currentAnime?.title.english || currentAnime?.title.romaji || currentAnime?.title.native} Trailer`}
          />
        </div>
      )}
    </div>
  )
}

export default AnimeMovieDetail
