import request from '@/utils/request';

export default async function getGeneralInfo(payload) {
  return request('/api/generalinfo/get-by-id', {
    method: 'POST',
    data: payload,
  });
}
