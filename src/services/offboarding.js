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
