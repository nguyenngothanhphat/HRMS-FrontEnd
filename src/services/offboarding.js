import request from '@/utils/request';

export async function getList(payload) {
  return request('/api/offboardingtenant/list', {
    method: 'GET',
    params: payload,
  });
}

export async function createRequest(payload) {
  return request('/api/offboardingtenant/create', {
    method: 'POST',
    data: payload,
  });
}

export async function getMyRequest(params) {
  return request('/api/offboardingtenant/get', {
    method: 'GET',
    params,
  });
}

export async function getRequestById(params) {
  return request('/api/offboardingtenant/get-by-id', {
    method: 'GET',
    params,
  });
}

export async function withdrawRequest(payload) {
  return request('/api/offboardingtenant/withdraw', {
    method: 'POST',
    data: payload,
  });
}
