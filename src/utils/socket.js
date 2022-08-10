import io from 'socket.io-client';

import { SOCKET_URL } from '../../config/proxy';

export const socket = io(SOCKET_URL, {
  path: '/api/socket.io',
});

export const disconnectSocket = () => {
  socket.disconnect();
};
