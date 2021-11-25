import { request } from '@/utils/request';

export async function getResources(payload) {
  return request('/api-project/resourcetenant/list', {
    method: 'POST',
    data: payload,
  });
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
  return request('/api-project/resourcetenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateProjectDetail(payload) {
  return request('/api-project/resourcetenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getProjectList(payload) {
  return request('/api-project/projecttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function updateComment(payload) {
  return request('/api/employeetenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function fetchResourceAvailableStatus(payload) {
  return request('/api-project/resourcetenant/count-status', {
    method: 'POST',
    data: payload,
  });
}

export async function fetchDivisions(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function fetchResourceStatus(payload) {
  return request('api-project/resourcetenant/list-status', {
    method: 'POST',
    data: payload,
  });
}

export async function fetchTitleList(payload) {
  return request('/api/titletenant/list', {
    method: 'POST',
    data: payload,
  });
}

// UTILIZATION
export async function getUtilizationOverviewDivision(payload) {
  return request('/api/employeetenant/utilization-overview-division', {
    method: 'POST',
    data: payload,
  });
}

export async function getUtilizationOverviewTitle(payload) {
  return request('/api/employeetenant/utilization-overview-title', {
    method: 'POST',
    data: payload,
  });
}

export async function getResourceUtilization(payload) {
  return request(
    '/api-project/resourcetenant/utilization',
    {
      method: 'POST',
      data: payload,
    },
    false,
    'PROJECT_API',
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
    'PROJECT_API',
  );
}

export async function getNewJoineesList(payload) {
  return request('/api/joiningformalitiestenant/get-list-new-comer', {
    method: 'POST',
    data: payload,
  });
}