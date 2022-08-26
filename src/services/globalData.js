import request from '@/utils/request';

export async function getCountryList() {
  return request('/api/country/list', {
    method: 'POST',
  });
}

export async function getStateOfCountry(payload) {
  return request('/api/country/get-states', {
    method: 'POST',
    data: payload,
  });
}

export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
