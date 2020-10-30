import request from '@/utils/request';

export async function getOnboardingList(payload) {
  return request('/api/candidate/list', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteDraft(payload) {
  return request('/api/candidate/delete-draft', {
    method: 'POST',
    data: payload, // candidate: id
  });
}
