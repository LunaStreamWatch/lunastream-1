const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

class WatchStatsService {
  private watchStatsUrl = `${SUPABASE_URL}/functions/v1/watch-stats`;
  private uniqueVisitorUrl = `${SUPABASE_URL}/functions/v1/unique`;

  private getHeaders() {
    return {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    };
  }

  async recordWatch(): Promise<void> {
    try {
      await fetch(this.watchStatsUrl, {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.error('Error recording watch:', err);
    }
  }

  async getTotal(): Promise<number> {
    try {
      const response = await fetch(this.watchStatsUrl, {
        headers: this.getHeaders(),
      });

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

  async recordUniqueVisitor(): Promise<{ newVisitor: boolean; total: number }> {
    try {
      const response = await fetch(this.uniqueVisitorUrl, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.error('Failed to record unique visitor');
        return { newVisitor: false, total: 0 };
      }

      const data = await response.json();
      return {
        newVisitor: data.new_visitor || false,
        total: data.total || 0,
      };
    } catch (err) {
      console.error('Error recording unique visitor:', err);
      return { newVisitor: false, total: 0 };
    }
  }

  async getUniqueVisitorCount(): Promise<number> {
    try {
      const response = await fetch(this.uniqueVisitorUrl, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        console.error('Failed to fetch unique visitor count');
        return 0;
      }

      const data = await response.json();
      return data.total || 0;
    } catch (err) {
      console.error('Error fetching unique visitor count:', err);
      return 0;
    }
  }
}

export const watchStatsService = new WatchStatsService();
