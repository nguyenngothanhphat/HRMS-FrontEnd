import request from '@/utils/request';

export async function getGeneralInfo(payload) {
  return request('/api/generalinfotenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}
export async function getEmploymentInfo(payload) {
  return request('/api/employeetenant/get-by-employee-id', {
    method: 'POST',
    data: payload,
  });
}
export async function getCompensation(payload) {
  return request('/api/compensation/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getListSkill() {
  return request('/api/skilltype/list', {
    method: 'POST',
  });
}
export async function getDepartmentList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}
export async function getEmployeeTypeList() {
  return request('/api/employeetype/list', {
    method: 'POST',
  });
}
export async function getLocationList() {
  return request('/api/location/list', {
    method: 'POST',
  });
}
export async function getEmployeeList() {
  return request('/api/employeetenant/list', {
    method: 'POST',
  });
}
export async function updateGeneralInfo(payload) {
  return request('/api/generalinfotenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getListTitle() {
  return request('/api/title/list', {
    method: 'POST',
  });
}

export async function updateCertification(payload) {
  return request('/api/certification/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addCertification(payload) {
  return request('/api/certification/add', {
    method: 'POST',
    data: payload,
  });
}

export async function addChangeHistory(payload) {
  return request('/api/changehistory/add', { method: 'POST', data: payload });
}
export async function getCountryList() {
  return request('/api/country/list', {
    method: 'POST',
  });
}

export async function getPayslip(payload) {
  return request('/api/document/employee-group', {
    method: 'POST',
    data: payload,
  });
}

export async function getPassPort(payload) {
  return request('/api/passport/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function updatePassPort(payload) {
  return request('/api/passport/update', {
    method: 'POST',
    data: payload,
  });
}
export async function getAddPassPort(payload) {
  return request('/api/passport/add', {
    method: 'POST',
    data: payload,
  });
}
export async function updateVisa(payload) {
  return request('/api/visa/upsert', {
    method: 'POST',
    data: payload,
  });
}

export async function getVisa(payload) {
  return request('/api/visa/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getAddVisa(payload) {
  return request('/api/visa/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentAdd(payload) {
  return request('/api/document/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentUpdate(payload) {
  return request('/api/document/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getAdhaardCard(payload) {
  return request('/api/adhaarcard/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getAdhaarcardAdd(payload) {
  return request('/api/adhaarcard/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getAdhaarcardUpdate(payload) {
  return request('/api/adhaarcard/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getPRReport(payload) {
  return request('/api/document/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocuments(payload) {
  return request('/api/document/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentById(payload) {
  return request('/api/document/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getEmailsListByCompany(payload) {
  return request('/api/employee/admin-list', {
    method: 'POST',
    data: payload,
  });
}

export async function getChangeHistories(payload) {
  return request('/api/changehistory/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function removeCertification(payload) {
  return request('/api/certification/delete', {
    method: 'POST',
    data: payload,
  });
}

export async function getBank(payload) {
  return request('/api/bankacc/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getAddBank(payload) {
  return request('/api/bankacc/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateBank(payload) {
  return request('/api/bankacc/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getTax(payload) {
  return request('/api/tax/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getAddTax(payload) {
  return request('/api/tax/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateTax(payload) {
  return request('/api/tax/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getTitleByDepartment(payload) {
  return request('/api/title/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationsByCompany(payload) {
  return request('/api/locationtenant/get-by-company', {
    method: 'POST',
    data: payload,
  });
}

export async function updateEmployment(payload) {
  return request('/api/employeetenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function updatePrivate(payload) {
  return request('/api/generalinfotenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getListRelation() {
  return request('/api/generalinfotenant/list-relation', {
    method: 'POST',
  });
}

export async function getCountryStates(payload) {
  return request('/api/country/get-states', {
    method: 'POST',
    data: payload,
  });
}

export async function getRevokeHistory(payload) {
  return request('/api/changehistory/revoke', {
    method: 'POST',
    data: payload,
  });
}

export async function shareDocument(payload) {
  // payload: {shareWith: [""], fileName: "", url: ""}
  return request('/api/document/share', {
    method: 'POST',
    data: payload,
  });
}

export async function getDependentsByEmployee(payload) {
  return request('/api/dependent/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function addDependentsOfEmployee(payload) {
  return request('/api/dependent/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateDependentsById(payload) {
  return request('/api/dependent/update', {
    method: 'POST',
    data: payload,
  });
}

export async function removeDependentsById(payload) {
  return request('/api/dependent/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getBenefitPlans() {
  return request('/api/benefit/list-by-company', {
    method: 'POST',
  });
}
