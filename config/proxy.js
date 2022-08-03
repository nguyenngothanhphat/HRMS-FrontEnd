const BASE_API = 'https://stghrms.paxanimi.ai';

export const API_KEYS = {
  BASE_API: 'BASE_API',
  TIMESHEET_API: 'TIMESHEET_API',
  PROJECT_API: 'PROJECT_API',
  TICKET_API: 'TICKET_API',
  CUSTOMER_API: 'CUSTOMER_API',
};

export const proxy = {
  // [API_KEYS.BASE_API]: BASE_API,
  [API_KEYS.BASE_API]: 'http://localhost:3005',
  // [API_KEYS.TIMESHEET_API]: BASE_API + '/timesheet',
  [API_KEYS.TIMESHEET_API]: 'http://localhost:8080' + '/timesheet',
  [API_KEYS.PROJECT_API]: BASE_API,
  // [API_KEYS.PROJECT_API]: 'http://localhost:3008',
  // [API_KEYS.TICKET_API]: BASE_API,
  // [API_KEYS.TICKET_API]: 'http://localhost:3006',
  [API_KEYS.CUSTOMER_API]: BASE_API,
};

// export const SOCKET_URL = BASE_API;
export const SOCKET_URL = 'http://localhost:3005';
