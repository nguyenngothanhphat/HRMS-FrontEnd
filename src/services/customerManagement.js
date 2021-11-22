import { request } from '@/utils/request';

export async function getCompaniesList(payload) {
  return request('/api-customer/customertenant/list-company', {
    method: 'POST',
    data: payload,
  });
}

// get list employee
export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}

export async function getCustomerList(payload) {
  return request(`/api-customer/customertenant/list`, {
    method: 'POST',
    data: payload,
  });
}

export async function getCustomerFilterList(payload) {
  return request(`/api-customer/customertenant/filter`, {
    method: 'POST',
    data: payload,
  });
}

export async function addCustomer(payload) {
  return request(`/api-customer/customertenant/add`, {
    method: 'POST',
    data: payload,
  });
}

export async function genCustomerID(payload) {
  return request(`/api-customer/customertenant/gen-customer-id`, {
    method: 'POST',
    data: payload,
  });
}

// export async function getTagList(payload) {
//   return request(`/api-customer/tagtenant/default-list`, {
//     method: 'GET',
//     data: payload,
//   });
// }

export async function getTagList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getCountryList(payload) {
  return request('/api/country/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getStateListByCountry(payload) {
  return request('/api/country/get-states', {
    method: 'POST',
    data: payload,
  });
}

export async function exportCustomer(payload) {
  return request(`/api-customer/customertenant/export`, {
    method: 'POST',
    data: payload,
  });
}
