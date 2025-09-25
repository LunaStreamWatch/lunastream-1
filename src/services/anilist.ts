// Enhanced AniList service with comprehensive functionality
const ANILIST_API_URL = 'https://graphql.anilist.co';

// Simple cache with TTL to avoid rate limits
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const memoryCache = new Map<string, { ts: number; data: any }>();
const lsKey = (k: string) => `anilist-cache:${k}`;

function readCache(key: string): any | null {
  const now = Date.now();
  const mem = memoryCache.get(key);
  if (mem && now - mem.ts < CACHE_TTL_MS) return mem.data;
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(lsKey(key)) : null;
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (now - parsed.ts < CACHE_TTL_MS) {
        memoryCache.set(key, { ts: parsed.ts, data: parsed.data });
        return parsed.data;
      }
    } catch {}
  }
  return null;
}

function writeCache(key: string, data: any) {
  const entry = { ts: Date.now(), data };
  memoryCache.set(key, entry);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(lsKey(key), JSON.stringify(entry));
    }
  } catch {}
}

export interface AnimeTitle {
  romaji: string;
  english: string | null;
  native: string;
}

export interface AnimeStudio {
  id: number;
  name: string;
}

export interface AnimeGenre {
  id: number;
  name: string;
}

export interface AnimeCharacter {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: {
    large: string;
    medium: string;
  };
}

export interface AnimeVoiceActor {
  id: number;
  name: {
    full: string;
    native: string;
  };
  image: {
    large: string;
    medium: string;
  };
  language: string;
}

export interface AnimeCharacterEdge {
  role: string;
  node: AnimeCharacter;
  voiceActors: AnimeVoiceActor[];
}

export interface AnimeRelation {
  id: number;
  title: AnimeTitle;
  format: string;
  type: string;
  status: string;
  coverImage: {
    large: string;
    medium: string;
  };
}

export interface AnimeRecommendation {
  id: number;
  title: AnimeTitle;
  format: string;
  averageScore: number;
  coverImage: {
    large: string;
    medium: string;
  };
}

export interface Anime {
  id: number;
  title: AnimeTitle;
  description: string;
  format: string;
  status: string;
  episodes: number | null;
  duration: number | null;
  season: string | null;
  seasonYear: number | null;
  averageScore: number | null;
  popularity: number;
  genres: string[];
  studios: {
    nodes: AnimeStudio[];
  };
  coverImage: {
    large: string;
    medium: string;
    color: string;
  };
  bannerImage: string | null;
  startDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  endDate: {
    year: number | null;
    month: number | null;
    day: number | null;
  };
  source: string;
  characters: {
    edges: AnimeCharacterEdge[];
  };
  relations: {
    edges: Array<{
      relationType: string;
      node: AnimeRelation;
    }>;
  };
  recommendations: {
    nodes: Array<{
      mediaRecommendation: AnimeRecommendation;
    }>;
  };
}

export interface AnimeSearchResponse {
  data: {
    Page: {
      pageInfo: {
        total: number;
        currentPage: number;
        lastPage: number;
        hasNextPage: boolean;
        perPage: number;
      };
      media: Anime[];
    };
  };
}

export interface AnimeDetailsResponse {
  data: {
    Media: Anime;
  };
}

class AniListService {
  private async query(query: string, variables: any = {}): Promise<any> {
    try {
      const response = await fetch(ANILIST_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`AniList API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'AniList API error');
      }

      return data;
    } catch (error) {
      console.error('AniList query error:', error);
      throw error;
    }
  }

  async getTrendingAnime(page = 1, perPage = 20, format?: string): Promise<AnimeSearchResponse> {
    const cacheKey = `trending:${page}:${perPage}:${format || 'ALL'}`;
    const cached = readCache(cacheKey);
    if (cached) return cached as AnimeSearchResponse;

    const query = `
      query ($page: Int, $perPage: Int, $format: MediaFormat) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media(type: ANIME, sort: TRENDING_DESC, format: $format) {
            id
            title {
              romaji
              english
              native
            }
            format
            status
            episodes
            duration
            season
            seasonYear
            averageScore
            popularity
            genres
            coverImage {
              large
              medium
              color
            }
            bannerImage
            startDate {
              year
              month
              day
            }
            studios {
              nodes {
                id
                name
              }
            }
            source
          }
        }
      }
    `;

    const data = await this.query(query, { page, perPage, format });
    writeCache(cacheKey, data);
    return data;
  }

  async getPopularAnime(page = 1, perPage = 20, format?: string): Promise<AnimeSearchResponse> {
    const cacheKey = `popular:${page}:${perPage}:${format || 'ALL'}`;
    const cached = readCache(cacheKey);
    if (cached) return cached as AnimeSearchResponse;

    const query = `
      query ($page: Int, $perPage: Int, $format: MediaFormat) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media(type: ANIME, sort: POPULARITY_DESC, format: $format) {
            id
            title {
              romaji
              english
              native
            }
            format
            status
            episodes
            duration
            season
            seasonYear
            averageScore
            popularity
            genres
            coverImage {
              large
              medium
              color
            }
            bannerImage
            startDate {
              year
              month
              day
            }
            studios {
              nodes {
                id
                name
              }
            }
            source
          }
        }
      }
    `;

    const data = await this.query(query, { page, perPage, format });
    writeCache(cacheKey, data);
    return data;
  }
  async searchAnime(searchQuery: string, page = 1, perPage = 20): Promise<AnimeSearchResponse> {
    const query = `
      query ($search: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media(search: $search, type: ANIME, sort: [POPULARITY_DESC, SCORE_DESC]) {
            id
            title {
              romaji
              english
              native
            }
            format
            status
            episodes
            duration
            season
            seasonYear
            averageScore
            popularity
            genres
            coverImage {
              large
              medium
              color
            }
            bannerImage
            startDate {
              year
              month
              day
            }
            studios {
              nodes {
                id
                name
              }
            }
            source
          }
        }
      }
    `;

    return this.query(query, { search: searchQuery, page, perPage });
  }


  async getAnimeDetails(id: number): Promise<AnimeDetailsResponse> {
    const query = `
      query ($id: Int) {
        Media(id: $id, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          description
          format
          status
          episodes
          duration
          season
          seasonYear
          averageScore
          popularity
          genres
          studios {
            nodes {
              id
              name
            }
          }
          coverImage {
            large
            medium
            color
          }
          bannerImage
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          source
          characters(sort: [ROLE, RELEVANCE], perPage: 12) {
            edges {
              role
              node {
                id
                name {
                  full
                  native
                }
                image {
                  large
                  medium
                }
              }
              voiceActors(language: JAPANESE, sort: [RELEVANCE]) {
                id
                name {
                  full
                  native
                }
                image {
                  large
                  medium
                }
                language
              }
            }
          }
          relations {
            edges {
              relationType
              node {
                id
                title {
                  romaji
                  english
                  native
                }
                format
                type
                status
                coverImage {
                  large
                  medium
                }
              }
            }
          }
          recommendations(sort: [RATING_DESC], perPage: 6) {
            nodes {
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                  native
                }
                format
                averageScore
                coverImage {
                  large
                  medium
                }
              }
            }
          }
        }
      }
    `;

    return this.query(query, { id });
  }

  // Helper methods
  getDisplayTitle(anime: Anime | { title?: AnimeTitle } | null | undefined): string {
    if (!anime || !anime.title) return "Untitled";

    const { english, romaji, native } = anime.title;
    return english || romaji || native || "Untitled";
  }


  getYear(anime: Anime): string {
    if (anime.startDate?.year) {
      if (anime.endDate?.year && anime.endDate.year !== anime.startDate.year) {
        return `${anime.startDate.year}-${anime.endDate.year}`;
      }
      return anime.startDate.year.toString();
    }
    return anime.seasonYear?.toString() || 'Unknown';
  }

  formatDuration(duration: number | null): string {
    if (!duration) return 'Unknown';
    if (duration < 60) return `${duration}m`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  formatScore(score: number | null): string {
    return score ? (score / 10).toFixed(1) : 'N/A';
  }

  isMovie(anime: Anime): boolean {
    return anime.format === 'MOVIE';
  }

  isTVShow(anime: Anime): boolean {
    return ['TV', 'TV_SHORT', 'OVA', 'ONA'].includes(anime.format);
  }
}

export const anilist = new AniListService();