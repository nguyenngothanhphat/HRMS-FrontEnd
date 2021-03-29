import request from '@/utils/request';

export function getPermissionList(payload) {
  return request('/api/permission/list', {
    method: 'POST',
    data: payload,
  });
}

export function addNewAdmin(payload) {
    return request('/api/usermap/register-admin', {
      method: 'POST',
      data: payload,
    });
  }