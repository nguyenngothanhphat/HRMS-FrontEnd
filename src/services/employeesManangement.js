/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function getEmployeesList(payload) {
  return request('/api/employee/admin-list', {
    method: 'POST',
    data: payload,
  });
}
