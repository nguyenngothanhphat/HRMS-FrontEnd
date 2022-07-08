import request from '@/utils/request';

export async function getListTimeOff(params) {
  return request('/api/leaverequesttenant', {
    method: 'GET',
    params,
  });
}

export async function getListEmployees(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationsOfCountries(params) {
  return request('/api/locationtenant/group-country', {
    method: 'GET',
    params,
  });
}

export async function getTimeOffTypeList(params) {
  return request('/api/timeofftypetenant/group', {
    method: 'GET',
    params,
  });
}
