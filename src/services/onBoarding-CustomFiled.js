import { request } from '@/utils/request';

export async function getSection() {
  return request('/api/customsection/list', {
    method: 'POST',
  });
}
export async function addNewSection(payload) {
  return request('/api/customsection/add', {
    method: 'POST',
    data: payload,
  });
}

export async function addNewFieldSection(payload) {
  return request('/api/customfield/add', {
    method: 'POST',
    data: payload,
  });
}
