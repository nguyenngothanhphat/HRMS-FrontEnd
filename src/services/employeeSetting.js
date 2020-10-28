import request from '@/utils/request';

export async function getDefaultTemplateList() {
  return request('/api/template/get-default', {
    method: 'POST',
  });
}

export async function getTemplateById(payload) {
  return request('/api/template/get-by-id', {
    method: 'POST',
    data: payload,
  });
}
