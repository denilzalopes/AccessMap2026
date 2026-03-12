import { useState, useEffect } from 'react';

const cache: Record<string, string> = {};

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (cache[key]) return cache[key];
  try {
    const res = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}&lang=fr`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    const p = data.features?.[0]?.properties;
    if (!p) return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    const num    = p.housenumber || '';
    const street = p.street || '';
    const city   = p.city || p.town || p.village || '';
    const zip    = p.postcode || '';
    const parts  = [
      num && street ? `${num} ${street}` : street,
      zip && city   ? `${zip} ${city}`   : city,
    ].filter(Boolean);
    const result = parts.join(', ') || p.name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    cache[key] = result;
    return result;
  } catch {
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
}

export function useAddress(lat?: number, lon?: number): string {
  const [address, setAddress] = useState<string>('');
  useEffect(() => {
    if (lat == null || lon == null) return;
    reverseGeocode(lat, lon).then(setAddress);
  }, [lat, lon]);
  return address;
}

export async function getAddressOnce(lat: number, lon: number): Promise<string> {
  return reverseGeocode(lat, lon);
}

export async function searchPlaces(query: string): Promise<any[]> {
  if (query.length < 3) return [];
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=6&lang=fr`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    return data.features || [];
  } catch {
    return [];
  }
}
