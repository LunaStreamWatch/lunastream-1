import { filterBannedSearchResults, filterBannedContent } from '../utils/banList';

const API_KEY = '762f9abeaf5a0a96795dee0bb3989df9';
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdb = {
  searchMovies: async (query: string) => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return filterBannedSearchResults(data);
  },

  searchTV: async (query: string) => {
    const response = await fetch(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return filterBannedSearchResults(data);
  },

  getTrendingMovies: async () => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    const data = await response.json();
    return {
      ...data,
      results: filterBannedContent(data.results || [])
    };
  },

  getTrendingTV: async () => {
    const response = await fetch(
      `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`
    );
    const data = await response.json();
    return {
      ...data,
      results: filterBannedContent(data.results || [])
    };
  },

  getMovieDetails: async (id: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
    );
    return response.json();
  },

  getTVDetails: async (id: number) => {
    const response = await fetch(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}`
    );
    return response.json();
  },

  getTVSeasons: async (id: number, seasonNumber: number) => {
    const response = await fetch(
      `${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`
    );
    return response.json();
  },

  getTVCredits: async (id: number) => {
    const response = await fetch(
      `${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`
    );
    return response.json();
  },

  getMovieCredits: async (id: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
    );
    return response.json();
  },

  getTVSeasonCredits: async (tvId: number, seasonNumber: number) => {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}/season/${seasonNumber}/credits?api_key=${API_KEY}`
    );
    return response.json();
  },

  getTVEpisodeCredits: async (tvId: number, seasonNumber: number, episodeNumber: number) => {
    const response = await fetch(
      `${BASE_URL}/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/credits?api_key=${API_KEY}`
    );
    return response.json();
  },


  discoverMovies: async (params: string) => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&${params}`);
    const data = await response.json();
    return {
      ...data,
      results: filterBannedContent(data.results || [])
    };
  },

  discoverTV: async (params: string) => {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&${params}`);
    const data = await response.json();
    return {
      ...data,
      results: filterBannedContent(data.results || [])
    };
  },

  searchMulti: async (query: string) => {
    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return filterBannedSearchResults(data);
  },

  getImageUrl: (path: string | null, size: string = 'w500') => {
    if (!path)
      return 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  getPersonGender: async (id: number) => {
    const response = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}`);
    const data = await response.json();

    switch (data.gender) {
      case 1:
        return 'female';
      case 2:
        return 'male';
      default:
        return 'unknown';
    }
  },

  getPersonDetails: async (id: number) => {
    const response = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}`);
    return response.json();
  }
};

export async function fetchMultiplePages(
  endpoint,
  params = {},
  startPage = 1,
  pagesToFetch = 10
) {
  const results = [];
  // Fetch total pages info from first page
  const firstResponse = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&${new URLSearchParams({ ...params, page: '1' })}`);
  const firstData = await firstResponse.json();
  const totalPagesAvailable = firstData.total_pages || 1;

  let currentPage = startPage;
  for (let i = 0; i < pagesToFetch && currentPage <= totalPagesAvailable; i++, currentPage++) {
    const response = await fetch(
      `${BASE_URL}${endpoint}?api_key=${API_KEY}&${new URLSearchParams({ ...params, page: currentPage.toString() })}`
    );
    const data = await response.json();
    if (data.results) {
      results.push(...data.results);
    }
  }

  return {
    results,
    nextPage: currentPage, // page after last fetched
    totalPages: totalPagesAvailable,
  };
}
