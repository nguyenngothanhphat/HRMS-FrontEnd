import request from '@/utils/request';
import { API_KEYS } from '../../config/proxy';

export async function getList(payload) {
  return request('/api/offboardingtenant/list', {
    method: 'GET',
    params: payload,
  });
}

export async function createRequest(payload) {
  return request('/api/offboardingtenant', {
    method: 'POST',
    data: payload,
  });
}

export async function updateRequest(payload) {
  return request('/api/offboardingtenant', {
    method: 'PATCH',
    data: payload,
  });
}

export async function getMyRequest(params) {
  return request('/api/offboardingtenant', {
    method: 'GET',
    params,
  });
}

export async function getRequestById(params) {
  return request('/api/offboardingtenant/get-by-id', {
    method: 'GET',
    params,
  });
}

export async function withdrawRequest(payload) {
  return request('/api/offboardingtenant', {
    method: 'DELETE',
    data: payload,
  });
}

export async function getTimeInDate(params) {
  return request('/api/offboardingtenant/get-list-calendar', {
    method: 'GET',
    params,
  });
}

// helpers api
export async function getProjectByEmployee(payload) {
  return request(
    '/api-project/resourcetenant/get-by-employee',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
