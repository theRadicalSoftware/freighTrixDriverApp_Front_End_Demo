export const RouteUtils = {
    // position along route (0..100)
    getCurrentPositionOnRoute(coords, progress, _clamp) {
      if (!coords?.length) return null;
      const t = Math.min(Math.max(progress, 0), 100) / 100;
      const idx = Math.floor(t * (coords.length - 1));
      const next = Math.min(idx + 1, coords.length - 1);
      const segT = (t * (coords.length - 1)) - idx;
      const [lng1, lat1] = coords[idx];
      const [lng2, lat2] = coords[next];
      return { lng: lng1 + (lng2 - lng1) * segT, lat: lat1 + (lat2 - lat1) * segT };
    },
  
    // crude ETA helper to match your UI
    getEstimatedArrival(route, progress, avgMph = 60) {
      const dist = Number(route?.distance) || 0; // miles
      const done = dist * (Math.min(Math.max(progress, 0), 100) / 100);
      const remain = Math.max(dist - done, 0);
      const hours = remain / avgMph;
      const minutes = Math.round(hours * 60);
      const etaDate = new Date(Date.now() + minutes * 60 * 1000);
      return {
        remainingDistance: Math.round(remain),
        remainingTime: minutes,
        eta: etaDate.toLocaleString()
      };
    }
  };
  