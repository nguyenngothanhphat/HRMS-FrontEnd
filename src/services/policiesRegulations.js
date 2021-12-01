import { request } from '@/utils/request';

export async function addCategory(payload) {
  return request('/api-ticket', {
    method: 'POST',
    data: payload,
  });
}

export async function updateCategory(payload) {
  return request('/api-ticket', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteCategory(payload) {
  return request('/api-ticket', {
    method: 'POST',
    data: payload,
  });
}

export async function addPolicy(payload) {
  return request('/api-ticket', {
    method: 'POST',
    data: payload,
  });
}

export async function updatePolicy(payload) {
  return request('/api-ticket', {
    method: 'POST',
    data: payload,
  });
}

export async function deletePolicy(payload) {
  return request('/api-ticket', {
    method: 'POST',
    data: payload,
  });
}
