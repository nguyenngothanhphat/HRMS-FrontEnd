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

export async function addLeaveRequest(payload) {
  return request('/api/leaverequest/add', {
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

export async function getHolidaysList(payload) {
  return request('/api/holidaycalendar/list', {
    method: 'POST',
    data: payload,
  });
}

const mockData1 = [
  {
    name: `Family Event 1`,
    fromDate: '11/1/2020',
    toDate: '11/1/2020',
    duration: 1,
    type: 'CL',
  },
  {
    name: `Family Event 2`,
    fromDate: '11/27/2020',
    toDate: '11/29/2020',
    duration: 3,
    type: 'CL',
  },
  {
    name: `Family Event 3`,
    fromDate: '10/12/2020',
    toDate: '10/13/2020',
    duration: 2,
    type: 'CL',
  },
  {
    name: 'Family Event 4',
    fromDate: '12/30/2020',
    toDate: '12/30/2020',
    duration: 1,
    type: 'CL',
  },
];
