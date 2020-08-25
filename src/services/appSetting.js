/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function getByLocation(data) {
  return request('/server/api/api/appsetting/get-by-location', {
    method: 'POST',
    data,
  });
}
