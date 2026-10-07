import { useEffect, useRef } from 'react';

export function usePolling(callback, intervalMs = 5000, enabled = true) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => cbRef.current?.(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}
