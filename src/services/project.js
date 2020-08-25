/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function queryProject(data) {
  return request('/server/api/api/project/list', {
    method: 'POST',
    data,
  });
}
