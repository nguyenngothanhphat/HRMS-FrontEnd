import { request } from '@/utils/request';

export async function accountLogin(params) {
  return request(
    '/api/sign-in-tenant',
    {
      method: 'POST',
      data: params,
    },
    true,
  );
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function signInThirdParty(payload) {
  return request(
    '/api/sign-in-third-party',
    {
      method: 'POST',
      data: payload,
    },
    true,
  );
}
