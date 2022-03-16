import { API_KEYS } from '../../config/proxy';
import request from '@/utils/request';

export async function getResources(payload) {
  return request(
    '/api-project/resourcetenant/list',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getListEmployee(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
export async function getDepartmentList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}
export async function postAssignToProject(payload) {
  return request(
    '/api-project/resourcetenant/add',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function updateProjectDetail(payload) {
  return request(
    '/api-project/resourcetenant/update',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getProjectList(payload) {
  return request(
    '/api-project/projecttenant/list',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function updateComment(payload) {
  return request('/api/employeetenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function fetchResourceAvailableStatus(payload) {
  return request(
    '/api-project/resourcetenant/count-status',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function fetchDivisions(payload) {
  return request('/api/departmenttenant/get-all-division', {
    method: 'GET',
    params: payload,
  });
}
export async function fetchResourceStatus(payload) {
  return request(
    'api-project/resourcetenant/list-status',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function fetchTitleList(payload) {
  return request('/api/titletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function fetchStatusProject(payload) {
  return request(
    '/api-project/projecttenant/get-status-summary',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

// UTILIZATION
export async function getUtilizationOverviewDivision(payload) {
  return request('/api/employeetenant/utilization-overview-division', {
    method: 'POST',
    data: payload,
  });
}

export async function fetchProjectListTable(payload) {
  return request(
    '/api-project/resourcetenant/list-project',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getUtilizationOverviewTitle(payload) {
  return request('/api/employeetenant/utilization-overview-title', {
    method: 'POST',
    data: payload,
  });
}

export async function addAndUpdateComments(payload) {
  return request(
    '/api-project/projecttenant/update-comment',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function exportProject(payload) {
  return request(
    '/api-project/resourcetenant/export',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getResourceUtilization(payload) {
  return request(
    '/api-project/resourcetenant/utilization',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getResourceUtilizationChart(payload) {
  return request(
    '/api-project/resourcetenant/utilization-chart',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getNewJoineesList(payload) {
  return request('/api/joiningformalitiestenant/get-list-new-comer', {
    method: 'POST',
    data: payload,
  });
}

export async function exportResource(payload) {
  return request(
    '/api-project/resourcetenant/export-resource',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}
