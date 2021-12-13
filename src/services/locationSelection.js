import request from '@/utils/request';

// export default function getLocationListByCompany(payload) {
//   return request('/api/location/get-by-company', {
//     method: 'POST',
//     data: payload,
//   });
// }

export async function getLocationListByCompany(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationListByParentCompany(payload) {
  return request('/api/locationtenant/list-by-company-parent', {
    method: 'POST',
    data: payload,
  });
}
