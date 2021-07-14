import request from '@/utils/request';

export async function getOnboardingList(payload) {
  return request('/api/candidatetenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getTotalNumberOnboardingList(payload) {
  return request('/api/candidatetenant/get-status-summary', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteDraft(payload) {
  return request('/api/candidatetenant/delete-draft', {
    method: 'POST',
    data: payload, // candidate: id
  });
}

export async function reassignTicket(payload) {
  return request('/api/candidatetenant/reassign-ticket', {
    method: 'POST',
    data: payload,
  });
}

export async function inititateBackgroundCheck(payload) {
  return request('/api/candidatetenant/initiate-background-check', {
    method: 'POST',
    data: payload, // candidate: id
  });
}

export async function createProfile(payload) {
  return request('/api/candidatetenant/create-profile', {
    method: 'POST',
    data: payload, // rookieID: id, employeeId: id
  });
}

export async function getListEmployee(payload) {
  return request('/api/employeetenant/list', {
    method: 'POST',
    data: payload,
  });
}
export async function getFilterList(payload) {
  return request('/api/companytenant/list-filter-parent', {
    method: 'POST',
    data: payload,
  });
}
