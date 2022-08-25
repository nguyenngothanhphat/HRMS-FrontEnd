import request from '@/utils/request';

export async function getListTimeOff(params) {
  return request('/api/leaverequesttenant', {
    method: 'GET',
    params,
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

export async function getMissingLeaveDates(params) {
  return request('/api/leaverequesttenant/report-missing-leave-dates', {
    method: 'GET',
    params,
  });
}

export async function getTimeOffTypeByCountry(payload) {
  return request('/api/timeofftypetenant/get-by-country', {
    method: 'POST',
    data: payload,
  });
}
