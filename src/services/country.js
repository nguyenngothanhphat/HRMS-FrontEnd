import request from '@/utils/request';

export async function getListCountry() {
  return request(
    '/api/country/list',
    {
      method: 'POST',
    },
    true,
  );
}

export async function getListState(payload) {
  return request(
    '/api/state/list',
    {
      method: 'POST',
      data: payload,
    },
    true,
  );
}
