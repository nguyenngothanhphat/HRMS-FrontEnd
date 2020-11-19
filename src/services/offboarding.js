import request from '@/utils/request';

export async function getOffboardingHRList(payload) {
  return request('/api/offboardingrequest/list', {
    method: 'POST',
    data: payload,
  });
}
export async function getOffboardingList(payload) {
  return request('/api/offboardingrequest/list-my-request', {
    method: 'POST',
    data: payload,
  });
}
export async function getapprovalflowList(payload) {
  return request('/api/approvalflow/list', {
    method: 'POST',
    data: payload,
  });
}
export async function sendRequest(payload) {
  return request('/api/offboardingrequest/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getList1On1(payload) {
  return request('/api/offboardingrequest/get-1-on-1-by-off-boarding-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getRequestById(payload) {
  return request('/api/offboardingrequest/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getMeetingTime() {
  return request('/api/offboardingrequest/get-meeting-time', {
    method: 'POST',
  });
}

export async function create1On1(payload) {
  return request('/api/offboardingrequest/add-1-on-1', {
    method: 'POST',
    data: payload,
  });
}

export async function teamRequestList(payload) {
  return request('/api/offboardingrequest/list-team-request', {
    method: 'POST',
    data: payload,
  });
}

export async function getListProjectByEmployee(payload) {
  return request('/api/project/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}
