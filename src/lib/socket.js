let socket = null;

export function getSocket() {
  if (socket) return socket;
  const url = import.meta.env.VITE_WS_URL;
  if (!url) return null;
  socket = new WebSocket(url);
  socket.onopen = () => console.info('[ws] connected');
  socket.onclose = () => { socket = null; };
  return socket;
}

export function closeSocket() {
  if (socket) { socket.close(); socket = null; }
}
