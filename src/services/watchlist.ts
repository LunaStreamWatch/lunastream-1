export interface WatchlistMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  addedAt: number;
}

export interface WatchlistTVShow {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  addedAt: number;
}

export interface FavoriteItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  addedAt: number;
}

class WatchlistService {
  private MOVIES_KEY = 'watchlistMovies';
  private SHOWS_KEY = 'watchlistShows';
  private FAV_MOVIES_KEY = 'favoriteMovies';
  private FAV_SHOWS_KEY = 'favoriteShows';

  async getWatchlistMovies(): Promise<WatchlistMovie[]> {
    const stored = localStorage.getItem(this.MOVIES_KEY);
    const items: any[] = stored ? JSON.parse(stored) : [];
    return items.map((m) => ({
      ...m,
      addedAt: m.addedAt ?? Date.now(),
    }));
  }

  async addMovieToWatchlist(movie: Omit<WatchlistMovie, 'addedAt'>): Promise<void> {
    const items = await this.getWatchlistMovies();
    const filtered = items.filter(i => i.id !== movie.id);
    const updated = [{ ...movie, addedAt: Date.now() }, ...filtered];
    localStorage.setItem(this.MOVIES_KEY, JSON.stringify(updated));
  }

  async removeMovieFromWatchlist(movieId: number): Promise<void> {
    const items = await this.getWatchlistMovies();
    const filtered = items.filter(i => i.id !== movieId);
    localStorage.setItem(this.MOVIES_KEY, JSON.stringify(filtered));
  }

  async isMovieInWatchlist(movieId: number): Promise<boolean> {
    const items = await this.getWatchlistMovies();
    return items.some(i => i.id === movieId);
  }

  async getWatchlistTV(): Promise<WatchlistTVShow[]> {
    const stored = localStorage.getItem(this.SHOWS_KEY);
    const items: any[] = stored ? JSON.parse(stored) : [];
    return items.map((s) => ({
      ...s,
      addedAt: s.addedAt ?? Date.now(),
    }));
  }

  async addShowToWatchlist(show: Omit<WatchlistTVShow, 'addedAt'>): Promise<void> {
    const items = await this.getWatchlistTV();
    const filtered = items.filter(i => i.id !== show.id);
    const updated = [{ ...show, addedAt: Date.now() }, ...filtered];
    localStorage.setItem(this.SHOWS_KEY, JSON.stringify(updated));
  }

  async removeShowFromWatchlist(showId: number): Promise<void> {
    const items = await this.getWatchlistTV();
    const filtered = items.filter(i => i.id !== showId);
    localStorage.setItem(this.SHOWS_KEY, JSON.stringify(filtered));
  }

  async isShowInWatchlist(showId: number): Promise<boolean> {
    const items = await this.getWatchlistTV();
    return items.some(i => i.id === showId);
  }

  async clearWatchlist(): Promise<void> {
    localStorage.removeItem(this.MOVIES_KEY);
    localStorage.removeItem(this.SHOWS_KEY);
  }

  async getCombinedWatchlist(): Promise<Array<{
    type: 'movie' | 'tv';
    data: WatchlistMovie | WatchlistTVShow;
    lastActivity: number;
  }>> {
    const movies = (await this.getWatchlistMovies()).map(movie => ({
      type: 'movie' as const,
      data: movie,
      lastActivity: movie.addedAt
    }));

    const tvShows = (await this.getWatchlistTV()).map(show => ({
      type: 'tv' as const,
      data: show,
      lastActivity: show.addedAt
    }));

    return [...movies, ...tvShows].sort((a, b) => b.lastActivity - a.lastActivity);
  }

  async getFavoriteMovies(): Promise<FavoriteItem[]> {
    const stored = localStorage.getItem(this.FAV_MOVIES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async getFavoriteShows(): Promise<FavoriteItem[]> {
    const stored = localStorage.getItem(this.FAV_SHOWS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  async addMovieToFavorites(movie: Omit<WatchlistMovie, 'addedAt'>): Promise<void> {
    const items = await this.getFavoriteMovies();
    const filtered = items.filter(i => i.id !== movie.id);
    const updated = [{
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      addedAt: Date.now(),
    }, ...filtered];
    localStorage.setItem(this.FAV_MOVIES_KEY, JSON.stringify(updated));
  }

  async addShowToFavorites(show: Omit<WatchlistTVShow, 'addedAt'>): Promise<void> {
    const items = await this.getFavoriteShows();
    const filtered = items.filter(i => i.id !== show.id);
    const updated = [{
      id: show.id,
      name: show.name,
      poster_path: show.poster_path,
      first_air_date: show.first_air_date,
      vote_average: show.vote_average,
      addedAt: Date.now(),
    }, ...filtered];
    localStorage.setItem(this.FAV_SHOWS_KEY, JSON.stringify(updated));
  }

  async removeMovieFromFavorites(movieId: number): Promise<void> {
    const items = await this.getFavoriteMovies();
    const filtered = items.filter(i => i.id !== movieId);
    localStorage.setItem(this.FAV_MOVIES_KEY, JSON.stringify(filtered));
  }

  async removeShowFromFavorites(showId: number): Promise<void> {
    const items = await this.getFavoriteShows();
    const filtered = items.filter(i => i.id !== showId);
    localStorage.setItem(this.FAV_SHOWS_KEY, JSON.stringify(filtered));
  }

  async isMovieInFavorites(movieId: number): Promise<boolean> {
    const items = await this.getFavoriteMovies();
    return items.some(i => i.id === movieId);
  }

  async isShowInFavorites(showId: number): Promise<boolean> {
    const items = await this.getFavoriteShows();
    return items.some(i => i.id === showId);
  }

  async clearFavorites(): Promise<void> {
    localStorage.removeItem(this.FAV_MOVIES_KEY);
    localStorage.removeItem(this.FAV_SHOWS_KEY);
  }
}

export const watchlistService = new WatchlistService();
