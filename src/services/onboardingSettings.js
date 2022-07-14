import request from '@/utils/request';

export async function getInsuranceList(payload) {
  return request('/api/insurancetenant/fetch-setting', {
    method: 'POST',
    data: payload,
  });
}

export async function addInsurance(payload) {
  return request('/api/insurancetenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getListBenefitDefault(payload) {
  return request('/api/benefittenant/list-benefit-type', {
    method: 'POST',
    data: payload,
  });
}

export async function getListBenefit(payload) {
  return request('/api/benefittenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function addBenefit(payload) {
  return request('/api/benefittenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteBenefit(payload) {
  return request('/api/benefittenant/delete-document', {
    method: 'POST',
    data: payload,
  });
}
export async function addDocument(payload) {
  return request('/api/benefittenant/add-document', {
    method: 'POST',
    data: payload,
  });
}

export async function changeSalaryStructureOption(payload) {
  return request('/api/salarystructuretenant/change-optional', {
    method: 'POST',
    data: payload,
  });
}

export async function getListDocumentType(payload) {
  return request('api/categorychildren/get-document-checklist', {
    method: 'GET',
    params: payload,
  });
}

export async function getListDocumentChecklist(payload) {
  return request('api/documenttenant/checklist', {
    method: 'GET',
    params: payload,
  });
}

export async function addDocumentChecklist(payload) {
  return request('/api/documenttenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function editDocument(payload) {
  return request('api/documenttenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteDocument(payload) {
  return request('api/documenttenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function uploadFile(data) {
  return request('/api/attachments/upload', {
    method: 'POST',
    data,
  });
}

export async function getListEmployeeSingleCompany(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
