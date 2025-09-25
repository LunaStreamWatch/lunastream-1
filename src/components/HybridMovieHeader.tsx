"use client"

import React from "react"
import { Heart, Star } from "lucide-react"
import { tmdb } from "../services/tmdb"
import { useLanguage } from "./LanguageContext"
import { translations } from "../data/i18n"

interface HybridMovieHeaderProps {
  show: any // Replace with your actual type if available
  isFavorited: boolean
  onToggleFavorite: () => void
}

const HybridMovieHeader: React.FC<HybridMovieHeaderProps> = ({
  show,
  isFavorited,
  onToggleFavorite,
}) => {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={
            tmdb.getImageUrl(show.backdrop_path, "w1280") ||
            tmdb.getImageUrl(show.poster_path, "w1280")
          }
          alt={show.name}
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-4">
        {/* Poster */}
        <div className="flex-shrink-0">
          <div
            style={{
              backgroundImage: show.poster_path
                ? `url(${tmdb.getImageUrl(show.poster_path, "w500")})`
                : 'linear-gradient(to bottom, rgb(219 39 119), rgb(147 51 234))',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            className="w-48 h-64 md:w-64 md:h-96 rounded-xl shadow-2xl transition-transform hover:scale-105"
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 text-white">
          {/* Title and Favorite */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{show.title}</h1>
            </div>
            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-full transition-colors ${
                isFavorited
                  ? "text-pink-500 bg-pink-500/20"
                  : "hover:bg-pink-500/20 hover:text-pink-500"
              }`}
              aria-label={t.toggle_favorite || "Toggle Favorite"}
            >
              <Heart className="w-6 h-6" fill={isFavorited ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Meta info: rating, year, episodes count */}
          <div className="flex items-center space-x-4 mb-4 text-sm">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              <span>{show.vote_average?.toFixed(1)}</span>
            </div>
            <div className="text-gray-300">{show.first_air_date?.split("-")[0]}</div>
          </div>

          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{t.overview}</h3>
            <p className="text-gray-300 leading-relaxed">{show.overview}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HybridMovieHeader