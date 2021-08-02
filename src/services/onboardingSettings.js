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
