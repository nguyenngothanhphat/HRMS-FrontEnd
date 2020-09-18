import request from '@/utils/request';

export async function getGeneralInfo(payload) {
  return request('/api/generalinfo/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}
export async function getCompensation(payload) {
  return request('/api/compensation/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getListSkill() {
  return request('/api/skilltype/list', {
    method: 'POST',
  });
}
