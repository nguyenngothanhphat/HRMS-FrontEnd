import request from '@/utils/request';

export async function getOnboardingList(params) {
  return request('/api/candidate/list', {
    method: 'POST',
    data: params,
  });
}
