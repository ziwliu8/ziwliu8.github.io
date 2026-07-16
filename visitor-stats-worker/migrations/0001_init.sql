CREATE TABLE IF NOT EXISTS visit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_hash TEXT,
  counted_at INTEGER NOT NULL,
  country_code TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  weight INTEGER NOT NULL DEFAULT 1 CHECK (weight > 0),
  source TEXT NOT NULL DEFAULT 'live'
);

CREATE INDEX IF NOT EXISTS idx_visit_events_visitor_time
  ON visit_events (visitor_hash, counted_at DESC);

CREATE INDEX IF NOT EXISTS idx_visit_events_location
  ON visit_events (country_code, city);

INSERT INTO visit_events (
  visitor_hash,
  counted_at,
  country_code,
  country,
  city,
  latitude,
  longitude,
  weight,
  source
)
SELECT
  NULL,
  0,
  'XX',
  '未知',
  '历史访问（地区未知）',
  NULL,
  NULL,
  41,
  'legacy'
WHERE NOT EXISTS (
  SELECT 1 FROM visit_events WHERE source = 'legacy'
);
