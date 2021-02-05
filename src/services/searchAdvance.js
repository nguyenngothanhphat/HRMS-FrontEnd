import request from '@/utils/request';

export async function searchAdvance(payload) {
  return request('/api/document/search-advanced', {
    method: 'POST',
    data: payload,
  });
}

export async function searchByCategory(payload) {
  return request('/api/document/list-by-category', {
    method: 'POST',
    data: payload,
  });
}
