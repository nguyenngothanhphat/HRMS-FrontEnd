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

export async function getUserInfo(data) {
  return request(
    '/api/security-register',
    {
      method: 'POST',
      data, // {firstName, email}
    },
    true,
  );
}

export async function getSecurityCode(data) {
  return request(
    '/api/resend-security-register',
    {
      method: 'POST',
      data, // codeNumber
    },
    true,
  );
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
