import request from '@/utils/request';

export async function send(option) {
  // Define to send from WebApp
  return request('/server/api/api/get-company-code', {
    method: 'POST',
    data: { ...option, isClient: true },
  });
}
export async function sendCompanycode(option) {
  return request('/server/api/api/password/recover', {
    method: 'POST',
    data: { ...option, isClient: true },
  });
}
export async function getbycode(option) {
  return request('/server/api/api/passwordrequest/get-by-code', {
    method: 'POST',
    data: { ...option },
  });
}
export async function resetPW(option) {
  return request('/server/api/api/password/reset', {
    method: 'POST',
    data: { ...option },
  });
}
