import request from '@/utils/request';

export function getCurrency(id) {
  return request(`/server/api/api/currency/get-by-id`, {
    params: { id },
  });
}

export function getSupportCurrencies(query) {
  return request(
    `/server/api/api/currency/get-support-currencies`,
    query && {
      params: { q: query },
    }
  );
}

export function getList() {
  return request('/server/api/api/currency/list', {
    method: 'POST',
  });
}

export function queryCurrency(data) {
  return request('/server/api/api/currency', {
    method: 'POST',
    data,
  });
}
