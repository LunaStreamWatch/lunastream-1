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

/*
PRODUCTION CONFIG (KEEPED FROM VPS)
*/
const DOMAIN = 'lunastream.gay';
const PORT = 443;
const HOST = '0.0.0.0';

/*
HTTPS CERTIFICATE (KEEPED)
*/
const httpsOptions = {
  key: fs.readFileSync('/root/certs/origin.key'),
  cert: fs.readFileSync('/root/certs/origin.pem')
};

/*
LOGGER
*/
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

/*
FASTIFY SERVER
*/
const fastify = Fastify({
  https: httpsOptions,
  logger: false,
  trustProxy: true,
  bodyLimit: 10 * 1024,
  maxParamLength: 100,
  requestTimeout: 5000
});

fastify.decorateRequest('id', null);

/*
PLUGINS
*/
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
    allowList: (req) => req.ip === '127.0.0.1' || req.ip === '::1',
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true
    }
  });
}

/*
REQUEST LOGGING (IMPROVED)
*/
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

/*
RESPONSE LOGGING
*/
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

/*
DATA STORAGE
*/
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

/*
INITIAL DATA (IMPROVED)
*/
let watchStats = loadJSON(WATCH_STATS_FILE, { total: 0 });
watchStats.total = watchStats.total || 0;

let uniqueVisitorData = loadJSON(UNIQUE_VISITORS_FILE, { total: 0, ips: [] });
let uniqueVisitors = new Set(uniqueVisitorData.ips || []);
let uniqueTotal = uniqueVisitorData.total || 0;

/*
ROUTES
*/
async function registerRoutes() {

  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  /*
  WATCH STATS (IMPROVED)
  */
  fastify.post('/api/watch-stats', async (request, reply) => {
    try {
      watchStats.total++;
      saveJSON(WATCH_STATS_FILE, { total: watchStats.total });

      return reply.send({ success: true, total: watchStats.total });
    } catch (err) {
      logger.error(err);
      return reply.code(500).send({ error: 'Failed to record watch stat' });
    }
  });

  fastify.get('/api/watch-stats', async (request, reply) => {
    try {
      const data = loadJSON(WATCH_STATS_FILE, { total: 0 });
      return reply.send({ success: true, total: data.total || 0 });
    } catch (err) {
      logger.error(err);
      return reply.code(500).send({ error: 'Failed to fetch watch stats' });
    }
  });

  /*
  UNIQUE VISITORS (IMPROVED IP HANDLING)
  */
  fastify.post('/api/unique', async (request, reply) => {
    try {
      let clientIP =
        request.headers['x-forwarded-for']?.split(',')[0]?.trim()
        || request.ip
        || 'unknown';

      clientIP = clientIP.split(':').slice(0, -1).join(':');

      const isNew = !uniqueVisitors.has(clientIP);

      if (isNew) {
        uniqueVisitors.add(clientIP);
        uniqueTotal++;

        saveJSON(UNIQUE_VISITORS_FILE, {
          total: uniqueTotal,
          ips: Array.from(uniqueVisitors)
        });
      }

      return reply.send({
        success: true,
        new_visitor: isNew,
        total: uniqueTotal
      });

    } catch (err) {
      logger.error(err);
      return reply.code(500).send({ error: 'Failed to record unique visitor' });
    }
  });

  fastify.get('/api/unique', async (request, reply) => {
    try {
      const data = loadJSON(UNIQUE_VISITORS_FILE, { total: 0 });
      return reply.send({
        success: true,
        total: data.total || 0
      });
    } catch (err) {
      logger.error(err);
      return reply.code(500).send({ error: 'Failed to fetch unique count' });
    }
  });

  /*
  SPA HANDLER
  */
  fastify.setNotFoundHandler(async (request, reply) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');

    try {
      if (fs.existsSync(indexPath)) {
        const html = fs.readFileSync(indexPath, 'utf8');
        reply.type('text/html').send(html);
      } else {
        reply.code(404).send({ error: 'Build missing. Run npm run build' });
      }
    } catch (err) {
      logger.error(err);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });
}

/*
ERROR HANDLER (IMPROVED)
*/
fastify.setErrorHandler((error, request, reply) => {
  logger.error({ reqId: request?.id, error });

  if (error.validation) {
    reply.code(400).send({
      error: 'Validation Error',
      message: error.message
    });
  } else {
    reply.code(500).send({
      error: 'Internal Server Error'
    });
  }
});

/*
GRACEFUL SHUTDOWN (IMPORTANT FOR PM2 RELOAD)
*/
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}, shutting down`);

  const timeout = setTimeout(() => {
    process.exit(1);
  }, 10000);

  try {
    await fastify.close();
    clearTimeout(timeout);
    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.once('SIGINT', () => gracefulShutdown('SIGINT'));

/*
START
*/
const start = async () => {
  try {
    await registerPlugins();
    await registerRoutes();

    await fastify.listen({
      port: PORT,
      host: HOST
    });

    logger.info(`🚀 LunaStream running https://${DOMAIN}`);

  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
