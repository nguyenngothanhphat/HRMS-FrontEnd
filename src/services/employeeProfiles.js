import request from '@/utils/request';

export async function getGeneralInfo(payload) {
  return request('/api/generalinfotenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}
export async function getGeneralInfoByUserId(payload) {
  return request('/api/generalinfotenant/get-employee-by-user-id', {
    method: 'POST',
    data: payload,
  });
}
export async function getEmploymentInfo(payload) {
  return request('/api/employeetenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}
export async function getCompensation(payload) {
  return request('/api/compensationtenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getCompensationList(payload) {
  return request('/api/compensationtenant/list', {
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
export async function getEmployeeTypeList(payload) {
  return request('/api/employeetype/list', {
    method: 'POST',
    data: payload,
  });
}
export async function getLocationList() {
  return request('/api/locationtenant/list', {
    method: 'POST',
  });
}
export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list', {
    method: 'POST',
    data: payload,
  });
}
export async function updateGeneralInfo(payload) {
  return request('/api/generalinfotenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getListTitle(payload) {
  return request('/api/titletenant/list', {
    // return request('/api/title/list', {
    method: 'POST',
    data: payload,
  });
}

export async function updateCertification(payload) {
  return request('/api/certificationtenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addCertification(payload) {
  return request('/api/certificationtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function addChangeHistory(payload) {
  return request('/api/changehistorytenant/add', { method: 'POST', data: payload });
}
// export async function getCountryList() {
//   return request('/api/countrytenant/list', {
//     method: 'POST',
//   });
// }

export async function getCountryList() {
  return request('/api/country/list', {
    method: 'POST',
  });
}

export async function getPayslip(payload) {
  return request('/api/documenttenant/employee-group', {
    method: 'POST',
    data: payload,
  });
}

export async function getPassPort(payload) {
  return request('/api/passporttenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function updatePassPort(payload) {
  return request('/api/passporttenant/update', {
    method: 'POST',
    data: payload,
  });
}
export async function getAddPassPort(payload) {
  return request('/api/passporttenant/add', {
    method: 'POST',
    data: payload,
  });
}
export async function updateVisa(payload) {
  return request('/api/visatenant/upsert', {
    method: 'POST',
    data: payload,
  });
}

export async function getVisa(payload) {
  return request('/api/visatenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getAddVisa(payload) {
  return request('/api/visatenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentAdd(payload) {
  return request('/api/documenttenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentUpdate(payload) {
  return request('/api/documenttenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getAdhaardCard(payload) {
  return request('/api/adhaarcardtenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getAdhaarcardAdd(payload) {
  return request('/api/adhaarcardtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getAdhaarcardUpdate(payload) {
  return request('/api/adhaarcardtenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getPRReport(payload) {
  return request('/api/documenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentCategories(payload) {
  return request('/api/categorychildren/get-by-page', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocuments(payload) {
  return request('/api/documenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentById(payload) {
  return request('/api/documenttenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getEmailsListByCompany(payload) {
  return request('/api/employeetenant/admin-list', {
    method: 'POST',
    data: payload,
  });
}

export async function getChangeHistories(payload) {
  return request('/api/changehistorytenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}
export async function addMultiCertification(payload) {
  return request('/api/certificationtenant/add-multi', {
    method: 'POST',
    data: payload,
  });
}
export async function removeCertification(payload) {
  return request('/api/certificationtenant/delete', {
    method: 'POST',
    data: payload,
  });
}

export async function getBank(payload) {
  return request('/api/bankacctenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getAddBank(payload) {
  return request('/api/bankacctenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function addMultiBank(payload) {
  return request('/api/bankacctenant/add-multi', {
    method: 'POST',
    data: payload,
  });
}
export async function updateBank(payload) {
  return request('/api/bankacctenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getTax(payload) {
  return request('/api/taxtenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getAddTax(payload) {
  return request('/api/taxtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateTax(payload) {
  return request('/api/taxtenant/update', {
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
  return request('/api/changehistorytenant/revoke', {
    method: 'POST',
    data: payload,
  });
}

export async function shareDocument(payload) {
  // payload: {shareWith: [""], fileName: "", url: ""}
  return request('/api/documenttenant/share', {
    method: 'POST',
    data: payload,
  });
}

export async function getDependentsByEmployee(payload) {
  return request('/api/dependenttenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function addDependentsOfEmployee(payload) {
  return request('/api/dependenttenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateDependentsById(payload) {
  return request('/api/dependenttenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function removeDependentsById(payload) {
  return request('/api/dependenttenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getBenefitPlans() {
  return request('/api/benefittenant/list-by-company', {
    method: 'POST',
  });
}
