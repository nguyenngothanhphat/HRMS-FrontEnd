import request from '@/utils/request';

export async function getGeneralInfo(payload) {
  return request('/api/generalinfo/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}
export async function getEmploymentInfo(payload) {
  return request('/api/employee/get-by-id', {
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

export async function updateGeneralInfo(payload) {
  return request('/api/generalinfo/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getListTitle() {
  return request('/api/title/list', {
    method: 'POST',
  });
}

export async function updateCertification(payload) {
  return request('/api/certification/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addCertification(payload) {
  return request('/api/certification/add', {
    method: 'POST',
    data: payload,
  });
}
