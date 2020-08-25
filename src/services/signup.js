import request from '@/utils/request';

export default async function AccountSignup(params) {
  return request(
    '/server/api/api/sign-up',
    {
      method: 'POST',
      data: params,
    },
    true
  );
}

export async function validAdmin(option) {
  return request('/server/api/api/sign-up-valid-admin', {
    method: 'POST',
    data: { ...option },
  });
}

export async function validCompany(option) {
  return request('/server/api/api/sign-up-valid-company', {
    method: 'POST',
    data: { ...option },
  });
}

export async function validLocation(option) {
  return request('/server/api/api/sign-up-valid-location', {
    method: 'POST',
    data: { ...option },
  });
}

export async function signupAdmin(option) {
  return request('/server/api/api/sign-up-admin', {
    method: 'POST',
    data: { ...option },
  });
}

export async function suiteEdition(option) {
  return request('/server/api/api/suiteedition/get-by-id', {
    method: 'POST',
    data: { ...option },
  });
}
