import { request } from '@/utils/request';

export async function listFAQ() {
  return request('/api/faqs/list', {
    method: 'POST',
  });
}
export async function addListFAQ(payload) {
  return request('/api/faqs/add', {
    method: 'POST',
    data: payload,
  });
}
export async function defaultList() {
  return request('/api/faqs/init-default', {
    method: 'POST',
  });
}
export async function getbyCompany(payload) {
  return request('/api/faqs/get-by-company', {
    method: 'POST',
    data: payload,
  });
}
