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
    '/api/security-register-tenant',
    {
      method: 'POST',
      data, // {firstName, email}
    },
    true,
  );
}

export async function getSecurityCode(data) {
  return request(
    '/api/check-security-register-tenant',
    {
      method: 'POST',
      data, // codeNumber
    },
    true,
  );
}

export async function signupAdmin(data) {
  return request(
    '/api/sign-up-admin-tenant',
    {
      method: 'POST',
      data,
    },
    true,
  );
}

export async function activeAdmin(data) {
  return request(
    '/api/active-user-security-register',
    {
      method: 'POST',
      data,
    },
    true,
  );
}
