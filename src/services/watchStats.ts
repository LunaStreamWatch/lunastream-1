export interface WatchStatEvent {
  event_type: 'watch' | 'continue_watching';
  media_type: 'movie' | 'tv' | 'anime';
  tmdb_id?: number;
  anilist_id?: number;
  season_number?: number;
  episode_number?: number;
  title: string;
}

class WatchStatsService {
  private apiUrl = '/api/watch-stats';

  async recordWatchEvent(event: WatchStatEvent): Promise<void> {
    try {
      const user_agent = navigator.userAgent;

      await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          user_agent,
        }),
      });
    } catch (err) {
      console.error('Error recording watch stat:', err);
    }
  }

  async getStats(filters?: {
    media_type?: string;
    event_type?: string;
    days?: number;
  }) {
    try {
      const params = new URLSearchParams();
      if (filters?.media_type) params.append('media_type', filters.media_type);
      if (filters?.event_type) params.append('event_type', filters.event_type);
      if (filters?.days) params.append('days', filters.days.toString());

      const response = await fetch(`${this.apiUrl}?${params.toString()}`);

      if (!response.ok) {
        console.error('Failed to fetch watch stats');
        return [];
      }

      const data = await response.json();
      return data.stats || [];
    } catch (err) {
      console.error('Error fetching watch stats:', err);
      return [];
    }
  }
}

export const watchStatsService = new WatchStatsService();
