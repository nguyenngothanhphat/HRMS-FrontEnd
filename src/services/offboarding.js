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

export async function complete1On1(payload) {
  return request('/api/offboardingrequest/complete-1-on-1', {
    method: 'POST',
    data: payload,
  });
}

export async function reviewRequest(payload) {
  return request('/api/offboardingrequest/review', {
    method: 'POST',
    data: payload,
  });
}

export async function getDefaultTemplates(payload) {
  return request('/api/template/get-default', {
    method: 'POST',
    data: payload,
  });
}

export async function getCustomTemplates(payload) {
  return request('/api/template/get-custom', {
    method: 'POST',
    data: payload,
  });
}

export async function getTemplateById(payload) {
  return request('/api/template/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function addCustomTemplate(payload) {
  return request('/api/template/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getListRelieving(payload) {
  return request('/api/offboardingrequest/list-relieving', {
    method: 'POST',
    data: payload,
  });
}
