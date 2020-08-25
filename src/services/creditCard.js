import request from '@/utils/request';

export async function queryCard(data = {}) {
  return request('/server/api/api/credit-card/list', {
    method: 'POST',
    data,
  });
}

export async function submitCard(data) {
  return request('/server/api/api/credit-card/add', {
    method: 'POST',
    data,
  });
}

export async function deleteCard(data) {
  return request('/server/api/api/credit-card/remove', {
    method: 'POST',
    data,
  });
}

export async function getCardById(option) {
  return request('/server/api/api/credit-card/get-by-id', {
    method: 'POST',
    data: option,
  });
}

export async function getCardByUser(data) {
  return request('/server/api/api/credit-card/get-by-user', {
    method: 'POST',
    data,
  });
}

export async function getCardForEmployee(data) {
  return request('/server/api/api/credit-card/list-assign', {
    method: 'POST',
    data,
  });
}

export async function fetchByAssignForEmployee(data) {
  return request('/server/api/api/credit-card/list-assign', {
    method: 'POST',
    data,
  });
}
