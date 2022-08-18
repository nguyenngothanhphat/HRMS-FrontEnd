import io from 'socket.io-client';

import { SOCKET_URL } from '../../config/proxy';

export const socket = io(SOCKET_URL, {
  path: '/api/socket.io',
});

socket.on('connect', () => {
  console.log('socket connected');
});

socket.on('disconnect', (reason) => {
  console.log(reason);
});

export const disconnectSocket = () => {
  socket.disconnect();
};
