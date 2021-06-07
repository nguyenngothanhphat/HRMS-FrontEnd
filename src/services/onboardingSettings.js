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

export async function getListOptionalOnboardQuestions(payload) {
  return request('/api/templatequestiononboardingtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function updateOptionalOnboardQuestions(payload) {
  return request('/api/templatequestiononboardingtenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addOptionalOnboardQuestions(payload) {
  return request('/api/templatequestiononboardingtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeOptionalOnboardQuestions(payload) {
  return request('/api/templatequestiononboardingtenant/remove', {
    method: 'POST',
    data: payload,
  });
}
