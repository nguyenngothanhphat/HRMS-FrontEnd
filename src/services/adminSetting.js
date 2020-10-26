import request from '@/utils/request';

export async function getListRoles() {
  return request('/api/role/list', {
    method: 'POST',
  });
}

export async function getListTitle() {
  return request('/api/title/list', {
    method: 'POST',
  });
}
