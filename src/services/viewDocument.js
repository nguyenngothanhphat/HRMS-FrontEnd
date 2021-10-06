import { request } from '@/utils/request';

export async function getDocuments(payload) {
  return request('/api/document/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentById(payload) {
  return request('/api/document/get-by-id', {
    method: 'POST',
    data: payload,
  });
}
