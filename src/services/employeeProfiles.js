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

export async function getPassPortVisa(payload) {
  return request('/api/passport/get-by-employee', {
    method: 'POST',
    data: payload,
  });
}
export async function getCountryList() {
  return request('/api/country/list', {
    method: 'POST',
  });
}

export async function updatePassPort(payload) {
  return request('/api/passport/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getAddPassPort(payload) {
  return request('/api/passport/add', {
    method: 'POST',
    data: payload,
  });
}
