import { useState, useEffect } from 'react';

const cache: Record<string, string> = {};

export function useAddress(lat?: number, lon?: number): string {
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (!lat || !lon) return;
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    if (cache[key]) { setAddress(cache[key]); return; }

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`, {
      headers: { 'Accept-Language': 'fr' }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.address) return;
        const a = data.address;
        const parts = [
          a.house_number && a.road ? `${a.house_number} ${a.road}` : a.road,
          a.suburb || a.neighbourhood || a.quarter,
          a.city || a.town || a.village,
          a.postcode
        ].filter(Boolean);
        const result = parts.slice(0, 3).join(', ');
        cache[key] = result;
        setAddress(result);
      })
      .catch(() => {});
  }, [lat, lon]);

  return address || `${lat?.toFixed(5)}, ${lon?.toFixed(5)}`;
}

export async function getAddressOnce(lat: number, lon: number): Promise<string> {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (cache[key]) return cache[key];
  try {
    const data = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`
    ).then(r => r.json());
    const a = data.address;
    const parts = [
      a.house_number && a.road ? `${a.house_number} ${a.road}` : a.road,
      a.suburb || a.neighbourhood || a.quarter,
      a.city || a.town || a.village,
    ].filter(Boolean);
    const result = parts.slice(0, 3).join(', ');
    cache[key] = result;
    return result;
  } catch {
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
}
