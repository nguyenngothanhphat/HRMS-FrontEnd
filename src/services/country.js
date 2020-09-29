import request from '@/utils/request';

export default async function getListCountry() {
  return request(
    '/api/country/list',
    {
      method: 'POST',
    },
    true,
  );
}
