const ALLOWED_ORIGINS = new Set([
  'https://ziwliu8.github.io',
  'http://localhost:4000',
  'http://127.0.0.1:4000'
]);
const DEDUPLICATION_WINDOW_MS = 30 * 60 * 1000;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return handleOptions(origin);
    }

    if (url.pathname === '/api/stats' && request.method === 'GET') {
      return json(await getStats(env.DB), 200, origin);
    }

    if (url.pathname === '/api/visit' && request.method === 'POST') {
      if (!ALLOWED_ORIGINS.has(origin)) {
        return json({ error: 'Origin not allowed' }, 403, origin);
      }
      if (!env.HASH_SALT) {
        return json({ error: 'Server is not configured' }, 503, origin);
      }

      const counted = await recordVisit(request, env);
      const stats = await getStats(env.DB);
      return json({ ...stats, counted }, 200, origin);
    }

    return json({ error: 'Not found' }, 404, origin);
  }
};

async function recordVisit(request, env) {
  const now = Date.now();
  const visitorHash = await createVisitorHash(request, env.HASH_SALT);
  const previous = await env.DB.prepare(
    `SELECT counted_at
       FROM visit_events
      WHERE visitor_hash = ?
      ORDER BY counted_at DESC
      LIMIT 1`
  ).bind(visitorHash).first();

  if (previous && now - Number(previous.counted_at) < DEDUPLICATION_WINDOW_MS) {
    return false;
  }

  const location = getLocation(request);
  await env.DB.prepare(
    `INSERT INTO visit_events (
       visitor_hash, counted_at, country_code, country, city,
       latitude, longitude, weight, source
     ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'live')`
  ).bind(
    visitorHash,
    now,
    location.countryCode,
    location.country,
    location.city,
    location.latitude,
    location.longitude
  ).run();

  return true;
}

async function getStats(db) {
  const totalRow = await db.prepare(
    'SELECT COALESCE(SUM(weight), 0) AS total FROM visit_events'
  ).first();
  const { results } = await db.prepare(
    `SELECT
       country_code AS countryCode,
       country,
       city,
       latitude,
       longitude,
       SUM(weight) AS visits,
       MAX(counted_at) AS lastVisit
     FROM visit_events
     GROUP BY country_code, country, city, latitude, longitude
     ORDER BY visits DESC, lastVisit DESC`
  ).all();

  const locations = results.map((row) => ({
    countryCode: row.countryCode,
    country: row.country,
    city: row.city,
    latitude: nullableNumber(row.latitude),
    longitude: nullableNumber(row.longitude),
    visits: Number(row.visits),
    lastVisit: Number(row.lastVisit)
  }));

  return {
    total: Number(totalRow?.total || 0),
    countries: new Set(
      locations
        .map((location) => location.countryCode)
        .filter((code) => code && code !== 'XX')
    ).size,
    locations
  };
}

function getLocation(request) {
  const cf = request.cf || {};
  const countryCode = normalizeText(cf.country, 'XX').toUpperCase();

  return {
    countryCode,
    country: getCountryName(countryCode),
    city: normalizeText(cf.city, '未知'),
    latitude: finiteNumber(cf.latitude),
    longitude: finiteNumber(cf.longitude)
  };
}

async function createVisitorHash(request, salt) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown-ip';
  const userAgent = request.headers.get('User-Agent') || 'unknown-agent';
  const input = new TextEncoder().encode(`${salt}|${ip}|${userAgent}`);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function getCountryName(countryCode) {
  if (!countryCode || countryCode === 'XX') return '未知';

  try {
    return new Intl.DisplayNames(['zh-CN'], { type: 'region' }).of(countryCode)
      || countryCode;
  } catch {
    return countryCode;
  }
}

function normalizeText(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim().slice(0, 100);
  return normalized || fallback;
}

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function nullableNumber(value) {
  return value === null || value === undefined ? null : finiteNumber(value);
}

function handleOptions(origin) {
  if (!ALLOWED_ORIGINS.has(origin)) {
    return json({ error: 'Origin not allowed' }, 403, origin);
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin)
  });
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders(origin)
    }
  });
}

function corsHeaders(origin) {
  if (!ALLOWED_ORIGINS.has(origin)) return {};

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}
