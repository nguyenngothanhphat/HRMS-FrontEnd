import request from '@/utils/request';

export async function LocationFilter(payload) {
  return request('/api/location/list', {
    method: 'POST',
    data: payload,
  });
}

export async function Department() {
  return request('/api/location/list');
}
