import request from '@/utils/request';

export async function fetch() {
  return request('/server/api/api/setting/get-by-id?id=expense-app', {
    method: 'GET',
  });
}

export async function uploadImage(data) {
  data.append('method', 'upload');
  return request('/server/api/api/attachments/upload/image', {
    method: 'POST',
    data,
  });
}

export async function submit(data) {
  return request('/server/api/api/setting', {
    method: 'POST',
    data,
  });
}

export async function uploadAvatar(data) {
  return request('/server/api/api/attachments/upload', {
    method: 'POST',
    data,
  });
}
