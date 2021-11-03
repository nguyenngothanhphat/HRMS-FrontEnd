import {request} from '@/utils/request';

const BASE_URL = 'https://stghrms.paxanimi.ai';

export default async function getCompaniesList(payload) {
    return request('/api/companytenant/list-of-user', {
      method: 'POST',
      data: payload,
    });
  };

export async function getCustomerList(payload) {
  return request(`${BASE_URL}/api-customer/customertenant/list`, {
    method: 'POST',
    data: payload,
  })
}

export async function getCustomerFilterList(payload) {
  return request(`${BASE_URL}/api-customer/customertenant/filter`, {
    method: 'POST',
    data: payload,
  })
}

export async function addCustomer(payload) {
  return request(`${BASE_URL}/api-customer/customertenant/add`, {
    method: 'POST',
    data: payload,
  })
}

export async function genCustomerID(payload) {
  return request(`${BASE_URL}/api-customer/customertenant/gen-customer-id`, {
    method: 'POST',
    data: payload,
  })
}

export async function getTagList(payload) {
  return request(`${BASE_URL}/api-customer/tagtenant/default-list`, {
    method: 'GET',
    data: payload,
  })
}

export async function getCountryList(payload) {
  return request('/api/country/list', {
    method: 'POST',
    data: payload,
  })
}

export async function getStateListByCountry(payload){
  return request('/api/country/get-states',{
    method: 'POST',
    data: payload
  })
}

export async function exportCustomer(payload) {
  return request(`${BASE_URL}/api-customer/customertenant/export`, {
    method: 'POST',
    data: payload,
  })
}
