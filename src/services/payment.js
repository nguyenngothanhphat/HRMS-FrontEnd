import request from '@/utils/request';

export default async function fetchById(data) {
  return request('/server/api/api/paymenthistory/get-by-id', {
    method: 'POST',
    data,
  });
}

export async function markPaid(data) {
  return request('/server/api/api/paymenthistory/add', {
    method: 'POST',
    data,
  });
}
