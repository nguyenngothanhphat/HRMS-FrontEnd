import request from '@/utils/request';
import { API_KEYS } from '../../config/proxy';

export async function getProjectList(payload) {
  return request(
    `/api-project/projecttenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getProjectNameList(payload) {
  return request(
    `/api-project/projecttenant/list-project-name`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
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
    API_KEYS.PROJECT_API,
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
    API_KEYS.PROJECT_API,
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
    API_KEYS.PROJECT_API,
  );
}

export async function updateProject(payload) {
  return request(
    `/api-project/projecttenant/update-project`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function deleteProject(payload) {
  return request(
    `/api-project/projecttenant/delete-project`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
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
    API_KEYS.CUSTOMER_API,
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
    API_KEYS.PROJECT_API,
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
    API_KEYS.PROJECT_API,
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
    API_KEYS.PROJECT_API,
  );
}

export async function getSkillList() {
  return request('/api/skilltype/list', {
    method: 'POST',
  });
}

export async function getDivisionList(payload) {
  return request('/api/departmenttenant/get-all-division', {
    method: 'GET',
    params: payload,
  });
}

export async function getCustomerInfo(payload) {
  return request(
    `/api-customer/customertenant/get-customer-info`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function getListProjectToExport(payload) {
  return request(
    `/api-project/projecttenant/export-projects`,
    {
      method: 'GET',
      params: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}
