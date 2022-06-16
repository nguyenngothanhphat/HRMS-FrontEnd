import io from 'socket.io-client';

import { SOCKET_URL } from '../../config/proxy';

export const ChatEvent = {
  CONNECT: 'connection',
  DISCONNECT: 'disconnect',
  SEND_MESSAGE: 'sendMessage',
  GET_MESSAGE: 'getMessage',
  ADD_USER: 'addUser',
  GET_USER: 'getUsers',
  LAST_MESSAGE: 'lastMessage',
};

export const socket = io(SOCKET_URL, {
  path: '/api/socket.io',
});

export const disconnectSocket = () => {
  socket.disconnect();
};
