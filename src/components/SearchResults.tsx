import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Film, Star, Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { tmdb, fetchMultiplePages } from '../services/tmdb';
import Fuse from 'fuse.js';
import { Movie, TVShow } from '../types';
import GlobalNavbar from './GlobalNavbar';
import MobileSearchResults from './SearchResultsMobile';
import * as useIsMobile from '../hooks/useIsMobile';
import { translations } from '../data/i18n';
import { useLanguage } from "./LanguageContext";

type MediaItem = (Movie | TVShow) & { media_type: 'movie' | 'tv'; popularity: number };

const fuseOptions: Fuse.IFuseOptions<MediaItem> = {
  keys: [
    { name: 'title', weight: 0.9 },
    { name: 'name', weight: 0.9 },
    { name: 'original_title', weight: 0.7 },
    { name: 'original_name', weight: 0.7 },
    { name: 'overview', weight: 0.1 }
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 1,
  includeScore: true,
  findAllMatches: true,
  useExtendedSearch: true,
  includeMatches: true,
};

const preprocessQuery = (query: string): string =>
  query.toLowerCase().trim()
    .replace(/[^\w\s\-'.:]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b&\b/g, 'and');

// Banned keywords list... (omitted for brevity)

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialSort = (searchParams.get('sort') as 'popularity' | 'score') || 'popularity';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'score' | 'popularity'>(initialSort);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warningVisible, setWarningVisible] = useState(false);

  // Pagination states
  const [apiPage, setApiPage] = useState(1);
  const [totalPagesFromApi, setTotalPagesFromApi] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 18;
  const startIdx = (currentPage - 1) * resultsPerPage;
  const paginatedResults = results.slice(startIdx, startIdx + resultsPerPage);

  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const isMobile = useIsMobile.useIsMobile();
  const activeFetchId = useRef(0);

  // Effect to sync search input with URL params and handle debouncing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmedSearchInput = searchInput.trim();
      const newParams = new URLSearchParams();
      if (trimmedSearchInput) {
        newParams.set('q', trimmedSearchInput);
      }
      newParams.set('sort', sortBy);
      setSearchParams(newParams);
      setQuery(trimmedSearchInput);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchInput, sortBy, setSearchParams]);

  // Main effect to fetch results when the query changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      setError(null);
      setApiPage(1);
      setTotalPagesFromApi(1);
      setCurrentPage(1);
      return;
    }

    // Assign a unique ID to each fetch to prevent race conditions
    const fetchId = ++activeFetchId.current;
    setLoading(true);
    setError(null);

    const fetchInitialResults = async () => {
      try {
        const processed = preprocessQuery(query);
        const [movieResults, tvResults] = await Promise.all([
          fetchMultiplePages('/search/movie', { query: processed }, 1, 10), // Changed to 10 pages
          fetchMultiplePages('/search/tv', { query: processed }, 1, 10), // Changed to 10 pages
        ]);

        if (fetchId !== activeFetchId.current) return;

        const combinedResults: MediaItem[] = [
          ...movieResults.results.map(m => ({ ...m, media_type: 'movie', popularity: m.popularity || 0 })),
          ...tvResults.results.map(t => ({ ...t, media_type: 'tv', popularity: t.popularity || 0 })),
        ];

        const filteredResults = combinedResults.filter(item => item.poster_path);
        const fuse = new Fuse(filteredResults, fuseOptions);
        const fuseResults = fuse.search(query);

        const sortedResults = fuseResults
          .map(({ item, score }) => ({ ...item, score }))
          .sort((a, b) => {
            if (sortBy === 'popularity') {
              return (b.popularity - a.popularity) || (a.score! - b.score!);
            }
            return (a.score! - b.score!) || (b.popularity - a.popularity);
          });

        if (fetchId !== activeFetchId.current) return;
        setResults(sortedResults);
        setApiPage(Math.max(movieResults.nextPage, tvResults.nextPage));
        setTotalPagesFromApi(Math.max(movieResults.totalPages, tvResults.totalPages));
        setCurrentPage(1);
        setLoading(false);

      } catch (err) {
        if (fetchId !== activeFetchId.current) return;
        console.error("API Fetch Error:", err);
        setError(t.search_fail);
        setLoading(false);
      }
    };

    fetchInitialResults();
  }, [query, sortBy, t]);

  const loadMoreResults = async () => {
    if (loading || apiPage > totalPagesFromApi) return;
    
    setLoading(true);
    const fetchId = activeFetchId.current;

    try {
      const processed = preprocessQuery(query);
      const [movieResults, tvResults] = await Promise.all([
        fetchMultiplePages('/search/movie', { query: processed }, apiPage, 10), // Changed to 10 pages
        fetchMultiplePages('/search/tv', { query: processed }, apiPage, 10), // Changed to 10 pages
      ]);
      
      if (fetchId !== activeFetchId.current) return;

      const newResults: MediaItem[] = [
        ...movieResults.results.map(m => ({ ...m, media_type: 'movie', popularity: m.popularity || 0 })),
        ...tvResults.results.map(t => ({ ...t, media_type: 'tv', popularity: t.popularity || 0 })),
      ];

      const newFilteredResults = newResults.filter(item => item.poster_path);
      
      const combined = [...results, ...newFilteredResults];
      const fuse = new Fuse(combined, fuseOptions);
      const fuseResults = fuse.search(query);

      const sortedResults = fuseResults
        .map(({ item, score }) => ({ ...item, score }))
        .sort((a, b) => {
          if (sortBy === 'popularity') {
            return (b.popularity - a.popularity) || (a.score! - b.score!);
          }
          return (a.score! - b.score!) || (b.popularity - a.popularity);
        });

      if (fetchId !== activeFetchId.current) return;
      setResults(sortedResults);
      setApiPage(Math.max(movieResults.nextPage, tvResults.nextPage));
      setTotalPagesFromApi(Math.max(movieResults.totalPages, tvResults.totalPages));
    } catch (err) {
      if (fetchId !== activeFetchId.current) return;
      console.error(err);
      setError(t.search_fail);
    } finally {
      if (fetchId !== activeFetchId.current) return;
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'popularity' | 'score');
  };

  const isMovie = (item: MediaItem): item is Movie & { media_type: 'movie' } => item.media_type === 'movie';
  const getTitle = (item: MediaItem) => isMovie(item) ? item.title : (item as TVShow).name;
  const getDate = (item: MediaItem) => isMovie(item) ? item.release_date : (item as TVShow).first_air_date;
  const getLink = (item: MediaItem) => isMovie(item) ? `/movie/${item.id}` : `/tv/${item.id}`;

  const hasMore = apiPage <= totalPagesFromApi;
  const totalLocalPages = Math.ceil(results.length / resultsPerPage);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
        <GlobalNavbar />
        {/* Mobile Search/Sort UI */}
        <div className="backdrop-blur-md sticky top-16 z-40 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-0">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder={t.search_placeholder}
                  value={searchInput}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 h-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl border border-pink-200/50 dark:border-gray-600/30 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {t.search_results_for} "<span className="font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{query}</span>" — {results.length} {results.length === 1 ? t.result : t.results}
              </p>
              <select
                aria-label={t.filter_sort_label}
                value={sortBy}
                onChange={handleSortChange}
                className="text-sm rounded-md border border-pink-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="popularity">{t.filter_popularity}</option>
                <option value="score">{t.filter_relevance}</option>
              </select>
            </div>
          </div>
        </div>
        <MobileSearchResults
          query={query}
          results={results}
          loading={loading}
          error={error}
          warningVisible={warningVisible}
          setWarningVisible={setWarningVisible}
          sortBy={sortBy}
          setSortBy={setSortBy}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          resultsPerPage={resultsPerPage}
          getTitle={getTitle}
          getDate={getDate}
          getLink={getLink}
          t={t}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      <GlobalNavbar />
      <div className="backdrop-blur-md sticky top-16 z-40 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-0">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder={t.search_placeholder}
                value={searchInput}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 h-12 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-l-xl border border-pink-200/50 dark:border-gray-600/30 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
              />
            </div>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="h-12 px-6 rounded-r-xl border border-l-0 border-pink-200/50 dark:border-gray-600/30 bg-white/95 dark:bg-gray-800/95 text-gray-900 dark:text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 appearance-none"
              style={{ paddingRight: '1.5rem' }}
            >
              <option value="popularity">{t.filter_popularity}</option>
              <option value="score">{t.filter_relevance}</option>
            </select>
          </div>
        </div>
      </div>

      {warningVisible && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center px-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-lg w-full text-center">
            <h2 className="text-3xl font-bold mb-4 text-pink-600 dark:text-pink-400">Haiii!</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              {t.search_stay_safe_warning}
            </p>
            <button
              onClick={() => setWarningVisible(false)}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg focus:ring-4 focus:ring-pink-400"
            >
              {t.search_stay_safe_continue}
            </button>
          </div>
        </div>
      )}

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${warningVisible ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.search_results_for} "<span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{query}</span>"
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{results.length} {results.length === 1 ? t.result : t.results}</p>
          {loading && <p className="text-gray-600 dark:text-gray-400">{t.search_loading}</p>}
          {error && <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>}
        </div>

        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {paginatedResults.map((item) => (
              <Link
                to={getLink(item)}
                key={`${item.media_type}-${item.id}`}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-[1.04] transition-transform duration-300 relative"
                aria-label={`${getTitle(item)} (${getDate(item)?.slice(0, 4) || 'N/A'})`}
              >
                <div className="aspect-[2/3] w-full relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-t-lg">
                  {item.poster_path ? (
                    <img
                      loading="lazy"
                      src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                      alt={getTitle(item)}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 text-xs uppercase font-semibold">
                      No Poster
                    </div>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate" title={getTitle(item)}>
                    {getTitle(item)}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-600 dark:text-gray-300 font-semibold">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {getDate(item) ? getDate(item).slice(0, 4) : 'N/A'}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-3.5 h-3.5 mr-1 text-yellow-500" />
                      {item.vote_average.toFixed(1)}
                    </span>
                    <span className="flex items-center">
                      <Film className="w-3.5 h-3.5 mr-1" />
                      {item.media_type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center justify-center mt-8 space-y-4">
          <nav aria-label={t.pagination_label} className="flex flex-wrap justify-center gap-2">
            {/* Go to First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <ChevronsLeft />
            </button>
            {/* Go to Previous Page */}
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <ChevronLeft />
            </button>
            {/* Render clickable page numbers */}
            {(() => {
              const pagesToShow = 7;
              let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
              let endPage = Math.min(totalLocalPages, startPage + pagesToShow - 1);

              // Adjust startPage if we're at the end
              if (endPage - startPage + 1 < pagesToShow) {
                startPage = Math.max(1, endPage - pagesToShow + 1);
              }

              const pageNumbers = [];
              for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    aria-current={currentPage === i ? 'page' : undefined}
                    className={`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                      currentPage === i
                        ? 'bg-pink-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-pink-100 dark:hover:bg-pink-900'
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              return pageNumbers;
            })()}
            {/* Go to Next Page */}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalLocalPages))}
              disabled={currentPage === totalLocalPages}
              className="px-4 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <ChevronRight />
            </button>
            {/* Go to Last Page */}
            <button
              onClick={() => setCurrentPage(totalLocalPages)}
              disabled={currentPage === totalLocalPages}
              className="px-4 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <ChevronsRight />
            </button>
          </nav>
          
          {hasMore && (
            <button
              onClick={loadMoreResults}
              disabled={loading}
              className="px-6 py-3 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More Results'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;