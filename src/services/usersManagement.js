import request from '@/utils/request';

export async function getEmployeesList(payload) {
  // return request('/api/employeetenant/admin-list', {
  return request('/api/employeetenant/list', {
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

export async function getLocationListByParentCompany(payload) {
  return request('/api/locationtenant/list-by-company-parent', {
    method: 'POST',
    data: payload,
  });
}

export async function getRoleList() {
  return request('/api/roletenant/list', {
    method: 'POST',
  });
}

export async function getEmployeeDetailById(payload) {
  return request('/api/employeetenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function updateEmployee(payload) {
  return request('/api/employee/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getRolesByEmployee(payload) {
  return request('/api/role/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function updateRolesByEmployee(payload) {
  return request('/api/role/update-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function updateGeneralInfo(payload) {
  return request('/api/generalinfo/update', {
    method: 'POST',
    data: payload,
  });
}

export async function resetPasswordByEmail(payload) {
  return request('/api/password/recover', {
    method: 'POST',
    data: payload,
  });
}
