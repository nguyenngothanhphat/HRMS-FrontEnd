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

export async function handleExpiryTicket(payload) {
  return request('/api/candidatetenant/handle-expiry-ticket', {
    method: 'POST',
    data: payload,
  });
}

export async function initiateBackgroundCheck(payload) {
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

export async function withdrawTicket(payload) {
  return request('/api/candidatetenant/withdraw-ticket', {
    method: 'POST',
    data: payload,
  });
}

export async function getPosition(payload) {
  return request('/api/titletenant/list-by-company', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationList(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getListJoiningFormalities(payload) {
  return request('/api/joiningformalitiestenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function updateJoiningFormalities(payload) {
  return request('/api/joiningformalitiestenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addJoiningFormalities(payload) {
  return request('/api/joiningformalitiestenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeJoiningFormalities(payload) {
  return request('/api/joiningformalitiestenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function createUserName(payload) {
  return request('/api/joiningformalitiestenant/create-user-name', {
    method: 'POST',
    data: payload,
  });
}

export async function checkExistingUserName(payload) {
  return request('/api/joiningformalitiestenant/check-existing-username', {
    method: 'POST',
    data: payload,
  });
}

export async function createEmployee(payload) {
  return request('/api/joiningformalitiestenant/create-employee', {
    method: 'POST',
    data: payload,
  });
}

export async function getListNewComer(payload) {
  return request('/api/joiningformalitiestenant/get-list-new-comer', {
    method: 'POST',
    data: payload,
  });
}

export async function getSettingEmployeeId(payload) {
  return request('/api/joiningformalitiestenant/get-list-setting-employeeId', {
    method: 'POST',
    data: payload,
  });
}

export async function updateSettingEmployeeId(payload) {
  return request('/api/joiningformalitiestenant/update-setting-employeeId', {
    method: 'POST',
    data: payload,
  });
}

export async function getCandidateById(payload) {
  return request('/api/joiningformalitiestenant/get-candidate-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getDomain() {
  return request('/api/domaintenant', {
    method: 'GET',
  });
}

export async function getIdGenerate(params) {
  return request('/api/locationtenant', {
    method: 'GET',
    params,
  });
}

export async function updateIdGenerate(payload) {
  return request('/api/locationtenant', {
    method: 'PATCH',
    data: payload,
  });
}
