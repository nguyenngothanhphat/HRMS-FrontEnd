import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent(payload) {
  return request('/api/usermap/get-current-user', {
    method: 'POST',
    data: payload,
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
      data, // {firstName, middleName, lastName, email}
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
    '/api/active-user-security-register-tenant',
    {
      method: 'POST',
      data,
    },
    true,
  );
}

export async function fetchCompanyOfUser(data) {
  return request('/api/companytenant/list-of-user', {
    method: 'POST',
    data,
  });
}

export async function getCompanyTypeListInSignUp() {
  return request(
    '/api/companytype/list',
    {
      method: 'POST',
    },
    true,
  );
}

export async function getIndustryListInSignUp() {
  return request(
    '/api/industry/list',
    {
      method: 'POST',
    },
    true,
  );
}

export async function sendAgainSecurityCode(data) {
  return request(
    '/api/resend-security-register',
    {
      method: 'POST',
      data,
    },
    true,
  );
}
