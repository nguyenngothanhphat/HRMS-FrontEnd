import request from '@/utils/request';

export function getCandidate(payload) {
  return request('/api/candidate/get-by-ticket', {
    method: 'POST',
    data: payload,
  });
}

export function getDocumentByCandidate(params) {
  return request('/api/document/get-by-candidate', {
    method: 'POST',
    data: params,
  });
}

export function getById(params) {
  console.log(params);
  return request('/api/candidate/get-by-id', {
    method: 'POST',
    data: params,
  });
}

export function updateByCandidate(params) {
  console.log(params);
  return request('/api/candidate/update-by-candidate', {
    method: 'POST',
    data: params,
  });
}
