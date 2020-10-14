import request from '@/utils/request';

export async function getRookieInfo(params) {
  return request('/api/candidate/add-new-member', {
    method: 'POST',
  });
}
