import request from '@/utils/request';

export function SendEmail(payload) {
  return request('/api/', {
    method: 'POST',
    data: payload,
  });
}

export function getDocumentList() {
  return request('/api/document/list-default-checklist', {
    method: 'POST',
  });
}

export function getDepartmentList(params) {
  return request('/api/department/list-by-company', {
    method: 'POST',
    data: params,
  });
}

export function getTitleList(params) {
  return request('/api/title/list-by-company', {
    method: 'POST',
    data: params,
  });
}

export function getLocation() {
  return request('/api/location/list-all', {
    method: 'POST',
  });
}

export function getEmployeeTypeList() {
  return request('/api/employeetype/list', {
    method: 'POST',
  });
}

export function getManagerList(params) {
  console.log(params);
  return request('/api/employee/list-active', {
    method: 'POST',
    data: params,
  });
}

export function addCandidate(params) {
  console.log(params);
  return request('/api/candidate/add-by-hr', {
    method: 'POST',
    data: params,
  });
}

export function updateByHR(params) {
  console.log(params);
  return request('/api/candidate/update-by-hr', {
    method: 'POST',
    data: params,
  });
}
