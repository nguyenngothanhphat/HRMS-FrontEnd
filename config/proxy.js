// const BASE_API = 'http://localhost:4500';
const BASE_API = 'https://hrms.paxanimi.ai';

export const API_KEYS = {
  BASE_API: 'BASE_API',
  TIMESHEET_API: 'TIMESHEET_API',
  PROJECT_API: 'PROJECT_API',
  TICKET_API: 'TICKET_API',
  CUSTOMER_API: 'CUSTOMER_API'
}

export default {
  [API_KEYS.BASE_API]: BASE_API,
  [API_KEYS.TIMESHEET_API]: BASE_API + '/timesheet',
  [API_KEYS.PROJECT_API]: BASE_API,
  [API_KEYS.TICKET_API]: BASE_API,
  [API_KEYS.CUSTOMER_API]: BASE_API
};

// HOW TO MODIFY
/* -----------------------
In the "src/services" folder are API requests.
- If you do not use the "BASE_API - https://stghrms.paxanimi.ai"
-> Add the 4th parameter is a string that is one of API_KEYS above. The 3rd parameter should be false (boolean)
- If you use the "BASE_API - https://stghrms.paxanimi.ai", you only need two default parameters
-------------------- */
