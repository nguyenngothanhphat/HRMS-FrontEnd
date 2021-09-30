import { request } from '@/utils/request';

export default async function feedbackSubmit(payload) {
  return request('/api/feedback/add', {
    method: 'POST',
    data: payload,
  });
}
