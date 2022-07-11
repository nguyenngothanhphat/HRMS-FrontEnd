import request from '@/utils/request';

export async function getEmployeesList(payload) {
  // return request('/api/employeetenant/admin-list', {
  return request('/api/employeetenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getFilterList(payload) {
  return request('/api/companytenant/list-filter-parent', {
    method: 'POST',
    data: payload,
  });
}

export async function getCompanyList(payload) {
  return request('/api/companytenant/list-of-user', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationList() {
  return request('/api/locationtenant/list', {
    method: 'POST',
  });
}

export async function getRoleList(payload) {
  return request('/api/roletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getEmployeeDetailById(payload) {
  return request('/api/employeetenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function updateEmployee(payload) {
  return request('/api/employeetenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getRolesByEmployee(payload) {
  // return request('/api/roletenant/get-by-employee', {
  return request('/api/managepermission/get-by-employee-tenant', {
    method: 'POST',
    data: payload,
  });
}

export async function updateRolesByEmployee(payload) {
  // return request('/api/roletenant/update-by-employee', {
  return request('/api/managepermission/update-by-employee-tenant', {
    method: 'POST',
    data: payload,
  });
}

export async function updateGeneralInfo(payload) {
  return request('/api/generalinfotenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function resetPasswordByEmail(payload) {
  return request('/api/password/recover-tenant', {
    method: 'POST',
    data: payload,
  });
}
