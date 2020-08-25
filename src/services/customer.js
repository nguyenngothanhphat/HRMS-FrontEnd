import request from '@/utils/request';

export async function queryCustomer(data = {}) {
  return request('/server/api/api/customer-product/list', {
    method: 'POST',
    data,
  });
}

export async function submitCustomer(data) {
  return request('/server/api/api/customer-product/add', {
    method: 'POST',
    data,
  });
}

export async function deleteCustomer(data) {
  return request('/server/api/api/customer-product/remove', {
    method: 'POST',
    data,
  });
}

export async function getCustomerById(data) {
  return request('/server/api/api/customer-product/get-by-id', {
    method: 'POST',
    data,
  });
}
