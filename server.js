import Fastify from 'fastify';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv';

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

// Environment variables with defaults
const DOMAIN = 'test.lunastream.gay';
const PORT = 3000;
const HOST = '0.0.0.0';

// Create your own pino logger
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

const fastify = Fastify({
  logger: false, // Disable default Fastify logger
  trustProxy: true,
  bodyLimit: 10 * 1024,
  maxParamLength: 100,
  // Removed keepAliveTimeout to avoid lingering sockets on shutdown
  // keepAliveTimeout: 5,
  requestTimeout: 5000
});

// Decorate request to hold requestId
fastify.decorateRequest('id', null);

// Register plugins
async function registerPlugins() {
  await fastify.register(cors, {
    origin: true,
    credentials: true
  });

  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'dist'),
    prefix: '',
  });

  await fastify.register(cookie);

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    ban: 3,
    allowList: (req, key) => req.ip === '127.0.0.1' || req.ip === '::1',
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true
    }
  });
}

// Assign unique ID and log request start
fastify.addHook('onRequest', async (request, reply) => {
  const requestId = uuidv4();
  request.id = requestId;
  reply.header('X-Request-Id', requestId);

  const xff = request.headers['x-forwarded-for'];

  logger.info({
    reqId: requestId,
    ip: request.ip,
    method: request.method,
    url: request.url,
    xForwardedFor: xff,
  }, 'Incoming request');
});

// Log response with status and response time
fastify.addHook('onResponse', async (request, reply) => {
  const responseTime = reply.getResponseTime().toFixed(2);

  logger.info({
    reqId: request.id,
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    responseTime: `${responseTime}ms`,
    ip: request.ip,
  }, 'Request completed');
});

// File-based persistent storage paths
const DATA_DIR = path.join(__dirname, 'data');
const WATCH_STATS_FILE = path.join(DATA_DIR, 'watch-stats.json');
const UNIQUE_VISITORS_FILE = path.join(DATA_DIR, 'unique-visitors.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJSON(filePath, defaultValue = {}) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    logger.error(`Error loading ${filePath}:`, err);
  }
  return defaultValue;
}

function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    logger.error(`Error saving ${filePath}:`, err);
  }
}

// Initialize watch stats
let watchStats = loadJSON(WATCH_STATS_FILE, { total: 0 });
watchStats.total = watchStats.total || 0;

// Initialize unique visitors - load IPs as array and convert to Set
let uniqueVisitorData = loadJSON(UNIQUE_VISITORS_FILE, { total: 0, ips: [] });
let uniqueVisitors = new Set(uniqueVisitorData.ips || []);
let uniqueTotal = uniqueVisitorData.total || 0;

// API Routes
async function registerRoutes() {
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Watch stats endpoints
  fastify.post('/api/watch-stats', async (request, reply) => {
    try {
      watchStats.total = (watchStats.total || 0) + 1;
      
      saveJSON(WATCH_STATS_FILE, {
        total: watchStats.total
      });

      return reply.send({ success: true, total: watchStats.total });
    } catch (err) {
      logger.error('Error recording watch stat:', err);
      return reply.code(500).send({ error: 'Failed to record watch stat' });
    }
  });

  fastify.get('/api/watch-stats', async (request, reply) => {
    try {
      // Reload from file to get latest count
      const data = loadJSON(WATCH_STATS_FILE, { total: 0 });
      return reply.send({
        success: true,
        total: data.total || 0
      });
    } catch (err) {
      logger.error('Error fetching watch stats:', err);
      return reply.code(500).send({ error: 'Failed to fetch watch stats' });
    }
  });

  fastify.post('/api/unique', async (request, reply) => {
    try {
      // Get real IP - check x-forwarded-for header first (for proxies)
      let clientIP = request.headers['x-forwarded-for']?.split(',')[0]?.trim() 
        || request.ip 
        || 'unknown';
      
      // Use just the IP without port for more consistent tracking
      clientIP = clientIP.split(':').slice(0, -1).join(':');
      
      const isNewVisitor = !uniqueVisitors.has(clientIP);

      if (isNewVisitor) {
        uniqueVisitors.add(clientIP);
        uniqueTotal += 1;

        // Save to file
        saveJSON(UNIQUE_VISITORS_FILE, {
          total: uniqueTotal,
          ips: Array.from(uniqueVisitors)
        });
      }

      return reply.send({
        success: true,
        new_visitor: isNewVisitor,
        total: uniqueTotal
      });
    } catch (err) {
      logger.error('Error recording unique visitor:', err);
      return reply.code(500).send({ error: 'Failed to record unique visitor' });
    }
  });

  fastify.get('/api/unique', async (request, reply) => {
    try {
      // Reload from file to get latest count
      const data = loadJSON(UNIQUE_VISITORS_FILE, { total: 0 });
      return reply.send({
        success: true,
        total: data.total || 0
      });
    } catch (err) {
      logger.error('Error fetching unique visitor count:', err);
      return reply.code(500).send({ error: 'Failed to fetch unique visitor count' });
    }
  });

  // SPA catch-all handler
  fastify.setNotFoundHandler(async (request, reply) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');

    try {
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf8');
        reply.type('text/html').send(html);
      } else {
        reply.code(404).send({ error: 'Application not built. Run "npm run build" first.' });
      }
    } catch (error) {
      logger.error(error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });
}

// Error handler with requestId in logs
fastify.setErrorHandler((error, request, reply) => {
  logger.error({
    reqId: request?.id,
    error: error,
  });

  if (error.validation) {
    reply.code(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation
    });
  } else if (error.statusCode) {
    reply.code(error.statusCode).send({
      error: error.name || 'Error',
      message: error.message
    });
  } else {
    reply.code(500).send({
      error: 'Internal Server Error',
      message: 'Something went wrong'
    });
  }
});

// Graceful shutdown with forceCloseConnections and timeout fallback
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully`);

  const shutdownTimeout = setTimeout(() => {
    logger.error('Force exiting process after timeout');
    process.exit(1);
  }, 10000); // 10 seconds max wait

  try {
    // Close Fastify with forceCloseConnections option if supported
    if (fastify.close.length === 1) {
      await fastify.close({ forceCloseConnections: true });
    } else {
      await fastify.close();
    }

    // Close underlying native server if open
    if (fastify.server && fastify.server.listening) {
      await new Promise((resolve, reject) => {
        fastify.server.close((err) => (err ? reject(err) : resolve()));
      });
      logger.info('Underlying HTTP server closed');
    }

    clearTimeout(shutdownTimeout);
    logger.info('Shutdown complete, exiting process');
    process.exit(0);

  } catch (err) {
    logger.error('Error during shutdown:', err);
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
};

// Bind signal handlers once, using process.once
process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.once('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const start = async () => {
  try {
    await registerPlugins();
    await registerRoutes();

    await fastify.listen({ 
      port: PORT, 
      host: HOST 
    });

    logger.info(`🚀 LunaStream server running on http://${HOST}:${PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
