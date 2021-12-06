import request from '@/utils/request';

export async function addDocumentSetting(payload) {
  return request('/api/documentcompanytenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeDocumentSetting(payload) {
  return request('/api/documentcompanytenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentSettingList(payload) {
  return request('/api/documentcompanytenant/list', {
    method: 'POST',
    data: payload,
  });
}

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

export async function getTriggerEventList(payload) {
  return request('/api/customemailtenant/list-trigger-event', {
    method: 'POST',
    data: payload,
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
  return request('/api/customemailtenant/list', {
    method: 'POST',
    data: payload,
  });
}

// export async function getListDefaultCustomEmailByCompany(payload) {
//   return request('api/customemailtenant/get-default-by-company', {
//     method: 'POST',
//     data: payload,
//   });
// }

export async function getListCustomEmailOffboarding(payload) {
  return request('/api/customemailtenant/list', {
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

/** ================== Form off boarding */

export async function getFormOffBoardingList(payload) {
  return request('/api/formoffboardingtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getFormOffBoardingById(payload) {
  return request('/api/formoffboardingtenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function addFormOffBoarding(payload) {
  return request('/api/formoffboardingtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateFormOffBoarding(payload) {
  return request('/api/formoffboardingtenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function removeFormOffBoardingById(data) {
  return request('/api/formoffboardingtenant/remove', {
    method: 'POST',
    data,
  });
}

/** ================== optional on boarding question */

export async function getListOptionalOnboardQuestions(payload) {
  return request('/api/questiononboardingtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function updateOptionalOnboardQuestions(payload) {
  return request('/api/questiononboardingtenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addOptionalOnboardQuestions(payload) {
  return request('/api/questiononboardingtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeOptionalOnboardQuestions(payload) {
  return request('/api/questiononboardingtenant/remove-question-candidate', {
    method: 'POST',
    data: payload,
  });
}
export async function getQuestionOnboardingById(payload) {
  return request('/api/questiononboardingtenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}
export async function getListPageOnboarding(payload) {
  return request('/api/listpageonboardingtenant/get-default', {
    method: 'POST',
    data: payload,
  });
}
// salary setting
export async function getListSalaryByLocation(payload) {
  return request('/api/salarystructuretenant/list-by-location', {
    method: 'POST',
    data: payload,
  });
}
export async function getSalaryById(payload) {
  return request('/api/salarystructuretenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}
export async function updateSalary(payload) {
  return request('/api/salarystructuretenant/update-salary', {
    method: 'POST',
    data: payload,
  });
}
export async function importSalary(payload) {
  return request('/api/salarystructuretenant/import', {
    method: 'POST',
    data: payload,
  });
}
