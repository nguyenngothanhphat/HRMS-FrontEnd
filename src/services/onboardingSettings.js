import request from '@/utils/request';

export async function getInsuranceList(payload) {
  return request('/api/insurance/list', {
    method: 'POST',
    data: payload,
  });
}

export async function addInsurance(payload) {
  return request('/api/insurance/add', {
    method: 'POST',
    data: payload,
  });
}
