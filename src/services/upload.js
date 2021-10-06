import { request } from '@/utils/request';

export async function uploadImage(data) {
  data.append('method', 'upload');
  return request('/api/attachments/upload/image', {
    method: 'POST',
    data,
  });
}

export async function uploadFile(data) {
  return request('/api/attachments/upload', {
    method: 'POST',
    data,
  });
}
