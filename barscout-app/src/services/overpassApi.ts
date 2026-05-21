import type { Bar } from '@/types/bar';
import { calculateDistance } from '@/utils/geo';

const BASE_URL = 'https://overpass-api.de/api/interpreter';

type CacheEntry = { data: Bar[]; timestamp: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function cacheKey(lat: number, lon: number, radius: number) {
  return `${lat.toFixed(3)}_${lon.toFixed(3)}_${radius}`;
}

type OverpassElement = {
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
};

function toBar(el: OverpassElement, userLat: number, userLon: number): Bar {
  return {
    id: String(el.id),
    name: el.tags?.name ?? 'Unnamed bar',
    lat: el.lat,
    lon: el.lon,
    tags: el.tags ?? {},
    distanceMeters: calculateDistance(userLat, userLon, el.lat, el.lon),
  };
}

export async function getNearbyBars(
  lat: number,
  lon: number,
  radius = 1000,
): Promise<Bar[]> {
  const key = cacheKey(lat, lon, radius);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="bar"](around:${radius},${lat},${lon});
      node["amenity"="pub"](around:${radius},${lat},${lon});
    );
    out body;
  `;

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass error: ${response.status}`);
  }

  const json = await response.json();
  const bars: Bar[] = (json.elements as OverpassElement[])
    .map((el) => toBar(el, lat, lon))
    .sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));

  cache.set(key, { data: bars, timestamp: Date.now() });
  return bars;
}
