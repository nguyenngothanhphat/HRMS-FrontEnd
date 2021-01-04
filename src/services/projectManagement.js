import request from '@/utils/request';

export async function listProjectByCompany(payload) {
  return request('/api/project/list-by-company', {
    method: 'POST',
    data: payload, // {company: id}
  });
}

export async function addProjectMember(payload) {
  return request('/api/project/add-member', {
    method: 'POST',
    data: payload, //
  });
}

export async function listProjectRole() {
  return request('/api/project/list-role', {
    method: 'POST',
  });
}
