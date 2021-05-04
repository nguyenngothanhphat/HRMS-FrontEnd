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
