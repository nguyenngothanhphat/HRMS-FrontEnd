import request from '@/utils/request';

export async function LocationFilter(payload) {
  return request('/api/location/list', {
    method: 'POST',
    data: payload,
  });
}

export async function EmployeeTypeFilter(payload) {
  return request('/api/employeetype/list', {
    method: 'POST',
    data: payload,
  });
}

export async function DepartmentFilter() {
  return request('/api/department/list', {
    method: 'POST',
  });
}

export async function getListEmployeeMyTeam(payload) {
  return request('/api/employee/list-my-team', {
    method: 'POST',
    data: payload,
  });
}

export async function getListEmployeeActive(payload) {
  return request('/api/employee/list-active', {
    method: 'POST',
    data: payload,
  });
}
export async function getListEmployeeInActive(payload) {
  return request('/api/employee/list-inactive', {
    method: 'POST',
    data: payload,
  });
}
