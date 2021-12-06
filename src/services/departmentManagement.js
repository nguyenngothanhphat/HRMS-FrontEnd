import request from '@/utils/request';

export async function getListDefaultDepartment() {
  return request('/api/department/list-default', {
    method: 'POST',
  });
}

export async function getListDepartmentByCompany(payload) {
  return request('/api/department/list-by-company', {
    method: 'POST',
    data: payload,
  });
}

export async function upsertDepartment(payload) {
  return request('/api/department/upsert', {
    method: 'POST',
    data: payload.listDepartment,
  });
}

export async function removeDepartment(payload) {
  return request('/api/department/remove', {
    method: 'POST',
    data: payload,
  });
}
