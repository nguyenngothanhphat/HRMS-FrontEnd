import request from '@/utils/request';

const jobGradeLevelList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export function getGradeList() {
  return jobGradeLevelList;
}

export function SendEmail(payload) {
  return request('/api/', {
    method: 'POST',
    data: payload,
  });
}

export function getWorkHistory(params) {
  return request('/api/workhistorytenant/get-by-candidate', {
    method: 'POST',
    data: params,
  });
}

export function getDocumentList() {
  return request('/api/document/list-default-checklist', {
    method: 'POST',
  });
}

export function getDepartmentList(params) {
  return request('/api/departmenttenant/list-by-company', {
    method: 'POST',
    data: params,
  });
}

export async function fetchDepartmentList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getTitleListByDepartment(payload) {
  return request('/api/titletenant/list-by-department', {
    method: 'POST',
    data: payload,
  });
}

export function getLocation() {
  return request('/api/locationtenant/list-all', {
    method: 'POST',
  });
}

export async function getLocationList(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export function getEmployeeTypeList() {
  return request('/api/employeetype/list', {
    method: 'POST',
  });
}

export function getManagerList(params) {
  return request('/api/employeetenant/list-manager', {
    method: 'POST',
    data: params,
  });
  // return request('/api/employee/list-active', {
  //   method: 'POST',
  //   data: params,
  // });
}

export async function getReportingManagerList(params) {
  return request('/api/employeetenant/list-manager', {
    method: 'POST',
    data: params,
  });
}

export function getCandidateManagerList(params) {
  return request('/api/candidatetenant/get-candidate-manager', {
    method: 'POST',
    data: params,
  });
}

export function addCandidate(params) {
  return request('/api/candidatetenant/add-new-member', {
    method: 'POST',
    data: params,
  });
}

export function updateByHR(params) {
  return request('/api/candidatetenant/update-by-hr', {
    method: 'POST',
    data: params,
  });
}

export function submitBasicInfo(params) {
  return request('/api/candidatetenant/basic-info', {
    method: 'POST',
    data: params,
  });
}

export function getById(params) {
  return request('/api/candidatetenant/get-by-id', {
    method: 'POST',
    data: params,
  });
}

export function getDocumentByCandidate(params) {
  return request('/api/documenttenant/get-by-candidate', {
    method: 'POST',
    data: params,
  });
}

export function submitPhase1(payload) {
  return request('/api/candidatetenant/phase-one-hr', {
    method: 'POST',
    data: payload,
  });
}

export function generateLink(payload) {
  return request('/api/candidatetenant/generate-link', {
    method: 'POST',
    data: payload,
  });
}

export function getLocationListByCompany(params) {
  return request('/api/locationtenant/get-by-company', {
    method: 'POST',
    data: params,
  });
}

export function getSalaryStructureList(payload) {
  return request('/api/salarystructuretenant/get-by-title', {
    method: 'POST',
    data: payload,
  });
}

export function getTitleListByCompany(params) {
  return request('/api/titletenant/list-by-company', {
    method: 'POST',
    data: params,
  });
}

export function getTableDataByTitle(params) {
  // console.log(params);
  return request('/api/salarystructuretenant/get-by-title', {
    method: 'POST',
    data: params,
  });
}

export function closeCandidate(params) {
  // console.log(params);
  return request('/api/candidatetenant/close-candidate', {
    method: 'POST',
    data: params,
  });
}

export function editSalaryStructure(params) {
  return request('/api/candidatetenant/edit-salarystructure', {
    method: 'POST',
    data: params,
  });
}

export function addManagerSignature(params) {
  // console.log(params);
  return request('/api/candidatetenant/add-manager-signature', {
    method: 'POST',
    data: params,
  });
}

export function addSchedule(params) {
  // console.log(params);
  return request('/api/candidatetenant/schedule', {
    method: 'POST',
    data: params,
  });
}

// extend offer letter
export function extendOfferLetter(params) {
  return request('/api/candidatetenant/extend-offer-date', {
    method: 'POST',
    data: params,
  });
}

export function withdrawOffer(params) {
  return request('/api/candidatetenant/withdraw-ticket', {
    method: 'POST',
    data: params,
  });
}
