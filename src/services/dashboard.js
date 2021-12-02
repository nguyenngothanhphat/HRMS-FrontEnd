import { request } from '@/utils/request';

export async function getListTicket(payload) {
  return request('/api/approvaltenant/get-list-ticket', {
    method: 'POST',
    data: payload,
  });
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
    'TIMESHEET_API',
    true, // hasParams
  );
}
