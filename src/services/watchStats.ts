class WatchStatsService {
  private apiUrl = '/api/watch-stats';

  async recordWatch(): Promise<void> {
    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      console.error('Error recording watch:', err);
    }
  }

  async getTotal(): Promise<number> {
    try {
      const response = await fetch(this.apiUrl);

      if (!response.ok) {
        console.error('Failed to fetch watch stats');
        return 0;
      }

      const data = await response.json();
      return data.total || 0;
    } catch (err) {
      console.error('Error fetching watch stats:', err);
      return 0;
    }
  }
}

export const watchStatsService = new WatchStatsService();
