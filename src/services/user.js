import request from '@/utils/request';

export async function findUsers(option) {
  return request('/server/api/api/user/find', {
    method: 'POST',
    data: { ...option },
  });
}

export async function queryUpdateMileageRate(option) {
  return request('/server/api/api/user/update', {
    method: 'POST',
    data: { ...option },
  });
}

export async function queryCurrent() {
  return request('/server/api/api/user/get-current-user', {
    method: 'POST',
  });
}

export async function getUserList(data) {
  return request('/server/api/api/user/list', {
    method: 'POST',
    data,
  });
}

export async function getEmployeeList(data) {
  return request('/server/api/api/user/list-all', {
    method: 'POST',
    data,
  });
}
