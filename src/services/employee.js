import request from '@/utils/request';

export async function LocationFilter(payload) {
  return request('/api/location/list', {
    method: 'POST',
    data: payload,
  });
}

export async function DepartmentFilter() {
  return request('/api/department/list', {
    method: 'POST',
  });
}
