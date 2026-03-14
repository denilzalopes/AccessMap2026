const SERVICES = [
  import.meta.env.VITE_AUTH_API_URL   || 'http://localhost:8080',
  import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082',
  import.meta.env.VITE_NOTIFICATION_API_URL || 'http://localhost:8084',
];

export async function warmupServices(onProgress?: (pct: number) => void) {
  const pings = SERVICES.map((url, i) =>
    fetch(url + '/actuator/health', { signal: AbortSignal.timeout(15000) })
      .catch(() => null)
      .finally(() => onProgress?.(Math.round(((i+1)/SERVICES.length)*100)))
  );
  await Promise.all(pings);
}
