import request from '@/utils/request';

export async function fetch(data) {
  return request('/server/api/api/customfield/list', {
    method: 'POST',
    data,
  });
}

export async function add(data) {
  return request('/server/api/api/customfield/add', {
    method: 'POST',
    data,
  });
}

export async function deleteField(data) {
  return request('/server/api/api/customfield/remove', {
    method: 'POST',
    data,
  });
}
