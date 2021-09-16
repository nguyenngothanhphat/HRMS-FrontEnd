const ChatEvent = {
  CONNECT: 'connection',
  DISCONNECT: 'disconnect',
  SEND_MESSAGE: 'sendMessage',
  GET_MESSAGE: 'getMessage',
  ADD_USER: 'addUser',
  GET_USER: 'getUsers',
  LAST_MESSAGE: 'lastMessage',
};

const SOCKET_URL = 'https://file-stghrms.paxanimi.ai';
// const SOCKET_URL = 'http://localhost:8900';

export { ChatEvent, SOCKET_URL };
