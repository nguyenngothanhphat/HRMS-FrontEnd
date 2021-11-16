import { request } from '@/utils/request';
// audit trail

export async function getProjectByID(payload) {
  return request(`/api-project/projecttenant/get-by-id`, {
    method: 'POST',
    data: payload,
  });
}
// overview
export async function updateProjectOverview(payload) {
  return request(`/api-project/projecttenant/edit-overview`, {
    method: 'POST',
    data: payload,
  });
}

export async function getProjectTagList(payload) {
  return request(`/api-project/tagtenant/list`, {
    method: 'POST',
    data: payload,
  });
}

// milestone
export async function getMilestoneList(payload) {
  return request(`/api-project/milestonetenant/list`, {
    method: 'POST',
    data: payload,
  });
}
export async function addMilestone(payload) {
  return request(`/api-project/milestonetenant/add`, {
    method: 'POST',
    data: payload,
  });
}
export async function updateMilestone(payload) {
  return request(`/api-project/milestonetenant/update`, {
    method: 'POST',
    data: payload,
  });
}

// resources
export async function getResourceTypeList(payload) {
  return request(`/api-project/resourcetypetenant/list`, {
    method: 'POST',
    data: payload,
  });
}

export async function addResourceType(payload) {
  return request(`/api-project/resourcetypetenant/add`, {
    method: 'POST',
    data: payload,
  });
}

export async function getTechnologyList(payload) {
  return request(`/api-project/technologytenant/default-list`, {
    method: 'GET',
    data: payload,
  });
}

export async function getTitleList(payload) {
  return request('/api/titletenant/list', {
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

// documents
export async function getDocumentList(payload) {
  return request(`/api-project/documenttenant/list`, {
    method: 'POST',
    data: payload,
  });
}

export async function addDocument(payload) {
  return request(`/api-project/documenttenant/add`, {
    method: 'POST',
    data: payload,
  });
}

export async function removeDocument(payload) {
  return request(`/api-project/documenttenant/remove`, {
    method: 'POST',
    data: payload,
  });
}

export async function getDocumentTypeList(payload) {
  return request(`/api-project/documenttenant/list-doc-types`, {
    method: 'GET',
    data: payload,
  });
}

// audit trail
export async function getAuditTrailList(payload) {
  return request(`/api-project/audittrailtenant/list`, {
    method: 'POST',
    data: payload,
  });
}
