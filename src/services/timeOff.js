import request from '@/utils/request';

export function getLeaveBalanceOfUser(payload) {
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
  return request('/api/leaverequest/get-my-request', {
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

export async function saveDraftLeaveRequest(payload) {
  return request('/api/leaverequest/save-draft', {
    method: 'POST',
    data: payload,
  });
}

export async function updateDraftLeaveRequest(payload) {
  return request('/api/leaverequest/update-draft', {
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

export async function updateCompoffRequest(payload) {
  return request('/api/compoffrequest/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getMyCompoffRequests(payload) {
  return request('/api/compoffrequest/get-my-request', {
    method: 'POST',
    data: payload,
  });
}

export async function getCompoffRequestById(payload) {
  return request('/api/compoffrequest/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function removeLeaveRequestOnDatabase(payload) {
  return request('/api/leaverequest/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function withdrawCompoffRequest(payload) {
  return request('/api/compoffrequest/remove', {
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

// MANAGER
export async function getTeamCompoffRequests(payload) {
  return request('/api/compoffrequest/get-team-request', {
    method: 'POST',
    data: payload,
  });
}

export async function getTeamLeaveRequests(payload) {
  return request('/api/leaverequest/get-team-request', {
    method: 'POST',
    data: payload,
  });
}
export async function uploadFile(data) {
  return request('/api/attachments/upload', {
    method: 'POST',
    data,
  });
}
export async function uploadBalances(data) {
  return request('/api/managebalances/upload-file', {
    method: 'POST',
    data,
  });
}

// reporting manager
export async function reportingManagerApprove(data) {
  return request('/api/leaverequest/reporting-manager-approve', {
    method: 'POST',
    data,
  });
}

export async function reportingManagerReject(data) {
  return request('/api/leaverequest/reporting-manager-reject', {
    method: 'POST',
    data,
  });
}

// WITHDRAW (INCLUDING SEND EMAIL)
// for employee
export async function employeeWithdrawInProgress(data) {
  return request('/api/leaverequest/withdraw-progress', {
    method: 'POST',
    data,
  });
}

export async function employeeWithdrawApproved(data) {
  return request('/api/leaverequest/withdraw-submit', {
    method: 'POST',
    data,
  });
}

// for hr manager
export async function managerApproveWithdrawRequest(data) {
  return request('/api/leaverequest/withdraw-approve', {
    method: 'POST',
    data,
  });
}

export async function managerRejectWithdrawRequest(data) {
  return request('/api/leaverequest/withdraw-reject', {
    method: 'POST',
    data,
  });
}

// COMPOFF FLOW
export async function getCompoffApprovalFlow(data) {
  return request('/api/compoffrequest/get-approval-flow', {
    method: 'POST',
    data,
  });
}

export async function approveCompoffRequest(data) {
  return request('/api/compoffrequest/approve-compoff-request', {
    method: 'POST',
    data,
  });
}

export async function rejectCompoffRequest(data) {
  return request('/api/compoffrequest/approve-compoff-request', {
    method: 'POST',
    data,
  });
}
