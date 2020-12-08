import request from '@/utils/request';

export async function getDefaultTemplateList() {
  return request('/api/template/get-default', {
    method: 'POST',
  });
}

export async function getCustomTemplateList() {
  return request('/api/template/get-custom', {
    method: 'POST',
  });
}

export async function getTemplateById(payload) {
  return request('/api/template/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function addCustomTemplate(payload) {
  console.log(payload);
  return request('/api/template/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeTemplate(data) {
  return request('/api/template/remove', {
    method: 'POST',
    data,
  });
}

export async function uploadSignature(data) {
  return request('/api/attachments/upload', {
    method: 'POST',
    data,
  });
}

export async function getOptionalQuestions(data) {
  return request('/api/onboardingquestion/list', {
    method: 'POST',
    data,
  });
}

export async function saveOptionalQuestions(payload) {
  return request('/api/onboardingquestion/save-setting', {
    method: 'POST',
    data: payload,
  });
}

export async function updateOptionalQuestions(payload) {
  return request('/api/onboardingquestion/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getTriggerEventList() {
  return request('/api/customemail/list-trigger-event', {
    method: 'POST',
  });
}

export async function getLocationList() {
  return request('/api/location/list', {
    method: 'POST',
  });
}

export async function getDepartmentList() {
  return request('/api/department/list', {
    method: 'POST',
  });
}

export async function getTitleList() {
  return request('/api/title/list', {
    method: 'POST',
  });
}

export async function getEmployeeTypeList() {
  return request('/api/employeetype/list', {
    method: 'POST',
  });
}

export async function getDepartmentListByCompanyId(payload) {
  return request('/api/department/list-by-company', {
    method: 'POST',
    data: payload,
  });
}
