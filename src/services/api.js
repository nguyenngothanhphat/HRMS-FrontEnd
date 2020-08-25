import request from '@/utils/request';

export default async function getCountries() {
  return request('/assets/JSON/countries.json');
}

export async function getCurrencyList() {
  return request('/assets/JSON/currency-list.json');
}
