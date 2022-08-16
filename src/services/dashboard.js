import { API_KEYS } from '../../config/proxy';
import request from '@/utils/request';

export async function getListTicket(payload) {
  return request('/api/approvaltenant/get-list-ticket', {
    method: 'POST',
    data: payload,
  });
}

export async function getListTimeSheetTicket(params) {
  return request(
    '/api/notify',
    {
      method: 'GET',
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function getAllListTicket(params) {
  return request(
    '/api/listReport',
    {
      method: 'GET',
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}
export async function getListMyTicket(payload) {
  return request(
    '/api-ticket/tickettenant/list',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}

// reporting manager
// approve/reject a leave request or a withdraw request
export async function approveRequest(data) {
  return request('/api/leaverequesttenant/approve', {
    method: 'POST',
    data,
  });
}

export async function approveTimeSheetRequest(data) {
  return request(
    '/api/updateReport',
    {
      method: 'POST',
      data,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function rejectRequest(data) {
  return request('/api/leaverequesttenant/reject', {
    method: 'POST',
    data,
  });
}
export async function aprovalCompoffRequest(payload) {
  return request('/api/compoffrequesttenant/approve-compoff-request', {
    method: 'POST',
    data: payload,
  });
}
export async function rejectCompoffRequest(payload) {
  return request('/api/compoffrequesttenant/reject-compoff-request', {
    method: 'POST',
    data: payload,
  });
}

// GOOGLE CALENDAR
export async function syncGoogleCalendar(payload) {
  return request('/api/google/calendar', {
    method: 'POST',
    data: payload,
  });
}

// WIDGETS
export async function updateWidgets(payload) {
  return request('/api/usermap/update', {
    method: 'POST',
    data: payload,
  });
}

// MY TEAM
export async function getMyTeam(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
export async function updateTicket(payload) {
  return request(
    `/api-ticket/tickettenant/update`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}

// TIMESHEET
export async function getMyTimesheet(payload, params) {
  return request(
    `/api/filter`,
    {
      method: 'GET',
      data: payload,
      params,
    },
    false,
    API_KEYS.TIMESHEET_API,
  );
}

export async function getListMyTeam(payload) {
  return request('/api/employeetenant/list-myteam', {
    method: 'POST',
    data: payload,
  });
}

export async function getListEmployee(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
export async function getHolidaysByCountry(payload) {
  return request('/api/holidaycalendartenant/get-by-country', {
    method: 'POST',
    data: payload,
  });
}
// UPLOADFILE
export async function uploadFile(data) {
  return request('/api/attachments/upload', {
    method: 'POST',
    data,
  });
}
export async function addNotes(payload) {
  return request(
    `/api-ticket/tickettenant/chat`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
// MYPROJECT

export async function getProjectList(payload) {
  return request(
    '/api-project/projecttenant/list',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getMyResourceList(payload) {
  return request(
    '/api-project/resourcetenant/list',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getLeaveRequests(params) {
  return request('/api/leaverequesttenant', {
    method: 'GET',
    params,
  });
}

export async function getTimeOffTypeByCountry(payload) {
  return request('/api/timeofftypetenant/get-by-country', {
    method: 'POST',
    data: payload,
  });
}

export async function getMyTickets(payload) {
  return request(
    '/api-ticket/tickettenant/list-my-ticket',
    {
      method: 'GET',
      params: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
