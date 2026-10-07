import { useEffect } from 'react';
import { getSocket, closeSocket } from '../lib/socket.js';

export function useWebSocket(onMessage, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const s = getSocket();
    if (!s) return;
    const handler = (e) => {
      try { onMessage?.(JSON.parse(e.data)); } catch { /* noop */ }
    };
    s.addEventListener('message', handler);
    return () => s.removeEventListener('message', handler);
  }, [onMessage, enabled]);

  useEffect(() => () => closeSocket(), []);
}

