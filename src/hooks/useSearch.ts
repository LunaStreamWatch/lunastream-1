import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { tmdb } from '../services/tmdb';
import { Movie, TVShow } from '../types';

export type SearchResult = (Movie | TVShow) & { 
  media_type: 'movie' | 'tv'; 
  popularity: number;
};

export interface UseSearchOptions {
  debounceMs?: number;
  maxSuggestions?: number;
  minQueryLength?: number;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  suggestions: SearchResult[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    maxSuggestions = 6,
    minQueryLength = 2
  } = options;

  const [, setLocation] = useLocation();
  const debounceRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    suggestions: [],
    loading: false,
    error: null,
    hasSearched: false
  });

  // Cleanup function
  const cleanup = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Search function
  const performSearch = useCallback(async (
    searchQuery: string, 
    isSuggestion = false,
    signal?: AbortSignal
  ): Promise<SearchResult[]> => {
    if (!searchQuery.trim() || searchQuery.trim().length < minQueryLength) {
      return [];
    }

    try {
      const [moviesResponse, tvResponse] = await Promise.all([
        tmdb.searchMovies(searchQuery.trim()),
        tmdb.searchTV(searchQuery.trim())
      ]);

      if (signal?.aborted) return [];

      const movieResults: SearchResult[] = (moviesResponse?.results || []).map((movie: any) => ({
        ...movie,
        media_type: 'movie' as const,
        popularity: movie.popularity || 0
      }));

      const tvResults: SearchResult[] = (tvResponse?.results || []).map((show: any) => ({
        ...show,
        media_type: 'tv' as const,
        popularity: show.popularity || 0
      }));

      const combined = [...movieResults, ...tvResults]
        .sort((a, b) => b.popularity - a.popularity);

      return isSuggestion ? combined.slice(0, maxSuggestions) : combined;
    } catch (error: any) {
      if (error.name === 'AbortError') return [];
      console.error('Search error:', error);
      throw error;
    }
  }, [minQueryLength, maxSuggestions]);

  // Update query and trigger live search for suggestions
  const setQuery = useCallback((newQuery: string) => {
    setState(prev => ({ ...prev, query: newQuery }));

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Clear suggestions if query is too short
    if (newQuery.trim().length < minQueryLength) {
      setState(prev => ({ ...prev, suggestions: [], error: null }));
      return;
    }

    // Debounced live search for suggestions
    debounceRef.current = setTimeout(async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        const suggestions = await performSearch(newQuery, true, signal);
        if (!signal.aborted) {
          setState(prev => ({ ...prev, suggestions, error: null }));
        }
      } catch (error: any) {
        if (!signal.aborted) {
          setState(prev => ({ 
            ...prev, 
            suggestions: [], 
            error: 'Failed to load suggestions' 
          }));
        }
      }
    }, debounceMs);
  }, [debounceMs, minQueryLength, performSearch]);

  // Execute full search (for search page or form submission)
  const executeSearch = useCallback(async (searchQuery?: string) => {
    const queryToSearch = searchQuery || state.query;
    
    if (!queryToSearch.trim()) return;

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      suggestions: [],
      hasSearched: true 
    }));

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const results = await performSearch(queryToSearch, false, signal);
      if (!signal.aborted) {
        setState(prev => ({ 
          ...prev, 
          results, 
          loading: false, 
          query: queryToSearch,
          error: null 
        }));
      }
    } catch (error: any) {
      if (!signal.aborted) {
        setState(prev => ({ 
          ...prev, 
          results: [], 
          loading: false,
          error: 'Search failed. Please try again.' 
        }));
      }
    }
  }, [state.query, performSearch]);

  // Navigate to search page
  const navigateToSearch = useCallback((searchQuery?: string) => {
    const queryToUse = searchQuery || state.query;
    if (queryToUse.trim()) {
      const params = new URLSearchParams();
      params.set('q', queryToUse.trim());
      setLocation(`/search?${params.toString()}`);
    }
  }, [state.query, setLocation]);

  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setState(prev => ({ ...prev, suggestions: [] }));
  }, []);

  // Reset search state
  const resetSearch = useCallback(() => {
    cleanup();
    setState({
      query: '',
      results: [],
      suggestions: [],
      loading: false,
      error: null,
      hasSearched: false
    });
  }, [cleanup]);

  // Initialize query from URL params
  const initializeFromUrl = useCallback((urlQuery: string) => {
    if (urlQuery && urlQuery !== state.query) {
      setState(prev => ({ ...prev, query: urlQuery }));
      executeSearch(urlQuery);
    }
  }, [state.query, executeSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    // State
    ...state,
    
    // Actions
    setQuery,
    executeSearch,
    navigateToSearch,
    clearSuggestions,
    resetSearch,
    initializeFromUrl
  };
}
