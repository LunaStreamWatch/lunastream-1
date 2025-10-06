// Simple persistent storage using JSONBin or similar service
// For production, consider using a proper database

const STORAGE_KEY = 'watch-stats-data';

// Simple localStorage-like persistent storage using environment
async function getStats() {
  try {
    // In a real deployment, you'd fetch from a database or KV store
    // For now, this resets on cold starts
    return global.watchStatsCache || [];
  } catch (error) {
    return [];
  }
}

async function saveStats(stats) {
  try {
    global.watchStatsCache = stats;
    return true;
  } catch (error) {
    console.error('Failed to save stats:', error);
    return false;
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // POST - Record watch event
  if (event.httpMethod === 'POST') {
    try {
      const data = JSON.parse(event.body);
      const timestamp = new Date().toISOString();

      const statEntry = {
        ...data,
        created_at: timestamp,
        id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      };

      const stats = await getStats();
      stats.push(statEntry);

      // Keep only last 10000 entries to prevent memory issues
      const limitedStats = stats.length > 10000 ? stats.slice(-10000) : stats;
      await saveStats(limitedStats);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          id: statEntry.id,
          message: 'Watch event recorded'
        }),
      };
    } catch (error) {
      console.error('Error recording watch stat:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to record watch stat',
          details: error.message
        }),
      };
    }
  }

  // GET - Retrieve stats
  if (event.httpMethod === 'GET') {
    try {
      const params = event.queryStringParameters || {};
      const { media_type, event_type, days } = params;

      let stats = await getStats();
      let filtered = [...stats];

      if (media_type) {
        filtered = filtered.filter(stat => stat.media_type === media_type);
      }

      if (event_type) {
        filtered = filtered.filter(stat => stat.event_type === event_type);
      }

      if (days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
        filtered = filtered.filter(stat => new Date(stat.created_at) >= cutoffDate);
      }

      const totalCount = filtered.length;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          stats: filtered.reverse(),
          total: totalCount,
          summary: {
            total_watches: totalCount,
            by_type: {
              movie: filtered.filter(s => s.media_type === 'movie').length,
              tv: filtered.filter(s => s.media_type === 'tv').length,
              anime: filtered.filter(s => s.media_type === 'anime').length,
            },
          },
        }),
      };
    } catch (error) {
      console.error('Error fetching watch stats:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to fetch watch stats',
          details: error.message
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
