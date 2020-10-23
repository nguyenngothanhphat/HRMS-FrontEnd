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

export async function getLocationList() {
  return request('/api/location/list', {
    method: 'POST',
  });
}

export async function getRoleList() {
  return request('/api/role/list', {
    method: 'POST',
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
