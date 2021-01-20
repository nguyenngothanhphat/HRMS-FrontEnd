import request from '@/utils/request';

export default async function searchAdvance(payload) {
  return request('/api/document/search-advanced', {
    method: 'POST',
    data: payload,
  });
}
