import request from '@/utils/request';

export default async function getOnboardingList(params) {
  return request('/api/candidate/list', {
    method: 'POST',
    data: params,
  });
}
