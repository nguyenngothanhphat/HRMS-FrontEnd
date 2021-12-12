import request from '@/utils/request';

export async function forgotPasswordAPI(params) {
  return request(
    '/api/password/recover-tenant',
    {
      method: 'POST',
      data: params,
    },
    true,
  );
}

export async function resetPasswordAPI(params) {
  return request(
    '/api/password/reset-tenant',
    {
      method: 'POST',
      data: params,
    },
    true,
  );
}

export async function updatePasswordAPI(params) {
  return request('/api/password-update-tenant', {
    method: 'POST',
    data: params,
  });
}
