"use client"

import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Play, Star, Calendar, Clock, Film, X, Heart, Eye, EyeOff, ChevronDown, Tv, Info, List, Grid2x2 as Grid, ChevronLeft } from "lucide-react"
import { tmdb } from "../services/tmdb"
import { analytics } from "../services/analytics"
import type { TVDetails, Episode } from "../types"
import { watchlistService } from "../services/watchlist"
import { continueWatchingService } from "../services/continueWatching"
import { watchStatsService } from "../services/watchStats"
import GlobalNavbar from "./GlobalNavbar"
import { playerConfigs, getPlayerUrl } from "../utils/playerUtils"
import { useLanguage } from "./LanguageContext"
import { translations } from "../data/i18n"
import Loading from "./Loading"
import { useIsMobile } from "../hooks/useIsMobile"
import HybridTVHeader from "./HybridTVHeader"
import EmbeddedFrame from "./player/EmbeddedFrame"


const TVDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [show, setShow] = useState<TVDetails | null>(null)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const [episodesLoading, setEpisodesLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [showDescriptions, setShowDescriptions] = useState<{ [key: number]: boolean }>({})
  const [recentlyViewedTV, setRecentlyViewedTV] = useState<any[]>([])
  const [recentlyViewedTVEpisodes, setRecentlyViewedTVEpisodes] = useState<{ [showId: number]: { show: any; episodes: any[] } }>({})
  const [recentlyViewedMovies, setRecentlyViewedMovies] = useState<any[]>([])
  const [isFavorited, setIsFavorited] = useState(false)
  const [cast, setCast] = React.useState([])
  const [seasonCast, setSeasonCast] = React.useState<any[]>([])
  const { language } = useLanguage()

  const isMobile = useIsMobile()

  const t = translations[language];

  useEffect(() => {
    async function fetchSeasonCredits() {
      if (!show?.id) return;
      if (!selectedSeason) {
        // No season selected, show default cast
        setSeasonCast([]);
        return;
      }
      try {
        const credits = await tmdb.getTVSeasonCredits(show.id, selectedSeason);
        setSeasonCast(credits.cast || []);
      } catch (error) {
        console.error("Failed to fetch season credits:", error);
        setSeasonCast([]);
      }
    }
    fetchSeasonCredits();
  }, [show?.id, selectedSeason]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (show) {
        const isFav = await watchlistService.isShowInFavorites(show.id)
        setIsFavorited(isFav)
      }
    }
    checkFavorite()
  }, [show])

  const toggleFavorite = async () => {
    if (!show) return
    if (isFavorited) {
      await watchlistService.removeShowFromFavorites(show.id)
      setIsFavorited(false)
    } else {
      await watchlistService.addShowToFavorites({
        id: show.id,
        name: show.name,
        poster_path: show.poster_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
      })
      setIsFavorited(true)
    }
  }

  useEffect(() => {
    async function fetchCredits() {
      setLoading(true)
      const credits = await tmdb.getTVCredits(show.id)
      setCast(credits.cast || [])
      setLoading(false)
    }

    if (show?.id) {
      fetchCredits()
    }
  }, [show?.id])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recentlyViewedTVEpisodes") || "{}")
    const data2 = JSON.parse(localStorage.getItem("recentlyViewedMovies") || "[]")
    setRecentlyViewedTVEpisodes(data)
    setRecentlyViewedMovies(data2)
  }, [])

  const clearRecentlyViewed = () => {
    localStorage.removeItem("recentlyViewedTVEpisodes")
    setRecentlyViewedTVEpisodes({})
    localStorage.removeItem("recentlyViewedMovies")
    setRecentlyViewedMovies([])
  }

  useEffect(() => {
    const fetchShow = async () => {
      if (!id) return
      
      const showId = Number.parseInt(id);
      
      setLoading(true)
      try {
        const showData = await tmdb.getTVDetails(showId)
        setShow(showData)
        if (showData.seasons && showData.seasons.length > 0) {
          const firstSeason = showData.seasons.find((s: any) => s.season_number > 0) || showData.seasons[0]
          setSelectedSeason(firstSeason.season_number)
        }
      } catch (error) {
        console.error("Failed to fetch TV show:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchShow()
  }, [id])

  useEffect(() => {
    const fetchEpisodesAndRating = async () => {
      if (!id || selectedSeason === 0) return
      setEpisodesLoading(true)
      try {
        const seasonData = await tmdb.getTVSeasons(Number.parseInt(id), selectedSeason)
        setEpisodes(seasonData.episodes || [])
      } catch (error) {
        console.error("Failed to fetch episodes or season details:", error)
      } finally {
        setEpisodesLoading(false)
      }
    }

    fetchEpisodesAndRating()
  }, [id, selectedSeason])

  useEffect(() => {
    if (show) {
      const existing = JSON.parse(localStorage.getItem("recentlyViewedTV") || "[]")
      const filtered = existing.filter((item: any) => item.id !== show.id)
      const updated = [
        {
          id: show.id,
          name: show.name,
          poster_path: show.poster_path,
          first_air_date: show.first_air_date,
        },
        ...filtered,
      ]
      localStorage.setItem("recentlyViewedTV", JSON.stringify(updated.slice(0, 5)))
      setRecentlyViewedTV(updated.slice(0, 5))
    }
  }, [show])

  // -------------- UPDATED: Send Discord notification on watch -------------
  const handleWatchEpisode = (episode: Episode) => {
    if (show && id) {
      // Add to continue watching
      continueWatchingService.addOrUpdateItem({
        type: 'tv',
        tmdbId: show.id,
        title: show.name,
        poster: tmdb.getImageUrl(show.poster_path, 'w500') || '',
        season: episode.season_number,
        episode: episode.episode_number,
        episodeTitle: episode.name,
        progress: 0
      });

      watchlistService.addShowToWatchlist({
        id: show.id,
        name: show.name,
        poster_path: show.poster_path,
        first_air_date: show.first_air_date,
        vote_average: show.vote_average,
      });

      const existing = JSON.parse(localStorage.getItem("recentlyViewedTVEpisodes") || "{}")

      const currentShowGroup = existing[show.id] || {
        show: {
          id: show.id,
          name: show.name,
          poster_path: show.poster_path,
          first_air_date: show.first_air_date,
        },
        episodes: [],
      }

      currentShowGroup.episodes = currentShowGroup.episodes.filter(
        (ep: any) => !(ep.season_number === episode.season_number && ep.episode_number === episode.episode_number),
      )

      currentShowGroup.episodes.unshift({
        id: episode.id,
        name: episode.name,
        season_number: episode.season_number,
        episode_number: episode.episode_number,
        air_date: episode.air_date,
      })

      currentShowGroup.episodes = currentShowGroup.episodes.slice(0, 5)

      const updated = {
        ...existing,
        [show.id]: currentShowGroup,
      }

      localStorage.setItem("recentlyViewedTVEpisodes", JSON.stringify(updated))
      setRecentlyViewedTVEpisodes(updated)

      watchStatsService.recordWatch()

      const episodeDuration =
        show.episode_run_time && show.episode_run_time.length > 0 ? show.episode_run_time[0] * 60 : 45 * 60

      const newSessionId = analytics.startSession(
        "tv",
        Number.parseInt(id),
        show.name,
        show.poster_path,
        episode.season_number,
        episode.episode_number,
        episodeDuration,
      )
      setSessionId(newSessionId)
      document.body.classList.add('player-active')
      setCurrentEpisode(episode)
      setIsPlaying(true)
    }
  }

  const handleClosePlayer = () => {
    if (sessionId) {
      const episodeDuration =
        show?.episode_run_time && show.episode_run_time.length > 0 ? show.episode_run_time[0] * 60 : 45 * 60
      const finalTime = Math.random() * episodeDuration
      analytics.endSession(sessionId, finalTime)
      setSessionId(null)
    }
    document.body.classList.remove('player-active')
    setIsPlaying(false)
    setCurrentEpisode(null)
  }

  useEffect(() => {
    if (isPlaying && sessionId && show) {
      const interval = setInterval(() => {
        const episodeDuration =
          show.episode_run_time && show.episode_run_time.length > 0 ? show.episode_run_time[0] * 60 : 45 * 60
        const currentTime = Math.random() * episodeDuration
        const additionalData: any = {}
        if (Math.random() > 0.95) additionalData.pauseEvents = 1
        if (Math.random() > 0.98) additionalData.seekEvents = 1
        if (Math.random() > 0.99) additionalData.bufferingEvents = 1
        if (Math.random() > 0.9) additionalData.isFullscreen = Math.random() > 0.5
        analytics.updateSession(sessionId, currentTime, additionalData)
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [isPlaying, sessionId, show])

  const toggleDescription = (episodeId: number) => {
    setShowDescriptions((prev) => ({
      ...prev,
      [episodeId]: !prev[episodeId],
    }))
  }

  const formatAirDate = (dateString: string) => {
    if (!dateString) return "TBA"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return <Loading message={t.status_loading_show_details || 'Loading show details...'} />
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            {t.tv_not_found || 'Show not found'}
          </h2>
          <Link
            to="/"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
          >
            {t.error_404_go_home}
          </Link>
        </div>
      </div>
    )
  }

  if (isPlaying && currentEpisode) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Close button */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={handleClosePlayer}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label={translations[language].close_player || "Close Player"}
          >
            <X className="w-8 h-8" />
          </button>
        </div>


        {/* Player iframe */}
        <EmbeddedFrame
          src={getPlayerUrl(localStorage.getItem("player") || "vidify", {
            tmdbId: id!,
            mediaType: "tv",
            seasonNumber: currentEpisode.season_number,
            episodeNumber: currentEpisode.episode_number
          })}
          className="fixed top-0 left-0 w-full h-full border-0"
          title={`${show.name} - S${currentEpisode.season_number}E${currentEpisode.episode_number}`}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <GlobalNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mobile-spacing">
        {/* Hybrid TV Header */}
        <div className="mb-8">
          <Link
            to={`/`}
            className="text-pink-600 dark:text-pink-400 hover:underline ml-1"
          >
            <ChevronLeft />
          </Link>
          <HybridTVHeader
            show={show}
            selectedSeason={selectedSeason}
            onSeasonChange={setSelectedSeason}
            isFavorited={isFavorited}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        {/* Cast Overview */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mobile-card rounded-2xl shadow-xl border border-purple-200/50 dark:border-gray-700/50 overflow-hidden mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white px-8 pt-8 mb-4">{t.cast_overview || 'Cast Overview'}</h2>
          <div className="flex flex-wrap gap-6 px-8 pb-8">
            {loading ? (
              <p className="text-gray-700 dark:text-gray-300">{t.status_loading_cast || 'Loading cast...'}</p>
            ) : ((seasonCast.length > 0 ? seasonCast : cast).length === 0 ? (
              <p className="text-gray-700 dark:text-gray-300">{t.status_no_cast_info || 'No cast information available.'}</p>
            ) : (
              (seasonCast.length > 0 ? seasonCast : cast).slice(0, 12).map((actor: any) => (
                <Link key={actor.id} to={`/person/${actor.id}`} className="flex-shrink-0 w-28 text-center group cursor-pointer">
                  <img
                    src={
                      actor.profile_path
                        ? tmdb.getImageUrl(actor.profile_path, "w185")
                        : "/unknown.png"
                    }
                    alt={actor.name}
                    className="w-28 h-28 object-cover rounded-full shadow-md mb-2 border border-gray-300 dark:border-gray-600 group-hover:border-pink-400 transition-colors"
                  />
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{actor.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{actor.character}</p>
                </Link>
              ))
            ))}
          </div>
        </div>

        {/* Comments Section removed */}

        {/* Season Selector & Episodes */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mobile-card rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 p-4 sm:p-6 transition-colors duration-300 mt-8">
          {/* Adjust layout for mobile */}
          <div className={`flex items-center justify-between mb-6 ${isMobile ? "flex-col space-y-4" : ""}`}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              {t.episodes || 'Episodes'}
            </h2>
            <div className={`flex items-center space-x-3 ${isMobile ? "w-full justify-center" : ""}`}>
              {/* Season View Button */}
              <Link
                to={`/tv/${id}/season/${selectedSeason}`}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-colors flex items-center space-x-2 shadow-lg"
              >
                <List className="w-4 h-4" />
                <span>{isMobile ? 'Season' : 'View Season'}</span>
              </Link>

            {/* Season Selector */}
            {show?.seasons && show.seasons.length > 0 && (
                <div className="relative group">
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="pr-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl border border-pink-200/50 dark:border-gray-600/30 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 appearance-none py-2 px-4 cursor-pointer font-semibold"
                  >
                    {show.seasons
                      .filter((season: any) => season.season_number > 0)
                      .map((season: any) => (
                        <option key={season.id} value={season.season_number}>
                          {t.season} {season.season_number}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none transition-transform duration-200 group-hover:rotate-180" />
                </div>
              )}
            </div>
          </div>

          {/* Episodes List */}
          {episodesLoading ? (
            <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-spin flex items-center justify-center mx-auto mb-4">
                <Tv className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                {t.status_loading_episodes || 'Loading episodes...'}
              </p>
            </div>
          ) : (
            <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  className={`group bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 border border-pink-200/50 dark:border-gray-600/50 overflow-hidden hover:shadow-lg transition-all duration-300 ${isMobile ? 'rounded-lg' : 'rounded-xl'}`}
                >
                  <div className={isMobile ? 'p-3' : 'p-4'}>
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {episode.episode_number}
                          </span>
                          <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'} text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors`}>
                            {episode.name}
                          </h3>
                        </div>
                        <div className={`flex items-center space-x-2 ${isMobile ? 'flex-col' : ''}`}>
                          <Link
                            to={`/tv/${id}/season/${episode.season_number}/episode/${episode.episode_number}`}
                            className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                            title="View Episode Details"
                          >
                            <Grid className="w-5 h-5" />
                          </Link>
                          {episode.overview && (
                            <button
                              onClick={() => toggleDescription(episode.id)}
                              className="text-gray-500 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors p-1"
                              title={t.show_episode_info || 'Show episode info'}
                            >
                              <Info className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleWatchEpisode(episode)}
                            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-colors flex items-center space-x-2"
                            title={t.action_watch || 'Watch'}
                          >
                            <Play className="w-4 h-4" />
                            <span>{t.action_watch || 'Watch'}</span>
                          </button>
                        </div>
                      </div>
                      {showDescriptions[episode.id] && (
                        <div className="mt-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-pink-200/30 dark:border-gray-600/30 transition-colors duration-300">
                          {episode.air_date && (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="font-medium">{t.episode_aired || 'Aired'}</span>
                              <span className="ml-1">{formatAirDate(episode.air_date)}</span>
                            </div>
                          )}
                          {episode.overview && (
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                              {episode.overview}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TVDetail