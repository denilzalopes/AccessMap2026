const SERVICES = [
  import.meta.env.VITE_AUTH_API_URL   || 'http://localhost:8080',
  import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082',
];

export async function warmupServices(onProgress?: (pct: number) => void) {
  // Ping rapide — max 5 secondes, pas bloquant
  const pings = SERVICES.map((url, i) =>
    fetch(url + '/actuator/health', { signal: AbortSignal.timeout(5000) })
      .catch(() => null)
      .finally(() => onProgress?.(Math.round(((i+1)/SERVICES.length)*100)))
  );
  
  // Attendre max 5 secondes puis continuer quoi qu'il arrive
  await Promise.race([
    Promise.all(pings),
    new Promise(resolve => setTimeout(resolve, 5000))
  ]);
}
