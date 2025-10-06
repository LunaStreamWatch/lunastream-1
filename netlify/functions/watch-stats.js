// Simple counter for total things watched
let totalWatchCount = 0;

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

  // POST - Increment watch count
  if (event.httpMethod === 'POST') {
    try {
      totalWatchCount++;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          total: totalWatchCount
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to record watch'
        }),
      };
    }
  }

  // GET - Return total count
  if (event.httpMethod === 'GET') {
    try {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          total: totalWatchCount
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to fetch stats'
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
