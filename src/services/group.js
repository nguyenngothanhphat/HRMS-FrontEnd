import request from '@/utils/request';

export async function queryGroup() {
  return request('/server/api/api/tag/get-by-id', {
    method: 'POST',
  });
}

export async function submitGroup(data) {
  return request('/server/api/api/tag/add', {
    method: 'POST',
    data,
  });
}
