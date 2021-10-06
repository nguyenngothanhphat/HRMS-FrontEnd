import { request } from '@/utils/request';

export function getLeaveBalanceOfUser(payload) {
  return request('/api/leavebalancetenant/get-by-user', {
    method: 'POST',
    data: payload,
  });
}

export async function getTimeOffTypes(payload) {
  return request('/api/timeofftypetenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getTimeOffTypeById(payload) {
  return request('/api/timeofftypetenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}
export async function updateTimeOffType(payload) {
  return request('/api/timeofftypetenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addTimeOffType(payload) {
  return request('/api/timeofftypetenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeTimeOffType(payload) {
  return request('/api/timeofftypetenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getLeaveRequestOfEmployee(payload) {
  return request('/api/leaverequesttenant/get-my-request', {
    method: 'POST',
    data: payload,
  });
}

export async function getLeaveRequestById(payload) {
  return request('/api/leaverequesttenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function updateLeaveRequestById(payload) {
  return request('/api/leaverequesttenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addLeaveRequest(payload) {
  return request('/api/leaverequesttenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function saveDraftLeaveRequest(payload) {
  return request('/api/leaverequesttenant/save-draft', {
    method: 'POST',
    data: payload,
  });
}

export async function updateDraftLeaveRequest(payload) {
  return request('/api/leaverequesttenant/update-draft', {
    method: 'POST',
    data: payload,
  });
}

export async function addCompoffRequest(payload) {
  return request('/api/compoffrequesttenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateCompoffRequest(payload) {
  return request('/api/compoffrequesttenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getMyCompoffRequests(payload) {
  return request('/api/compoffrequesttenant/get-my-request', {
    method: 'POST',
    data: payload,
  });
}

export async function getCompoffRequestById(payload) {
  return request('/api/compoffrequesttenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function removeLeaveRequestOnDatabase(payload) {
  return request('/api/leaverequesttenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function withdrawCompoffRequest(payload) {
  return request('/api/compoffrequesttenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getEmailsListByCompany(payload) {
  return request('/api/employeetenant/admin-list', {
    method: 'POST',
    data: payload,
  });
}

export async function getProjectsListByEmployee(payload) {
  return request('/api/projecttenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}
// Holidays
export async function getHolidaysList(payload) {
  return request('/api/holidaycalendartenant/list', {
    method: 'POST',
    data: payload,
  });
}
export async function getHolidaysListByLocation(payload) {
  return request('/api/holidaycalendartenant/get-by-location', {
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

// MANAGER
export async function getTeamCompoffRequests(payload) {
  return request('/api/compoffrequesttenant/get-team-request', {
    method: 'POST',
    data: payload,
  });
}

export async function getTeamLeaveRequests(payload) {
  return request('/api/leaverequesttenant/get-team-request', {
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
  return request('/api/managebalancestenant/upload-file', {
    method: 'POST',
    data,
  });
}

// reporting manager
export async function reportingManagerApprove(data) {
  return request('/api/leaverequesttenant/reporting-manager-approve', {
    method: 'POST',
    data,
  });
}

export async function reportingManagerReject(data) {
  return request('/api/leaverequesttenant/reporting-manager-reject', {
    method: 'POST',
    data,
  });
}

export async function approveMultipleTimeoffRequest(data) {
  return request('/api/leaverequesttenant/rm-approve-multiple-tickets', {
    method: 'POST',
    data,
  });
}

export async function rejectMultipleTimeoffRequest(data) {
  return request('/api/leaverequesttenant/rm-reject-multiple-tickets', {
    method: 'POST',
    data,
  });
}

// WITHDRAW (INCLUDING SEND EMAIL)
// for employee
export async function employeeWithdrawInProgress(data) {
  return request('/api/leaverequesttenant/withdraw-progress', {
    method: 'POST',
    data,
  });
}

export async function employeeWithdrawApproved(data) {
  return request('/api/leaverequesttenant/withdraw-submit', {
    method: 'POST',
    data,
  });
}

// for hr manager
export async function managerApproveWithdrawRequest(data) {
  return request('/api/leaverequesttenant/withdraw-approve', {
    method: 'POST',
    data,
  });
}

export async function managerRejectWithdrawRequest(data) {
  return request('/api/leaverequesttenant/withdraw-reject', {
    method: 'POST',
    data,
  });
}

// COMPOFF FLOW
export async function getCompoffApprovalFlow(data) {
  return request('/api/compoffrequesttenant/get-approval-flow', {
    method: 'POST',
    data,
  });
}

export async function approveCompoffRequest(data) {
  return request('/api/compoffrequesttenant/approve-compoff-request', {
    method: 'POST',
    data,
  });
}

export async function rejectCompoffRequest(data) {
  return request('/api/compoffrequesttenant/reject-compoff-request', {
    method: 'POST',
    data,
  });
}

export async function approveMultipleCompoffRequest(data) {
  return request('/api/compoffrequesttenant/approve-multiple-compoff-request', {
    method: 'POST',
    data,
  });
}

export async function rejectMultipleCompoffRequest(data) {
  return request('/api/compoffrequesttenant/reject-multiple-compoff-request', {
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

export async function getLocationByCompany(payload) {
  return request('/api/locationtenant/list-by-company-parent', {
    method: 'POST',
    data: payload,
  });
}

export async function getTimeOffTypeByCountry(payload) {
  return request('/api/timeofftypetenant/get-by-country', {
    method: 'POST',
    data: payload,
  });
}

export async function getInitEmployeeSchedule(payload) {
  return request('/api/employeescheduletenant/init-default-from-location', {
    method: 'POST',
    data: payload,
  });
}
export async function getEmployeeScheduleByLocation(payload) {
  return request('/api/employeescheduletenant/get-by-location', {
    method: 'POST',
    data: payload,
  });
}
export async function deleteHoliday(payload) {
  return request('/api/holidaycalendartenant/remove-by-id', {
    method: 'POST',
    data: payload,
  });
}
export async function addHoliday(payload) {
  return request('/api/holidaycalendartenant/add', {
    method: 'POST',
    data: payload,
  });
}
export async function updateEmployeeSchedule(payload) {
  return request('/api/employeescheduletenant/update', {
    method: 'POST',
    data: payload,
  });
}
export async function getLocationById(payload) {
  return request('/api/locationtenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}
