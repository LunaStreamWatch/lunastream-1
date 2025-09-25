import Fastify from 'fastify';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';

import dotenv from 'dotenv';

import fetch from 'node-fetch';

const OPEN_SUBTITLES_API_URL = "https://api.opensubtitles.com/api/v1/subtitles";
const OPEN_SUBTITLES_API_KEY = process.env.OPEN_SUBTITLES_API_KEY || "ubzr1nyb4zG6xeYx3RorbzXaHXm1k4El";

async function fetchSubtitles(tmdbId, type = "movie") {
  try {
    const res = await fetch(`${OPEN_SUBTITLES_API_URL}?tmdb_id=${tmdbId}&type=${type}`, {
      headers: {
        "Api-Key": OPEN_SUBTITLES_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`Failed to fetch subtitles: ${res.status} ${res.statusText}`);

    const data = await res.json();

    return (data.data || []).map(sub => ({
      id: sub.id,
      language: sub.attributes.language,
      release: sub.attributes.release,
      url: sub.attributes.url, // direct link
      lines: [] // optional: can parse subtitle file if needed
    }));
  } catch (err) {
    console.error(`Failed to fetch subtitles from OpenSubtitles: ${err}`);
    return [];
  }
}
// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

// Environment variables with defaults
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

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

  await fastify.register(jwt, {
    secret: JWT_SECRET
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

// Authentication decorator
fastify.decorate('authenticate', async function(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// API Routes
async function registerRoutes() {
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  fastify.get('/api/subtitles/movie/:tmdbId', async (request, reply) => {
    const tmdbId = request.params.tmdbId;

    if (!tmdbId || isNaN(Number(tmdbId))) {
      return reply.code(400).send({ error: 'Invalid TMDB ID' });
    }

    const subtitles = await fetchSubtitles(Number(tmdbId), 'movie');
    return reply.send(subtitles);
  });

  fastify.get('/api/subtitles/tv/:tmdbId/season/:season/episode/:episode', async (request, reply) => {
    const { tmdbId, season, episode } = request.params;

    if (!tmdbId || isNaN(Number(tmdbId)) || !season || isNaN(Number(season)) || !episode || isNaN(Number(episode))) {
      return reply.code(400).send({ error: 'Invalid parameters. Expect tmdbId, season, and episode numbers.' });
    }

    try {
      // Call OpenSubtitles API with type=tv and pass season/episode
      const subtitles = await fetchSubtitles(Number(tmdbId), 'tv', Number(season), Number(episode));
      return reply.send(subtitles);
    } catch (err) {
      return reply.code(500).send({ error: 'Failed to fetch subtitles', details: err.message });
    }
  });


  fastify.post('/api/admin/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute'
      }
    },
    preValidation: (request, reply, done) => {
      const { username, password } = request.body || {};
      if (!username || !password || username.length > 50 || password.length > 50) {
        return reply.code(400).send({ error: 'Invalid request format' });
      }
      done();
    }
  }, async (request, reply) => {
    const { username, password } = request.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = fastify.jwt.sign(
        { 
          username,
          role: 'admin',
          loginTime: new Date().toISOString()
        },
        { expiresIn: '24h' }
      );

      reply.setCookie('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      return { 
        success: true, 
        message: 'Login successful',
        token,
        expiresIn: '24h'
      };
    } else {
      reply.code(401);
      return { 
        success: false, 
        message: 'Invalid credentials' 
      };
    }
  });

  fastify.post('/api/admin/logout', async (request, reply) => {
    reply.clearCookie('admin_token');
    return { success: true, message: 'Logged out successfully' };
  });

  fastify.get('/api/admin/verify', { preHandler: [fastify.authenticate] }, async (request) => {
    return { 
      success: true, 
      user: {
        username: request.user.username,
        role: request.user.role,
        loginTime: request.user.loginTime
      }
    };
  });

  fastify.get('/api/admin/data', { preHandler: [fastify.authenticate] }, async () => {
    return {
      success: true,
      data: {
        totalUsers: Math.floor(Math.random() * 10000) + 1000,
        activeStreams: Math.floor(Math.random() * 100) + 10,
        serverUptime: process.uptime(),
        lastUpdated: new Date().toISOString()
      }
    };
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
    logger.info(`📊 Admin panel available at http://${HOST}:${PORT}/admin`);
    logger.info(`🔐 Admin credentials: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
    
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
