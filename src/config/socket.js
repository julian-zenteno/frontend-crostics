import { io } from 'socket.io-client';

// La URL de tu backend
const URL =
    process.env.NODE_ENV === 'production'
        ? 'URL_DE_PRODUCCION'
        : 'http://localhost:3001';

export const socket = io(URL, {
    autoConnect: false, // La conexión se hará manualmente
});
