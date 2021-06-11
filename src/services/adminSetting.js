import request from '@/utils/request';

export async function getListRoles() {
  return request('/api/roletenant/list', {
    method: 'POST',
  });
}

export async function getListTitle(payload) {
  return request('/api/titletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function removeTitle(payload) {
  return request('/api/titletenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getListPermissionOfRole(payload) {
  return request('/api/permission/list', {
    method: 'POST',
    data: payload,
  });
}
export async function updateRoleWithPermission(payload) {
  return request('/api/roletenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getPermissionByIdRole(payload) {
  return request('/api/roletenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function DepartmentFilter(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function addPosition(payload) {
  return request('/api/titletenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function addDepartment(payload) {
  return request('/api/departmenttenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeDepartment(payload) {
  return request('/api/departmenttenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getRolesByCompany(payload) {
  return request('/api/roletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function setupComplete() {
  return request('/api/company/setup-complete', {
    method: 'POST',
  });
}
