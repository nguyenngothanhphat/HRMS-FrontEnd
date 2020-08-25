import request from '@/utils/request';

export default async function queryExchangeRate(data) {
  return request(`/server/api/api/exchange/get-rate`, {
    method: 'POST',
    data,
  });
}

export async function getSupportExchange(data) {
  return request(`/server/api/api/exchange/get-support-exchange`, {
    method: 'POST',
    data,
  });
}
