import { API_KEYS } from '../../config/proxy';
import request from '@/utils/request';

export async function getListTicket(payload) {
  return request('/api/approvaltenant/get-list-ticket', {
    method: 'POST',
    data: payload,
  });
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
export async function aprovalLeaveRequest(payload) {
  return request('/api/leaverequesttenant/reporting-manager-approve', {
    method: 'POST',
    data: payload,
  });
}
export async function rejectLeaveRequest(payload) {
  return request('/api/leaverequesttenant/reporting-manager-reject', {
    method: 'POST',
    data: payload,
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

export async function getWidgets(payload) {
  return request('/api/employeetenant/get-by-id', {
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

export async function getMyResoucreList(payload) {
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

// HOME PAGE
export async function getBirthdayInWeek(data) {
  return request('/api/employeetenant/list-celebration', {
    method: 'POST',
    data,
  });
}
