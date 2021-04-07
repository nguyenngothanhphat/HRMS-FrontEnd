import request from '@/utils/request';

export async function getEmployeesList(payload) {
  return request('/api/employee/admin-list', {
    method: 'POST',
    data: payload,
  });
}

export async function getCompanyList(payload) {
  return request('/api/company/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationList(payload) {
  return request('/api/location/get-by-company', {
    method: 'POST',
    data: payload,
  });
}

export async function getRoleList() {
  return request('/api/role/list', {
    method: 'POST',
  });
}

export async function getDepartmentList(payload) {
  return request('/api/department/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getJobTitleList(payload) {
  return request('/api/title/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getReportingManagerList(params) {
  return request('/api/employee/list-active', {
    method: 'POST',
    data: params,
  });
}

export async function addEmployee(payload) {
  return request('/api/user/add-employee', {
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
