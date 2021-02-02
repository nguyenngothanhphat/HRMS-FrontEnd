import request from '@/utils/request';

export default function getLocationListByCompany(payload) {
  return request('/api/location/get-by-company', {
    method: 'POST',
    data: payload,
  });
}
