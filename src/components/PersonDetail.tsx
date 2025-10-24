"use client"

import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ChevronLeft, Calendar, Star, Film, Tv, ChevronDown, ChevronUp, PersonStanding } from "lucide-react"
import { tmdb } from "../services/tmdb"
import { useLanguage } from "./LanguageContext"
import { translations } from "../data/i18n"
import Loading from "./Loading"
import GlobalNavbar from "./GlobalNavbar"

interface PersonDetails {
  id: number
  gender: number
  name: string
  biography: string
  birthday?: string
  deathday?: string
  place_of_birth?: string
  profile_path?: string
  known_for_department?: string
  popularity?: number
}

interface PersonCredits {
  cast: Array<{
    id: number
    title?: string
    name?: string
    character?: string
    release_date?: string
    first_air_date?: string
    media_type: 'movie' | 'tv'
    poster_path?: string
  }>
}

const PersonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [person, setPerson] = useState<PersonDetails | null>(null)
  const [credits, setCredits] = useState<PersonCredits | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAllFilmography, setShowAllFilmography] = useState(false)
  const { language } = useLanguage()
  const t = translations[language] || translations.en

  useEffect(() => {
    const fetchPersonData = async () => {
      if (!id) return
      const personId = parseInt(id)

      setLoading(true)
      try {
        const [personData, creditsData] = await Promise.all([
          tmdb.getPersonDetails(personId),
          tmdb.getPersonCredits(personId)
        ])

        setPerson(personData)
        setCredits(creditsData)
      } catch (error) {
        console.error("Failed to fetch person data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPersonData()
  }, [id])

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).getFullYear().toString()
  }

  const getAge = (birthday?: string, deathday?: string): string => {
    if (!birthday) return ''
    const birth = new Date(birthday)
    const end = deathday ? new Date(deathday) : new Date()
    const age = end.getFullYear() - birth.getFullYear()
    return deathday ? ` (${age})` : ` (${age} years old)`
  }

  const getGender = (gender?: string | number): string => {
    switch (gender) {
      case 1:
      case '1':
        return 'Female'
      case 2:
      case '2':
        return 'Male'
      default:
        return 'Unknown'
    }
  }


  if (loading) {
    return <Loading message="Loading person details..." />
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Person not found
          </h2>
          <Link
            to="/"
            className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300"
          >
            Go back home
          </Link>
        </div>
      </div>
    )
  }

  const profileImage = person.profile_path
    ? tmdb.getImageUrl(person.profile_path, "w500")
    : "/unknown.png"

  const sortedCredits = credits?.cast
    .filter(item => item.release_date || item.first_air_date)
    .sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || '')
      const dateB = new Date(b.release_date || b.first_air_date || '')
      return dateB.getTime() - dateA.getTime()
    }) || []

  // Sort credits by popularity for "Known For" section
  const knownForCredits = credits?.cast
    .filter(item => item.release_date || item.first_air_date)
    .sort((a, b) => {
      // Try to sort by some popularity metric, fallback to recency
      // For now, we'll sort by release date (most recent first) as a proxy for popularity
      const dateA = new Date(a.release_date || a.first_air_date || '')
      const dateB = new Date(b.release_date || b.first_air_date || '')
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 6) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <GlobalNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="text-pink-600 dark:text-pink-400 hover:underline ml-1 flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <img
                src={profileImage}
                alt={person.name}
                className="w-full max-w-sm mx-auto rounded-xl shadow-2xl border border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Person Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {person.name}
              </h1>

              <div className="flex items-center space-y-3 space-x-2 text-gray-700 dark:text-gray-300">
                <PersonStanding className="w-4 h-4" />
                <span>Gender: {getGender(person.gender)}</span>
              </div>


              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                {person.birthday ? (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Born: {new Date(person.birthday).toLocaleDateString()}
                      {person.place_of_birth && ` in ${person.place_of_birth}`}
                      {getAge(person.birthday, person.deathday)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" /> <span>Birthday unknown</span>
                  </div>
                )}


                {person.deathday && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Died: {new Date(person.deathday).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {person.known_for_department && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Known for: {person.known_for_department}</span>
                  </div>
                )}

              </div>
            </div>

            {/* Known For */}
            {person.known_for_department && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Known For
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {knownForCredits.map((item) => {
                    const title = item.title || item.name || 'Unknown'
                    const releaseDate = item.release_date || item.first_air_date
                    const year = releaseDate ? formatDate(releaseDate) : 'Unknown'

                    return (
                      <Link
                        key={`${item.id}-${item.media_type}`}
                        to={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex-shrink-0">
                          {item.media_type === 'movie' ? (
                            <Film className="w-5 h-5 text-pink-500" />
                          ) : (
                            <Tv className="w-5 h-5 text-purple-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                            {title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {year} • {item.character && `as ${item.character}`}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Biography */}
            {person.biography && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Biography
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {person.biography}
                </p>
              </div>
            )}

            {/* Filmography */}
            {sortedCredits.length > 0 && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Filmography
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {sortedCredits.slice(0, showAllFilmography ? sortedCredits.length : 50).map((item) => {
                    const title = item.title || item.name || 'Unknown'
                    const releaseDate = item.release_date || item.first_air_date
                    const year = releaseDate ? formatDate(releaseDate) : 'Unknown'

                    return (
                      <Link
                        key={`${item.id}-${item.media_type}`}
                        to={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="flex-shrink-0">
                          {item.media_type === 'movie' ? (
                            <Film className="w-5 h-5 text-pink-500" />
                          ) : (
                            <Tv className="w-5 h-5 text-purple-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                            {title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {year} • {item.character && `as ${item.character}`}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>

                {sortedCredits.length > 50 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setShowAllFilmography(!showAllFilmography)}
                      className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
                    >
                      <span>{showAllFilmography ? 'Show Less' : `Show All ${sortedCredits.length} Credits`}</span>
                      {showAllFilmography ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonDetail