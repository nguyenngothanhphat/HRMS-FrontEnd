import request from '@/utils/request';

export function getCandidate(payload) {
  return request('/api/candidate/get-by-ticket', {
    method: 'POST',
    data: payload,
  });
}

export function getDocumentByCandidate(payload) {
  return request('/api/document/get-by-candidate', {
    method: 'POST',
    data: payload,
  });
}
