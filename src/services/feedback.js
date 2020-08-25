import request from '@/utils/request';

export async function addFeedback(option) {
  return request('/server/api/api/feedback/add', {
    method: 'POST',
    data: { ...option },
  });
}

export async function findFeedback(data) {
  return request('/server/api/api/feedback/find', {
    method: 'POST',
    data,
  });
}

export async function updateFeedback(data) {
  return request('/server/api/api/feedback/update', {
    method: 'POST',
    data,
  });
}
