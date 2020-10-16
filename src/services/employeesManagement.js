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
  return request('/api/location/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDepartmentList(payload) {
  return request('/api/department/list', {
    method: 'POST',
    data: payload,
  });
}

export async function addEmployee(payload) {
  return request('/api/user/add-employee', {
    method: 'POST',
    data: payload,
  });
}
