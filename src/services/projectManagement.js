import { request } from '@/utils/request';

export async function getProjectList(payload) {
  return request(
    `/api-project/projecttenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    'PROJECT_API',
  );
}

export async function getStatusSummary(payload) {
  return request(
    `/api-project/projecttenant/get-status-summary`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    'PROJECT_API',
  );
}

export async function generateProjectId(payload) {
  return request(
    `/api-project/projecttenant/gen-project-id`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    'PROJECT_API',
  );
}

export async function addProject(payload) {
  return request(
    `/api-project/projecttenant/add`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    'PROJECT_API',
  );
}

export async function getCustomerList(payload) {
  return request(
    `/api-customer/customertenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    'PROJECT_API',
  );
}

export async function getProjectTypeList(payload) {
  return request(
    `/api-project/projecttenant/list-project-types`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    'PROJECT_API',
  );
}

export async function getProjectStatusList(payload) {
  return request(
    `/api-project/projecttenant/list-project-statuses`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    'PROJECT_API',
  );
}

export async function getTagList(payload) {
  return request(
    `/api-project/tagtenant/default-list`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    'PROJECT_API',
  );
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
