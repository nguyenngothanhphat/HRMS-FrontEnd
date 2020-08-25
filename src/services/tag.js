import request from '@/utils/request';

export async function queryGroup() {
  return request('/server/api/api/tag/list', {
    method: 'POST',
  });
}

export async function submitGroup(data) {
  return request('/server/api/api/tag/add', {
    method: 'POST',
    data,
  });
}
