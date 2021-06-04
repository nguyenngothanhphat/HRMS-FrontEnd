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

export async function getTemplateQuestionOnboardingTenantList(payload) {
  return request('/api/templatequestiononboardingtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function updateTemplateQuestionOnboardingTenant(payload) {
  return request('/api/templatequestiononboardingtenant/update', {
    method: 'POST',
    data: payload,
  });
}
