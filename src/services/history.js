import request from '@/utils/request';

export async function fetch(data) {
  return request('/server/api/api/history/list', {
    method: 'POST',
    data,
  });
}

export async function getById(data) {
  return request('/server/api/api/history/list-by-report', {
    method: 'POST',
    data,
  });
}
