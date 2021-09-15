import io from 'socket.io-client';

// const SOCKET_URL = 'https://file-stghrms.paxanimi.ai';
const SOCKET_URL = 'http://localhost:8900';

export default io(SOCKET_URL);
