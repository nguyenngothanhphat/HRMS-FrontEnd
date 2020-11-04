import request from '@/utils/request';

export async function getOffboardingHRList(payload) {
  return request('/api/offboardingrequest/list', {
    method: 'POST',
    data: payload,
  });
}
export async function getOffboardingList(payload) {
  return request('/api/offboardingrequest/list', {
    method: 'POST',
    data: payload,
  });
}
