import { request } from '@/utils/request';

export async function addCategory(payload) {
  return request('/api/policy/add ', {
    method: 'POST',
    data: payload,
  });
}

export async function getListCategory(payload) {
  return request('/api/policy/list-policy ', {
    method: 'POST',
    data: payload,
  });
};

export async function updateCategory(payload) {
  return request('/api/policy/update ', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteCategory(payload) {
  return request('/api/policy/delete', {
    method: 'POST',
    data: payload,
  });
}

export async function addPolicy(payload) {
  return request('/api/policyregulatenent/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updatePolicy(payload) {
  return request('/api/policyregulatenent/update ', {
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
