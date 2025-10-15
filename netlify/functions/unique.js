// Simple unique visitor counter
let uniqueVisitors = new Set();
let totalUnique = 0;

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

  // POST - Record unique visitor
  if (event.httpMethod === 'POST') {
    try {
      // Get client IP from headers
      const clientIP = event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                      event.headers['x-real-ip'] ||
                      event.requestContext?.identity?.sourceIp ||
                      'unknown';

      const isNewVisitor = !uniqueVisitors.has(clientIP);

      if (isNewVisitor) {
        uniqueVisitors.add(clientIP);
        totalUnique++;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          new_visitor: isNewVisitor,
          total: totalUnique
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to record unique visitor'
        }),
      };
    }
  }

  // GET - Return total unique count
  if (event.httpMethod === 'GET') {
    try {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          total: totalUnique
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to fetch unique visitor count'
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