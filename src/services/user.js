import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/employee/get-current-user', {
    method: 'POST',
  });
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function signupAdmin(data) {
  return request(
    '/api/sign-up-admin',
    {
      method: 'POST',
      data,
    },
    true,
  );
}
