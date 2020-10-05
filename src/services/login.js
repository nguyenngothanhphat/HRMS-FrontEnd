import request from '@/utils/request';

export async function accountLogin(params) {
  return request(
    '/api/sign-in',
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
