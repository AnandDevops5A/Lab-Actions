import { NextResponse } from 'next/server';

// Simple in-memory cache to avoid hitting YouTube quota during rapid requests.
const cache = new Map(); // key -> { expires: ts, data }
const CACHE_TTL = 45 * 1000; // 45 seconds

// Optional Redis integration: if REDIS_URL is provided, use it for caching.
let redisClient = null;
async function getRedisClient() {
  if (redisClient) return redisClient;
  const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST;
  if (!redisUrl) return null;
  try {
    // Lazy-require to avoid forcing dependency when not configured.
    // If you want Redis caching enable, install `redis` package.
    // npm install redis
    // or set REDIS_URL environment variable.
    // The code supports both URL and host:port via REDIS_HOST.
    // Note: in Next.js server runtime this will run in Node environment.
    // eslint-disable-next-line global-require
    const { createClient } = require('redis');
    const client = createClient({ url: redisUrl.startsWith('redis') ? redisUrl : `redis://${redisUrl}` });
    client.on('error', (err) => console.error('Redis client error', err));
    await client.connect();
    redisClient = client;
    return redisClient;
  } catch (err) {
    console.warn('Redis not available or failed to connect:', err.message || err);
    return null;
  }
}

async function fetchYouTubeLive(query, apiKey) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&q=${encodeURIComponent(
    query,
  )}&maxResults=6&key=${apiKey}`;

  const res = await fetch(searchUrl);
  if (!res.ok) {
    throw new Error(`YouTube search failed: ${res.status}`);
  }
  const json = await res.json();
  const items = json.items || [];
  if (items.length === 0) return [];

  const videoIds = items.map((it) => it.id.videoId).filter(Boolean).join(',');
  if (!videoIds) return [];

  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails,statistics&id=${videoIds}&key=${apiKey}`;
  const vres = await fetch(videosUrl);
  if (!vres.ok) throw new Error(`YouTube videos failed: ${vres.status}`);
  const vjson = await vres.json();
  const videosById = (vjson.items || []).reduce((acc, v) => {
    acc[v.id] = v;
    return acc;
  }, {});

  return items.map((it) => {
    const vid = it.id.videoId;
    const info = videosById[vid] || {};
    const live = info.liveStreamingDetails || {};
    return {
      videoId: vid,
      title: it.snippet?.title || '',
      channelTitle: it.snippet?.channelTitle || '',
      startTime: live.scheduledStartTime || it.snippet?.publishedAt || null,
      isLive: true,
      liveViewerCount: info.statistics?.concurrentViewers || null,
      liveChatId: live.activeLiveChatId || null,
      thumbnail: it.snippet?.thumbnails?.high?.url || it.snippet?.thumbnails?.default?.url || null,
    };
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || searchParams.get('query');
    if (!q) {
      return NextResponse.json({ error: 'Missing query parameter `q`' }, { status: 400 });
    }

    const key = `yt_live::${q}`;
    const now = Date.now();

    // Try Redis first (if configured), then in-memory fallback
    const redis = await getRedisClient();
    if (redis) {
      try {
        const raw = await redis.get(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed._expires && parsed._expires > now) {
            return NextResponse.json({ ok: true, data: parsed.data });
          }
        }
      } catch (e) {
        console.warn('Redis get failed', e.message || e);
      }
    }

    const cached = cache.get(key);
    if (cached && cached.expires > now) {
      return NextResponse.json({ ok: true, data: cached.data });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Server missing YOUTUBE_API_KEY env var' }, { status: 500 });
    }

    const data = await fetchYouTubeLive(q, apiKey);
    cache.set(key, { expires: now + CACHE_TTL, data });

    // store to redis if available
    const redis2 = await getRedisClient();
    if (redis2) {
      try {
        const payload = JSON.stringify({ _expires: now + CACHE_TTL, data });
        await redis2.set(key, payload, { PX: CACHE_TTL });
      } catch (e) {
        console.warn('Redis set failed', e.message || e);
      }
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error('Live API error:', err);
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
