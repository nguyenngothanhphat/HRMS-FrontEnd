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

export async function getProjectsListByEmployee(payload) {
  return request('/api/project/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}
// Holidays
export async function getHolidaysList() {
  return request('/api/holidaycalendar/list', {
    method: 'POST',
  });
}
export async function getHolidaysListByLocation(payload) {
  return request('/api/holidaycalendar/get-by-location', {
    method: 'POST',
    data: payload,
  });
}
export async function getHolidaysByCountry(payload) {
  return request('/api/holidaycalendar/get-by-country', {
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

export async function approveMultipleTimeoffRequest(data) {
  return request('/api/leaverequest/rm-approve-multiple-tickets', {
    method: 'POST',
    data,
  });
}

export async function rejectMultipleTimeoffRequest(data) {
  return request('/api/leaverequest/rm-reject-multiple-tickets', {
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
  return request('/api/compoffrequest/reject-compoff-request', {
    method: 'POST',
    data,
  });
}

export async function approveMultipleCompoffRequest(data) {
  return request('/api/compoffrequest/approve-multiple-compoff-request', {
    method: 'POST',
    data,
  });
}

export async function rejectMultipleCompoffRequest(data) {
  return request('/api/compoffrequest/reject-multiple-compoff-request', {
    method: 'POST',
    data,
  });
}

export async function getCalendarHoliday() {
  return request(
    `/apigoogle/calendar/v3/calendars/en.vietnamese%23holiday%40group.v.calendar.google.com/events`,
    {
      params: {
        key: 'AIzaSyC4yCRj10KxwrEebj2DlZT9F6kQwgHy6hM',
      },
      method: 'GET',
    },
  );
}

// ACCOUNT SETTINGS
const mockData = [
  {
    id: 1,
    type: 'A',
    name: 'Casual or Annual Leave',
    shortType: 'CL',
  },
  {
    id: 2,
    type: 'A',
    name: 'Compensation Leave',
    shortType: 'CO',
  },
  {
    id: 3,
    type: 'C',
    name: 'Maternity Leave',
    shortType: 'ML',
  },
  {
    id: 4,
    type: 'D',
    name: 'Work From Home',
    shortType: 'WFH',
  },
];
export async function getDefaultTimeoffTypesList() {
  return {
    statusCode: 200,
    data: mockData,
  };
}

export async function getCountryList() {
  return request('/api/country/list', {
    method: 'POST',
  });
}

export async function getInitEmployeeSchedule() {
  return request('/api/employeeschedule/init-default-from-location', {
    method: 'POST',
  });
}
export async function getEmployeeScheduleByLocation(payload) {
  return request('/api/employeeschedule/get-by-location', {
    method: 'POST',
    data: payload,
  });
}
export async function deleteHoliday(payload) {
  return request('/api/holidaycalendar/remove-by-id', {
    method: 'POST',
    data: payload,
  });
}
export async function addHoliday(payload) {
  return request('/api/holidaycalendar/add', {
    method: 'POST',
    data: payload,
  });
}
