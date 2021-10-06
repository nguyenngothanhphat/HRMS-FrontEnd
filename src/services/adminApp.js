import { request } from '@/utils/request';

export async function getPermissionList(payload) {
  return request('/api/permission/list', {
    method: 'POST',
    data: payload,
  });
}

export async function addNewAdmin(payload) {
  return request('/api/usermap/register-admin', {
    method: 'POST',
    data: payload,
  });
}

export async function getListAdmin(payload) {
  return request('/api/usermap/list-admin', {
    method: 'POST',
    data: payload,
  });
}
export async function updateAdminService(payload) {
  return request('/api/usermap/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationList(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function updateLocation(payload) {
  return request('/api/locationtenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function removeLocation(payload) {
  return request('/api/locationtenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getListUsersOfOwner(payload) {
  return request('/api/usermap/list-users-of-owner', {
    method: 'POST',
    data: payload,
  });
}
