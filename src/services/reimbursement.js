import request from '@/utils/request';

export async function fetch(data) {
  return request('/server/api/api/reimbursement/list', {
    method: 'POST',
    data,
  });
}

export async function getById(option) {
  return request('/server/api/api/reimbursement/get-by-id', {
    method: 'POST',
    data: { ...option },
  });
}

export async function saveRequest(data) {
  return request('/server/api/api/reimbursement/request', {
    method: 'POST',
    data,
  });
}

export async function review(option) {
  return request('/server/api/api/reimbursement/review', {
    method: 'POST',
    data: { ...option },
  });
}

export async function reviewMultiple(option) {
  return request('/server/api/api/reimbursement/review-multiple', {
    method: 'POST',
    data: { ...option },
  });
}

export async function removeItem(option) {
  return request('/server/api/api/reimbursement/remove', {
    method: 'POST',
    data: { ...option },
  });
}

export async function fetchSummaryApi(data) {
  return request('/server/api/api/reimbursement/summary', {
    method: 'POST',
    data,
  });
}

export async function fetchPaymentHistoryList(data) {
  return request('/server/api/api/paymenthistory/list', {
    method: 'POST',
    data,
  });
}

export async function fetchRecentReport(data) {
  return request('/server/api/api/reimbursement/request', {
    method: 'POST',
    data,
  });
}

export async function fetchTeamReport(data) {
  return request('/server/api/api/reimbursement/approval-by-user', {
    method: 'POST',
    data,
  });
}

export async function fetchTeamReportByUser(data) {
  return request('/server/api/api/reimbursement/approval-by-user', {
    method: 'POST',
    data,
  });
}

export async function fetchTeamReportByOther(data) {
  return request('/server/api/api/reimbursement/approval-by-other', {
    method: 'POST',
    data,
  });
}

export async function fetchTeamReportComplete(data) {
  return request('/server/api/api/reimbursement/complete', {
    method: 'POST',
    data,
  });
}

export async function addReport(data) {
  return request('/server/api/api/reimbursement/add', {
    method: 'POST',
    data,
  });
}

export async function fetchSummaryApproval(data) {
  return request('/server/api/api/reimbursement/summary-approval', {
    method: 'POST',
    data,
  });
}

export async function update(option) {
  return request('/server/api/api/reimbursement/update', {
    method: 'POST',
    data: { ...option },
  });
}

export async function comment(option) {
  return request('/server/api/api/reimbursement/comment', {
    method: 'POST',
    data: { ...option },
  });
}

export async function approvalData(option) {
  return request('/server/api/api/approvalflow/get-active', {
    method: 'POST',
    data: { ...option },
  });
}

export async function fetchTeamReportAllReport(data) {
  return request('/server/api/api/reimbursement/list-by-reviewer', {
    method: 'POST',
    data,
  });
}
