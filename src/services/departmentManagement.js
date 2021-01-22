import request from '@/utils/request';

export async function getListDefaultDepartment(payload) {
  return request('/api/department/list-default', {
    method: 'POST',
    data: payload,
  });
}

export async function getListDepartmentByCompany(payload) {
  return request('/api/department/list-by-company', {
    method: 'POST',
    data: payload,
  });
}

export async function upsertLocationsList(payload) {
  return request('/api/location/upsert', {
    method: 'POST',
    data: payload.locations,
  });
}
