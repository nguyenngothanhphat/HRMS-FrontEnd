import request from '@/utils/request';
import { API_KEYS } from '../../config/proxy';

export async function getProjectByID(payload) {
  return request(
    `/api-project/projecttenant/get-by-id`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}
// overview
export async function updateProjectOverview(payload) {
  return request(
    `/api-project/projecttenant/edit-overview`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getProjectTagList(payload) {
  return request(
    `/api-project/tagtenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function addProjectHistory(payload) {
  return request(
    `/api-project/projecthistorytenant/add`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getProjectHistoryList(payload) {
  return request(
    `/api-project/projecthistorytenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

// milestone
export async function getMilestoneList(payload) {
  return request(
    `/api-project/milestonetenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}
export async function addMilestone(payload) {
  return request(
    `/api-project/milestonetenant/add`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}
export async function updateMilestone(payload) {
  return request(
    `/api-project/milestonetenant/update`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}
export async function removeMilestone(payload) {
  return request(
    `/api-project/milestonetenant/remove`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

// resources
export async function getResourceTypeList(payload) {
  return request(
    `/api-project/resourcetypetenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function addResourceType(payload) {
  return request(
    `/api-project/resourcetypetenant/add`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getTechnologyList(payload) {
  return request(
    `/api-project/technologytenant/default-list`,
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

export async function getTitleList(payload) {
  return request('/api/titletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getDivisionList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getBillingStatusList(payload) {
  return request(
    '/api-project/resourcetenant/list-status',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

// resoures + project
export async function getResourceList(payload) {
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

export async function addResource(payload) {
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

export async function assignResources(payload) {
  return request(
    '/api-project/resourcetenant/add-multi',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function countStatusResource(payload) {
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

export async function getResourceOfProject(payload) {
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

export async function updateResourceOfProject(payload) {
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

export async function removeResourceOfProject(payload) {
  return request(
    '/api-project/resourcetenant/delete',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

// documents
export async function getDocumentList(payload) {
  return request(
    `/api-project/documenttenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function addDocument(payload) {
  return request(
    `/api-project/documenttenant/add`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function removeDocument(payload) {
  return request(
    `/api-project/documenttenant/remove`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

export async function getDocumentTypeList(payload) {
  return request(
    `/api-project/documenttenant/list-doc-types`,
    {
      method: 'GET',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

// audit trail
export async function getAuditTrailList(payload) {
  return request(
    `/api-project/audittrailtenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}

// other
export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
