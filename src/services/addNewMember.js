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
  return request('/api/employee/list-active', {
    method: 'POST',
    data: params,
  });
}

export function addCandidate(params) {
  return request('/api/candidate/add-new-member', {
    method: 'POST',
    data: params,
  });
}

export function updateByHR(params) {
  return request('/api/candidate/update-by-hr', {
    method: 'POST',
    data: params,
  });
}

export function getById(params) {
  return request('/api/candidate/get-by-id', {
    method: 'POST',
    data: params,
  });
}

export function submitPhase1(params) {
  return request('/api/candidate/phase-one-hr', {
    method: 'POST',
    data: params,
  });
}

export function getLocationListByCompany(params) {
  return request('/api/location/get-by-company', {
    method: 'POST',
    data: params,
  });
}
export function getSalaryStructureList() {
  return request('/api/salarystructure/list', {
    method: 'POST',
  });
}

export function getTitleListByCompany(params) {
  return request('/api/title/list-by-company', {
    method: 'POST',
    data: params,
  });
}

export function getTableDataByTitle(params) {
  console.log(params);

  return request('/api/salarystructure/get-by-title', {
    method: 'POST',
    data: params,
  });
}

export function closeCandidate(params) {
  console.log(params);
  return request('/api/candidate/close-candidate', {
    method: 'POST',
    data: params,
  });
}

export function editSalaryStructure(params) {
  console.log(params);
  return request('/api/candidate/close-candidate', {
    method: 'POST',
    data: params,
  });
}

export function addManagerSignature(params) {
  console.log(params);
  return request('/api/candidate/add-manager-signature', {
    method: 'POST',
    data: params,
  });
}
