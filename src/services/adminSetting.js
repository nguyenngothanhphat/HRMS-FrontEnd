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

export async function getListPermissionOfRole(payload) {
  return request('/api/permission/list', {
    method: 'POST',
    data: payload,
  });
}
export async function updateRoleWithPermission(payload) {
  return request('/api/role/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getPermissionByIdRole(payload) {
  return request('/api/role/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function addPosition(payload) {
  return request('/api/title/add', {
    method: 'POST',
    data: payload,
  });
}
