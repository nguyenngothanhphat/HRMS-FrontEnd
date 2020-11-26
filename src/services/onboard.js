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

export async function inititateBackgroundCheck(payload) {
  return request('/api/candidate/initiate-background-check', {
    method: 'POST',
    data: payload, // candidate: id
  });
}

export async function createProfile(payload) {
  return request('/api/candidate/create-profile', {
    method: 'POST',
    data: payload, // rookieID: id, employeeId: id
  });
}
