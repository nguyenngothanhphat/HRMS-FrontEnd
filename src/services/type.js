import request from '@/utils/request';

export default async function queryType(data) {
  return request('/server/api/api/type/list', {
    method: 'POST',
    data,
  });
}

export async function saveType(data) {
  return request('/server/api/api/type/add', {
    method: 'POST',
    data,
  });
}
