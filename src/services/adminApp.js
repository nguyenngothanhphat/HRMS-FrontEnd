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

export function getListAdmin(payload) {
  return request('/api/usermap/list-admin', {
    method: 'POST',
    data: payload,
  });
}
export function updateAdminService(payload) {
  return request('/api/usermap/update', {
    method: 'POST',
    data: payload,
  });
}

export function getLocationList(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export function updateLocation(payload) {
  return request('/api/locationtenant/update', {
    method: 'POST',
    data: payload,
  });
}


export function removeLocation(payload) {
  return request('/api/locationtenant/remove', {
    method: 'POST',
    data: payload,
  });
}
