import { request } from '@/utils/request';

export async function listProjectByCompany(payload) {
  return request('/api/projecttenant/list-by-company', {
    method: 'POST',
    data: payload, // {company: id}
  });
}

export async function addProjectMember(payload) {
  return request('/api/projecttenant/add-member', {
    method: 'POST',
    data: payload, //
  });
}

export async function getProjectById(payload) {
  return request('/api/projecttenant/get-by-id', {
    method: 'POST',
    data: payload, //
  });
}

export async function updateProject(payload) {
  return request('/api/projecttenant/update', {
    method: 'POST',
    data: payload, //
  });
}

export async function listProjectRole() {
  return request('/api/projecttenant/list-role', {
    method: 'POST',
  });
}

export async function addProject(payload) {
  return request('/api/projecttenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeProjectMember(payload) {
  return request('/api/projecttenant/remove-member', {
    method: 'POST',
    data: payload,
  });
}

export async function getReportingManagerList(params) {
  return request('/api/employeetenant/list-manager', {
    method: 'POST',
    data: params,
  });
}
