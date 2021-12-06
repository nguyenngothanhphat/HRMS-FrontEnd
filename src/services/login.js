import request from '@/utils/request';

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
export async function signinGoogle(payload) {
  return request(
    '/api/sign-in-google',
    {
      method: 'POST',
      data: payload,
    },
    true,
  );
}

export async function getURLGoogle() {
  return request(
    '/api/url-sign-in-google',
    {
      method: 'GET',
    },
    true,
  );
}
