import request from '@/utils/request';

export async function getEmployeesList(params) {
  return request('/api/employeetenant', {
    method: 'GET',
    params,
  });
}

export async function searchEmployees(payload) {
  return request('/api/employeetenant/list-by-single-company', {
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

export async function getEmployeeDetailById(payload, params) {
  return request(`/api/employeetenant/${payload._id}`, {
    method: 'GET',
    data: payload,
    params,
  });
}

export async function updateEmployee(payload, params) {
  return request(`/api/employeetenant/${payload._id}`, {
    method: 'PATCH',
    data: payload,
    params,
  });
}

export async function getRolesByEmployee(payload) {
  // return request('/api/roletenant/get-by-employee', {
  return request('/api/managepermission/get-by-employee-tenant', {
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
