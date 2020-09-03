import request from '@/utils/request';

export async function forgotPasswordAPI(params) {
  return request(
    '/api/password/recover',
    {
      method: 'POST',
      data: params,
    },
    true,
  );
}

export async function abc(params) {
  return request(
    '/api/password/recover',
    {
      method: 'POST',
      data: params,
    },
    true,
  );
}
