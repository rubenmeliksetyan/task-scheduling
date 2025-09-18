import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../stores/auth';

let socket: Socket | null = null;

export function connectRealtime() {
  if (socket) return socket;
  const auth = useAuthStore();
  const base = import.meta.env.VITE_API_URL || window.location.origin.replace(':5173', ':3000');
  socket = io(base + '/events', {
    transports: ['websocket'],
    auth: auth.token ? { token: auth.token } : undefined,
  });
  return socket;
}

export function getSocket() {
  return socket;
}

