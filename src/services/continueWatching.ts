export interface ContinueWatchingItem {
  id: string;
  type: 'movie' | 'tv' | 'anime';
  tmdbId?: number;
  anilistId?: number;
  title: string;
  poster: string;
  lastWatched: number;
  progress?: number;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  totalEpisodes?: number;
  isDub?: boolean;
}

class ContinueWatchingService {
  private readonly STORAGE_KEY = 'lunastream-continue-watching';
  private readonly MAX_ITEMS = 10;

  getContinueWatchingItems(): ContinueWatchingItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const items = JSON.parse(stored);
      return items.sort((a: ContinueWatchingItem, b: ContinueWatchingItem) => 
        b.lastWatched - a.lastWatched
      );
    } catch (error) {
      console.error('Failed to load continue watching items:', error);
      return [];
    }
  }

  addOrUpdateItem(item: Omit<ContinueWatchingItem, 'id' | 'lastWatched'>): void {
    try {
      const items = this.getContinueWatchingItems();
      const id = this.generateId(item);
      
      // Remove existing item if it exists
      const filteredItems = items.filter(existing => existing.id !== id);
      
      // Add new item at the beginning
      const newItem: ContinueWatchingItem = {
        ...item,
        id,
        lastWatched: Date.now()
      };
      
      const updatedItems = [newItem, ...filteredItems].slice(0, this.MAX_ITEMS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Failed to save continue watching item:', error);
    }
  }

  removeItem(id: string): void {
    try {
      const items = this.getContinueWatchingItems();
      const filteredItems = items.filter(item => item.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredItems));
    } catch (error) {
      console.error('Failed to remove continue watching item:', error);
    }
  }

  clearAll(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear continue watching items:', error);
    }
  }

  private generateId(item: Omit<ContinueWatchingItem, 'id' | 'lastWatched'>): string {
    if (item.type === 'movie') {
      return `movie-${item.tmdbId}`;
    } else if (item.type === 'tv') {
      return `tv-${item.tmdbId}-s${item.season}-e${item.episode}`;
    } else if (item.type === 'anime') {
      return `anime-${item.anilistId}-e${item.episode}${item.isDub ? '-dub' : '-sub'}`;
    }
    return `unknown-${Date.now()}`;
  }

  // Helper method to get the next episode for TV shows
  getNextEpisode(currentItem: ContinueWatchingItem): { season: number; episode: number } | null {
    if (currentItem.type !== 'tv' || !currentItem.season || !currentItem.episode) {
      return null;
    }

    // Simple logic: increment episode number
    // In a real app, you'd want to check if the next episode exists
    return {
      season: currentItem.season,
      episode: currentItem.episode + 1
    };
  }
}

export const continueWatchingService = new ContinueWatchingService();