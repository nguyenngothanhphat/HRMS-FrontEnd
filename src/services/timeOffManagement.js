import request from '@/utils/request';

export async function getListTimeOff(params) {
  return request('/api/leaverequesttenant/get-by-employee-date', {
    method: 'GET',
    params,
  });
}

export async function getListTimeOffManagement(payload) {
  return request('/api/leaverequesttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getListEmployees(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}

export async function getRequestById(payload) {
  return request('/api/leaverequesttenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function generateCSV(payload) {
  return request('/api/leaverequesttenant/download', {
    method: 'POST',
    data: payload,
  });
}

export async function getTimeOffTypeByCountry(payload) {
  return request('/api/timeofftypetenant/get-by-country', {
    method: 'POST',
    data: payload,
  });
}
