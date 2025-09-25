"use client"

import React, { useState, useEffect } from "react"
import { Star, Heart, ChevronDown } from "lucide-react"
import { tmdb } from "../services/tmdb"
import type { TVDetails } from "../types"
import { useLanguage } from "./LanguageContext"
import { translations } from "../data/i18n"

interface HybridTVHeaderProps {
  show: TVDetails
  selectedSeason: number
  onSeasonChange: (season: number) => void
  isFavorited: boolean
  onToggleFavorite: () => void
}

const HybridTVHeader: React.FC<HybridTVHeaderProps> = ({
  show,
  selectedSeason,
  onSeasonChange,
  isFavorited,
  onToggleFavorite,
}) => {
  const [seasonDetails, setSeasonDetails] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const { language } = useLanguage()
  const t = translations[language]

  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".season-dropdown")) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (selectedSeason === 0) return

      setLoading(true)
      try {
        const seasonData = await tmdb.getTVSeasons(show.id, selectedSeason)
        setSeasonDetails(seasonData)
      } catch (error) {
        console.error("Failed to fetch season details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeasonDetails()
  }, [show.id, selectedSeason])

  const getDisplayData = () => {
    const formatYearRange = (startDate: string, endDate?: string) => {
      if (!startDate) return ""
      const startYear = new Date(startDate).getFullYear()
      const endYear = endDate ? new Date(endDate).getFullYear() : startYear
      return startYear === endYear ? `${startYear}` : `${startYear}-${endYear}`
    }

    if (selectedSeason === 0 || !seasonDetails) {
      return {
        title: show.name,
        overview: show.overview,
        poster: show.poster_path,
        backdrop: show.backdrop_path,
        year: formatYearRange(show.first_air_date, show.last_air_date),
        rating: show.vote_average,
        genres: show.genres,
        episodeCount: show.number_of_episodes,
        seasonCount: show.number_of_seasons,
        type: "show",
      }
    }

    const seasonEpisodes = seasonDetails.episodes || []
    const firstEpisode = seasonEpisodes[0]?.air_date
    const lastEpisode = seasonEpisodes[seasonEpisodes.length - 1]?.air_date || firstEpisode

    return {
      title: `${show.name} - ${t.season} ${selectedSeason}`,
      overview: seasonDetails.overview || show.overview,
      poster: seasonDetails.poster_path || show.poster_path,
      backdrop: seasonEpisodes[0]?.still_path || show.backdrop_path,
      year: formatYearRange(firstEpisode, lastEpisode),
      rating: show.vote_average,
      genres: show.genres,
      episodeCount: seasonEpisodes.length,
      seasonCount: show.number_of_seasons,
      type: "season",
    }
  }

  const displayData = getDisplayData()
  const availableSeasons = show.seasons.filter((s) => s.season_number > 0)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={
            tmdb.getImageUrl(displayData.backdrop, "w1280") ||
            tmdb.getImageUrl(displayData.poster, "w1280")
          }
          alt={displayData.title}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div
                style={{
                  backgroundImage: displayData.poster
                    ? `url(${tmdb.getImageUrl(displayData.poster, "w500")})`
                    : "linear-gradient(to bottom, rgb(219 39 119), rgb(147 51 234))",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                className="w-48 h-72 md:w-64 md:h-96 rounded-xl shadow-2xl transition-transform group-hover:scale-105"
              />
              {displayData.type === "season" && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {t.season} {selectedSeason}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Title and Favorite */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {displayData.title}
                </h1>
                {displayData.type === "season" && (
                  <p className="text-lg text-gray-300">{show.name}</p>
                )}
              </div>
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorited
                    ? "text-pink-500 bg-pink-500/20"
                    : "text-white hover:text-pink-500 hover:bg-pink-500/20"
                }`}
              >
                <Heart className="w-6 h-6" fill={isFavorited ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Meta Info */}
            <div className="flex items-center space-x-4 mb-4 text-sm">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                <span className="text-white">{displayData.rating.toFixed(1)}</span>
              </div>
              <div className="text-gray-300">{displayData.year}</div>
              <div className="text-gray-300">
                {displayData.episodeCount} {t.episodes}
              </div>
            </div>

            {/* Season Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t.select_season}
              </label>
              <div className="relative w-full md:w-64 season-dropdown">
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white text-left focus:outline-none focus:ring-2 focus:ring-pink-500 flex justify-between items-center"
                >
                  <span>
                    {selectedSeason === 0 ? "Show Overview" : `${t.season} ${selectedSeason}`}
                  </span>
                  <ChevronDown className="w-4 h-4 text-white opacity-70" />
                </button>

                {dropdownOpen && (
                  <ul className="absolute z-20 mt-2 w-full bg-gray-900/95 border border-white/20 backdrop-blur-md rounded-lg shadow-xl max-h-80 overflow-y-auto">
                    <li
                      onClick={() => {
                        onSeasonChange(0)
                        setDropdownOpen(false)
                      }}
                      className={`px-4 py-2 text-white hover:bg-pink-500/20 cursor-pointer ${
                        selectedSeason === 0 ? "bg-white/10" : ""
                      }`}
                    >
                      Show Overview
                    </li>
                    {availableSeasons.map((season) => (
                      <li
                        key={season.id}
                        onClick={() => {
                          onSeasonChange(season.season_number)
                          setDropdownOpen(false)
                        }}
                        className={`px-4 py-2 text-white hover:bg-pink-500/20 cursor-pointer ${
                          selectedSeason === season.season_number ? "bg-white/10" : ""
                        }`}
                      >
                        {t.season} {season.season_number}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Overview */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {displayData.type === "season"
                  ? `${t.season} ${selectedSeason} ${t.overview}`
                  : t.overview}
              </h3>
              <p className="text-gray-300 leading-relaxed">{displayData.overview}</p>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {displayData.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HybridTVHeader
