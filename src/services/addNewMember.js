import request from '@/utils/request';

const jobGradeLevelList = [
  { _id: 1, grade: 1 },
  { _id: 2, grade: 2 },
  { _id: 3, grade: 3 },
  { _id: 4, grade: 4 },
  { _id: 5, grade: 5 },
  { _id: 6, grade: 6 },
  { _id: 7, grade: 7 },
  { _id: 8, grade: 8 },
  { _id: 9, grade: 9 },
  { _id: 10, grade: 10 },
];

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
