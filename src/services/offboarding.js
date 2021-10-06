import { request } from '@/utils/request';

export async function getOffboardingHRList(payload) {
  return request('/api/offboardingrequesttenant/list', {
    method: 'POST',
    data: payload,
  });
}
export async function getOffboardingList(payload) {
  return request('/api/offboardingrequesttenant/list-my-request', {
    method: 'POST',
    data: payload,
  });
}
export async function getapprovalflowList(payload) {
  return request('/api/approvalflowtenant/list', {
    method: 'POST',
    data: payload,
  });
}
export async function sendRequest(payload) {
  return request('/api/offboardingrequesttenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function sendRequestUpdate(payload) {
  return request('/api/offboardingrequesttenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getList1On1(payload) {
  return request('/api/offboardingrequesttenant/get-1-on-1-by-off-boarding-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getRequestById(payload) {
  return request('/api/offboardingrequesttenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getMeetingTime(payload) {
  return request('/api/offboardingrequesttenant/get-meeting-time', {
    method: 'POST',
    data: payload,
  });
}

export async function create1On1(payload) {
  return request('/api/offboardingrequesttenant/add-1-on-1', {
    method: 'POST',
    data: payload,
  });
}

export async function teamRequestList(payload) {
  return request('/api/offboardingrequesttenant/list-team-request', {
    method: 'POST',
    data: payload,
  });
}

export async function getListProjectByEmployee(payload) {
  return request('/api/projecttenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function complete1On1(payload) {
  return request('/api/offboardingrequesttenant/complete-1-on-1', {
    method: 'POST',
    data: payload,
  });
}

export async function reviewRequest(payload) {
  return request('/api/offboardingrequesttenant/review', {
    method: 'POST',
    data: payload,
  });
}

export async function getOffBoardingPackages(payload) {
  return request('/api/templaterelievingtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getTemplateById(payload) {
  return request('/api/templaterelievingtenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function addCustomTemplate(payload) {
  return request('/api/templaterelievingtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getListRelieving(payload) {
  return request('/api/offboardingrequesttenant/list-relieving', {
    method: 'POST',
    data: payload,
  });
}

export async function sendMailExitPackage(payload) {
  return request('/api/offboardingrequesttenant/send-package', {
    method: 'POST',
    data: payload,
  });
}
export async function getListAssigned(payload) {
  return request('/api/offboardingrequesttenant/list-assigned', {
    method: 'POST',
    data: payload,
  });
}

export async function getListAssignee(payload) {
  return request('/api/employeetenant/list-manager', {
    method: 'POST',
    data: payload,
  });
}

export async function searchListRelieving(payload) {
  return request('/api/offboardingrequesttenant/list-relieving', {
    method: 'POST',
    data: payload,
  });
}

export async function requestChangeLWD(payload) {
  return request('/api/offboardingrequesttenant/request-lwd', {
    method: 'POST',
    data: payload,
  });
}

export async function handleRequestChangeLWD(payload) {
  return request('/api/offboardingrequesttenant/approval-lwd', {
    method: 'POST',
    data: payload,
  });
}

export async function handleWithdraw(payload) {
  return request('/api/offboardingrequesttenant/withdraw', {
    method: 'POST',
    data: payload,
  });
}

export async function handleWithdrawApproval(payload) {
  return request('/api/offboardingrequesttenant/withdraw-approval', {
    method: 'POST',
    data: payload,
  });
}

export async function handleRelievingTemplateDraft(payload) {
  return request('/api/offboardingrequesttenant/save-package-draft', {
    method: 'POST',
    data: payload,
  });
}
export async function updateRelieving(payload) {
  return request('/api/offboardingrequesttenant/update-relieving', {
    method: 'POST',
    data: payload,
  });
}

export async function sendOffBoardingPackage(payload) {
  return request('/api/offboardingrequesttenant/send-package', {
    method: 'POST',
    data: payload,
  });
}
export async function sendClosePackage(payload) {
  return request('/api/offboardingrequesttenant/send-package', {
    method: 'POST',
    data: payload,
  });
}

export async function removeOffBoardingPackage(payload) {
  return request('/api/offboardingrequesttenant/remove-package', {
    method: 'POST',
    data: payload,
  });
}

export async function terminateReason(payload) {
  return request('/api/offboardingrequesttenant/terminate-hr', {
    method: 'POST',
    data: payload,
  });
}

export async function closeEmplRecord(payload) {
  return request('/api/offboardingrequesttenant/close-employee-record', {
    method: 'POST',
    data: payload,
  });
}

export async function submitToHr(payload) {
  return request('/api/offboardingrequesttenant/submit-to-hr', {
    method: 'POST',
    data: payload,
  });
}

export async function getListAssigneeHr(payload) {
  return request('/api/offboardingrequesttenant/get-list-assigneeHR', {
    method: 'POST',
    data: payload,
  });
}

export async function assignToHr(payload) {
  return request('/api/offboardingrequesttenant/change-assigneeHR', {
    method: 'POST',
    data: payload,
  });
}
