"use client"

import React from "react"
import { Heart, Star, Clock, Calendar, Users } from "lucide-react"
import { anilist, Anime } from "../services/anilist"
import { useLanguage } from "./LanguageContext"
import { translations } from "../data/i18n"

interface HybridAnimeMovieHeaderProps {
  anime: Anime
  isFavorited: boolean
  onToggleFavorite: () => void
}

const HybridAnimeMovieHeader: React.FC<HybridAnimeMovieHeaderProps> = ({
  anime,
  isFavorited,
  onToggleFavorite,
}) => {
  const { language } = useLanguage()
  const t = translations[language] || translations.en

  const displayTitle = anilist.getDisplayTitle(anime)
  const year = anilist.getYear(anime)
  const score = anilist.formatScore(anime.averageScore)
  const duration = anilist.formatDuration(anime.duration)

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={anime.bannerImage || anime.coverImage.large}
          alt={displayTitle}
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
              backgroundImage: anime.coverImage.large
                ? `url(${anime.coverImage.large})`
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
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{displayTitle}</h1>
              {anime.title.native && anime.title.native !== displayTitle && (
                <p className="text-lg text-gray-300 italic">
                  {anime.title.native}
                </p>
              )}
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

          {/* Meta info: rating, year, duration */}
          <div className="flex items-center space-x-4 mb-4 text-sm">
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              <span>{score}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{year}</span>
            </div>
            {anime.duration && (
              <div className="flex items-center text-gray-300">
                <Clock className="w-4 h-4 mr-1" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          {/* Studios */}
          {anime.studios.nodes.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center text-gray-300 text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span className="font-medium">Studio:</span>
                <span className="ml-2">{anime.studios.nodes.map(s => s.name).join(', ')}</span>
              </div>
            </div>
          )}

          {/* Source Material */}
          <div className="mb-4">
            <div className="flex items-center text-gray-300 text-sm">
              <span className="font-medium">Source:</span>
              <span className="ml-2">{anime.source || 'Unknown'}</span>
            </div>
          </div>

          {/* Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{t.overview}</h3>
            <p className="text-gray-300 leading-relaxed">
              {anime.description?.replace(/<[^>]*>/g, '') || t.no_description || 'No description available.'}
            </p>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {anime.genres.map(genre => (
              <span
                key={genre}
                className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HybridAnimeMovieHeader