// const BASE_API = 'http://localhost:4500';
const BASE_API = 'https://stghrms.paxanimi.ai';

export default {
  // BASE_API: 'http://localhost:3005',
  BASE_API,
  TIMESHEET_API: BASE_API + '/timesheet',
  RESOURCE_API: BASE_API,
  PROJECT_API: BASE_API,
  TICKET_API: BASE_API,
};

// HOW TO MODIFY
/* -----------------------
In the "src/services" folder are API requests.
- If you do not use the "BASE_API - https://stghrms.paxanimi.ai"
-> Add the 4th parameter is a string that is one of those fields 'TIMESHEET_API','RESOURCE_API',... above. The 3rd parameter should be false (boolean)
- If you use the "BASE_API - https://stghrms.paxanimi.ai", you only need two default parameters
-------------------- */
