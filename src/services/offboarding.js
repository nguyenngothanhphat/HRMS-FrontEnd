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

export async function getOffBoardingPackages(payload) {
  return request('/api/templaterelieving/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getTemplateById(payload) {
  return request('/api/templaterelieving/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function addCustomTemplate(payload) {
  return request('/api/templaterelieving/add', {
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

export async function sendMailExitPackage(payload) {
  return request('/api/offboardingrequest/send-package', {
    method: 'POST',
    data: payload,
  });
}
export async function getListAssigned() {
  return request('/api/offboardingrequest/list-assigned', {
    method: 'POST',
  });
}

export async function getListAssignee(payload) {
  return request('/api/employee/list-active', {
    method: 'POST',
    data: payload,
  });
}

export async function searchListRelieving(payload) {
  return request('/api/offboardingrequest/search-request', {
    method: 'POST',
    data: payload,
  });
}

export async function requestChangeLWD(payload) {
  return request('/api/offboardingrequest/request-lwd', {
    method: 'POST',
    data: payload,
  });
}

export async function handleRequestChangeLWD(payload) {
  return request('/api/offboardingrequest/approval-lwd', {
    method: 'POST',
    data: payload,
  });
}

export async function handleWithdraw(payload) {
  return request('/api/offboardingrequest/withdraw', {
    method: 'POST',
    data: payload,
  });
}

export async function handleRelievingTemplateDraft(payload) {
  return request('/api/offboardingrequest/save-package-draft', {
    method: 'POST',
    data: payload,
  });
}
export async function updateRelieving(payload) {
  return request('/api/offboardingrequest/update-relieving', {
    method: 'POST',
    data: payload,
  });
}

export async function sendOffBoardingPackage(payload) {
  return request('/api/offboardingrequest/send-package', {
    method: 'POST',
    data: payload,
  });
}
