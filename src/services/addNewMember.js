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

export function getDepartmentList() {
  return request('/api/department/list', {
    method: 'POST',
  });
}

export function getTitleList() {
  return request('/api/title/list', {
    method: 'POST',
  });
}

export function getLocationList() {
  return request('/api/location/list', {
    method: 'POST',
  });
}

export function getEmployeeTypeList() {
  return request('/api/employeetype/list', {
    method: 'POST',
  });
}

export function getManagerList(params) {
  return request('/api/employee/list-manager', {
    method: 'POST',
    data: params,
  });
}
