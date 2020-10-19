import request from '@/utils/request';

export function getCandidate(payload) {
  return request('/api/candidate/get-by-ticket', {
    method: 'POST',
    data: payload,
  });
}
