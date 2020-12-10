import request from '@/utils/request';

export async function getLeaveBalanceOfUser(payload) {
  return request('/api/leavebalance/get-by-user', {
    method: 'POST',
    data: payload,
  });
}

export async function getTimeOffTypes(payload) {
  return request('/api/timeofftype/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getLeaveRequestOfEmployee(payload) {
  return request('/api/leaverequest/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getLeaveRequestById(payload) {
  return request('/api/leaverequest/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function updateLeaveRequestById(payload) {
  return request('/api/leaverequest/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addLeaveRequest(payload) {
  return request('/api/leaverequest/add', {
    method: 'POST',
    data: payload,
  });
}

export async function addCompoffRequest(payload) {
  return request('/api/compoffrequest/add', {
    method: 'POST',
    data: payload,
  });
}

export async function withdrawLeaveRequest(payload) {
  return request('/api/leaverequest/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getEmailsListByCompany(payload) {
  return request('/api/employee/admin-list', {
    method: 'POST',
    data: payload,
  });
}

export async function getProjectsListByCompany(payload) {
  return request('/api/project/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getHolidaysList(payload) {
  return request('/api/holidaycalendar/list', {
    method: 'POST',
    data: payload,
  });
}
