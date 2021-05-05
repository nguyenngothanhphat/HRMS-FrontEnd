import request from '@/utils/request';

export async function getDefaultTemplateList(payload) {
  return request('/api/templatetenant/get-default', {
    method: 'POST',
    data: payload,
  });
}

export async function getCustomTemplateList(payload) {
  return request('/api/templatetenant/get-custom', {
    method: 'POST',
    data: payload,
  });
}

export async function getTemplateById(payload) {
  return request('/api/templatetenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function addCustomTemplate(payload) {
  return request('/api/templatetenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeTemplate(data) {
  return request('/api/templatetenant/remove', {
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
  return request('/api/onboardingquestiontenant/list', {
    method: 'POST',
    data,
  });
}

export async function saveOptionalQuestions(payload) {
  return request('/api/onboardingquestiontenant/save-setting', {
    method: 'POST',
    data: payload,
  });
}

export async function updateOptionalQuestions(payload) {
  return request('/api/onboardingquestiontenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getTriggerEventList() {
  return request('/api/customemailtenant/list-trigger-event', {
    method: 'POST',
  });
}

export async function getLocationList(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDepartmentList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getTitleList(payload) {
  return request('/api/titletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getEmployeeTypeList() {
  return request('/api/employeetype/list', {
    method: 'POST',
  });
}

export async function getListAutoField() {
  return request('/api/customemailtenant/list-auto-field', {
    method: 'POST',
  });
}

export async function addCustomEmail(payload) {
  return request('/api/customemailtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getListCustomEmailOnboarding(payload) {
  return request('/api/customemailtenant/list-active', {
    method: 'POST',
    data: payload,
  });
}

export async function getListCustomEmailOffboarding(payload) {
  return request('/api/customemailtenant/list-active', {
    method: 'POST',
    data: payload,
  });
}

export async function getCustomEmailInfo(payload) {
  return request('/api/customemailtenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteCustomEmailItem(payload) {
  return request('/api/customemailtenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function updateCustomEmail(payload) {
  return request('/api/customemailtenant/update', {
    method: 'POST',
    data: payload,
  });
}
