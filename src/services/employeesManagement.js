import { request } from '@/utils/request';

export async function getEmployeesList(payload) {
  return request('/api/employee/admin-list', {
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

export async function getLocationList(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getRoleList(payload) {
  return request('/api/roletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDepartmentList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getJobTitleList(payload) {
  return request('/api/titletenant/list-by-department', {
    method: 'POST',
    data: payload,
  });
}

export async function getReportingManagerList(params) {
  return request('/api/employeetenant/list', {
    method: 'POST',
    data: params,
  });
}

export async function addEmployee(payload) {
  return request('/api/employeetenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function importEmployees(payload) {
  return request('/api/employee/import', {
    method: 'POST',
    data: payload,
  });
}

export async function importEmployeeTenant(payload) {
  return request('/api/employeetenant/import', {
    method: 'POST',
    data: payload,
  });
}

export async function searchEmployees(payload) {
  return request('/api/employee/employee-list', {
    method: 'POST',
    data: payload,
  });
}

export async function getEmployeeDetailById(payload) {
  return request('/api/employee/get-by-id', {
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
