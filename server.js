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

// Variables
const DOMAIN = 'test.lunastream.gay';
const PORT = 443;
const HOST = '0.0.0.0';

// Create logger
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

// Fastify HTTPS server
const fastify = Fastify({
  logger: false,
  trustProxy: true,
  https: {
    key: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${DOMAIN}/fullchain.pem`)
  },
  bodyLimit: 10 * 1024,
  maxParamLength: 100,
  requestTimeout: 5000
});

// Redirect HTTP -> HTTPS
const redirect = Fastify();
redirect.get('*', (req, reply) => {
  reply.redirect(`https://${DOMAIN}${req.url}`);
});
redirect.listen({ port: 80, host: '0.0.0.0' }).then(() => {
  console.log('HTTP redirect server running on port 80');
});

// Decorate request to hold requestId
fastify.decorateRequest('id', null);

// Register plugins
async function registerPlugins() {
  await fastify.register(cors, { origin: true, credentials: true });

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

// Log response
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

// File-based storage paths
const DATA_DIR = path.join(__dirname, 'data');
const WATCH_STATS_FILE = path.join(DATA_DIR, 'watch-stats.json');
const UNIQUE_VISITORS_FILE = path.join(DATA_DIR, 'unique-visitors.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadJSON(filePath, defaultValue = []) {
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

const watchStats = loadJSON(WATCH_STATS_FILE, { total: 0, entries: [] });
const uniqueVisitors = loadJSON(UNIQUE_VISITORS_FILE, { total: 0, ips: new Set() });
uniqueVisitors.ips = new Set(uniqueVisitors.ips || []);

// API Routes
async function registerRoutes() {
  fastify.get('/api/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  fastify.post('/api/watch-stats', async (request, reply) => {
    try {
      watchStats.total = (watchStats.total || 0) + 1;
      const statEntry = { created_at: new Date().toISOString(), id: uuidv4() };
      watchStats.entries = watchStats.entries || [];
      watchStats.entries.push(statEntry);
      saveJSON(WATCH_STATS_FILE, { total: watchStats.total, entries: watchStats.entries.slice(-1000) });
      return reply.send({ success: true, total: watchStats.total });
    } catch (err) {
      logger.error('Error recording watch stat:', err);
      return reply.code(500).send({ error: 'Failed to record watch stat' });
    }
  });

  fastify.get('/api/watch-stats', async (request, reply) => reply.send({ success: true, total: watchStats.total || 0 }));

  fastify.post('/api/unique', async (request, reply) => {
    try {
      const clientIP = request.ip || request.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
      const isNewVisitor = !uniqueVisitors.ips.has(clientIP);
      if (isNewVisitor) {
        uniqueVisitors.ips.add(clientIP);
        uniqueVisitors.total = (uniqueVisitors.total || 0) + 1;
        saveJSON(UNIQUE_VISITORS_FILE, { total: uniqueVisitors.total, ips: Array.from(uniqueVisitors.ips) });
      }
      return reply.send({ success: true, new_visitor: isNewVisitor, total: uniqueVisitors.total });
    } catch (err) {
      logger.error('Error recording unique visitor:', err);
      return reply.code(500).send({ error: 'Failed to record unique visitor' });
    }
  });

  fastify.get('/api/unique', async (request, reply) => reply.send({ success: true, total: uniqueVisitors.total || 0 }));

  // SPA catch-all
  fastify.setNotFoundHandler(async (request, reply) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      reply.type('text/html').send(fs.readFileSync(indexPath, 'utf8'));
    } else {
      reply.code(404).send({ error: 'Application not built. Run "npm run build" first.' });
    }
  });
}

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  logger.error({ reqId: request?.id, error });
  reply.code(error.statusCode || 500).send({
    error: error.name || 'Internal Server Error',
    message: error.message || 'Something went wrong'
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  const shutdownTimeout = setTimeout(() => process.exit(1), 10000);
  try {
    if (fastify.close.length === 1) await fastify.close({ forceCloseConnections: true });
    else await fastify.close();
    if (fastify.server?.listening) await new Promise((res, rej) => fastify.server.close(err => err ? rej(err) : res()));
    clearTimeout(shutdownTimeout);
    logger.info('Shutdown complete, exiting process');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
};

process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.once('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const start = async () => {
  try {
    await registerPlugins();
    await registerRoutes();
    await fastify.listen({ port: PORT, host: HOST });
    logger.info(`🚀 LunaStream server running at https://${DOMAIN}:${PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();