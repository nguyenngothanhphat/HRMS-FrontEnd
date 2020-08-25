import request from '@/utils/request';

export default async function AccountLogin(params) {
  return request(
    '/server/api/api/login-client',
    {
      method: 'POST',
      data: params,
    },
    true
  );
}

export function GetCompanyCode(data) {
  return request('/server/api/api/get-company-code', {
    method: 'POST',
    data: {
      ...data,
    },
  });
}

export function SignIn(data) {
  return request('/server/api/api/sign-in', {
    method: 'POST',
    data: {
      ...data,
    },
  });
}
