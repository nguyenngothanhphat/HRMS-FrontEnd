import request from '@/utils/request';

export async function query(option) {
  return request('/server/api/api/potential-match/run-matching', {
    method: 'POST',
    data: { ...option },
  });
}

export async function query1(option) {
  return request('/server/api/api/potential-match/run-matching', {
    method: 'POST',
    data: { ...option },
  });
}
