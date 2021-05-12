import request from '@/utils/request';

export async function searchAdvance(payload) {
  return request('/api/documenttenant/search-advanced', {
    method: 'POST',
    data: payload,
  });
}

export async function searchByCategory(payload) {
  return request('/api/documenttenant/list-by-category', {
    method: 'POST',
    data: payload,
  });
}

export async function getHistorySearch(payload) {
  return request('/api/historysearchtenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function updateSearchHistory(payload) {
  return request('/api/historysearchtenant/add-and-update', {
    method: 'POST',
    data: payload,
  });
}
