"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Star } from "lucide-react";
import { tmdb } from "../services/tmdb";
import { filterBannedContent } from "../utils/banList";
import { useLanguage } from "./LanguageContext";
import { translations } from "../data/i18n";
import type { Movie, TVShow } from "../types";
import GlobalNavbar from "./GlobalNavbar";

type MediaItem = (Movie | TVShow) & { media_type: "movie" | "tv" };
const isMovie = (item: MediaItem): item is Movie => "title" in item;

const MediaCard: React.FC<{ item: MediaItem; t: any }> = React.memo(({ item, t }) => (
  <Link to={`/${item.media_type}/${item.id}`} className="flex-shrink-0 w-28">
    {item.poster_path ? (
      <img
        src={`https://image.tmdb.org/t/p/w154${item.poster_path}`}
        alt={isMovie(item) ? item.title : item.name}
        className="w-full h-40 object-cover rounded-lg shadow"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500 dark:text-gray-300">
        {t.no_poster || "No Poster"}
      </div>
    )}
    <p className="mt-1 text-xs text-gray-900 dark:text-gray-100 truncate">
      {isMovie(item) ? item.title : item.name}
    </p>
    <div className="flex items-center text-xs text-gray-700 dark:text-gray-300 mt-0.5">
      <Star className="w-3 h-3 text-yellow-400 mr-1" />
      {item.vote_average?.toFixed(1) || "N/A"}
    </div>
  </Link>
));

const HomepageMobile: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MediaItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingTV, setTrendingTV] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useMemo(() => translations[language] || translations.en, [language]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [moviesWeek, tvWeek] = await Promise.all([
        tmdb.getTrendingMovies(),
        tmdb.getTrendingTV(),
      ]);

      setTrendingMovies(
        filterBannedContent(moviesWeek.results ?? []).map(item => ({ ...item, media_type: "movie" }))
      );
      setTrendingTV(
        filterBannedContent(tvWeek.results ?? []).map(item => ({ ...item, media_type: "tv" }))
      );
    } catch (error) {
      console.error("Failed to fetch trending data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const results = await tmdb.searchMulti(query);
        setSuggestions(
          filterBannedContent(results.results ?? [])
            .filter(item => item.media_type === "movie" || item.media_type === "tv")
            .slice(0, 5)
            .map(item => ({ ...item, media_type: item.media_type as "movie" | "tv" }))
        );
      } catch (err) {
        console.error("Search suggestions failed", err);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  const onSearch = (q?: string) => {
    const searchQuery = q || query;
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const renderTrendingSection = (title: string, items: MediaItem[]) => (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="flex-shrink-0 w-28 h-40 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))
          : items.map((item) => <MediaCard key={item.id} item={item} t={t} />)}
      </div>
    </section>
  );

  return (
    <>
      <GlobalNavbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-5 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder={t.search_placeholder}
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-white dark:bg-gray-800 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label={t.search_placeholder}
          />
          <Search className="absolute top-3.5 left-3 w-5 h-5 text-gray-500 dark:text-gray-400" />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/${item.media_type}/${item.id}`)}
                >
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                      alt={isMovie(item) ? item.title : item.name}
                      className="w-10 h-14 object-cover rounded mr-3"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-gray-300 dark:bg-gray-700 rounded mr-3 flex items-center justify-center text-xs text-gray-500 dark:text-gray-300">
                      N/A
                    </div>
                  )}
                  <div className="truncate text-gray-900 dark:text-gray-100">
                    {isMovie(item) ? item.title : item.name}
                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">({item.media_type})</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Page Heading */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] bg-clip-text text-transparent">
          {t.home_heading_title}
        </h1>
        <p className="text-center text-gray-900 dark:text-gray-200">{t.home_heading_subtitle}</p>

        {/* Trending Movies */}
        {renderTrendingSection(`${t.content_trending} ${t.content_movie_plural}`, trendingMovies)}

        {/* Trending TV */}
        {renderTrendingSection(`${t.content_trending} ${t.content_tv_plural}`, trendingTV)}
      </div>
    </>
  );
};

export default HomepageMobile;