import { request } from '@/utils/request';

export async function getProjectList(payload) {
  return request(`/api-project/projecttenant/list`, {
    method: 'POST',
    data: payload,
  });
}

export async function generateProjectId(payload) {
  return request(`/api-project/projecttenant/gen-project-id`, {
    method: 'POST',
    data: payload,
  });
}

export async function addProject(payload) {
  return request(`/api-project/projecttenant/add`, {
    method: 'POST',
    data: payload,
  });
}

export async function getCustomerList(payload) {
  return request(`/api-customer/customertenant/list`, {
    method: 'POST',
    data: payload,
  });
}

export async function getProjectTypeList(payload) {
  return request(`/api-project/projecttenant/list-project-types`, {
    method: 'GET',
    data: payload,
  });
}

export async function getProjectStatusList(payload) {
  return request(`/api-project/projecttenant/list-project-statuses`, {
    method: 'GET',
    data: payload,
  });
}

export async function getTagList(payload) {
  return request(`/api-project/tagtenant/default-list`, {
    method: 'GET',
    data: payload,
  });
}

export async function getDepartmentList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
