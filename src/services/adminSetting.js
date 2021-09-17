import request from '@/utils/request';

export async function getRoleList(payload) {
  return request('/api/roletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getPermissionList(payload) {
  return request('/api/permission/list', {
    method: 'POST',
    data: payload,
  });
}

export async function addRole(payload) {
  return request('/api/roletenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function removeRole(payload) {
  return request('/api/roletenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getListTitle(payload) {
  return request('/api/titletenant/list-by-company', {
    method: 'POST',
    data: payload,
  });
}
export async function countEmployee(payload) {
  return request('/api/titletenant/count-employee', {
    method: 'POST',
    data: payload,
  });
}
export async function removeTitle(payload) {
  return request('/api/titletenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getListPermissionOfRole(payload) {
  return request('/api/permission/list', {
    method: 'POST',
    data: payload,
  });
}
export async function updateRole(payload) {
  return request('/api/roletenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getRoleByID(payload) {
  return request('/api/roletenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getListDepartments(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function addPosition(payload) {
  return request('/api/titletenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updatePosition(payload) {
  return request('/api/titletenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getPositionByID(payload) {
  return request('/api/titletenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function addDepartment(payload) {
  return request('/api/departmenttenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getDepartmentByID(payload) {
  return request('/api/departmenttenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function removeDepartment(payload) {
  return request('/api/departmenttenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function updateDepartment(payload) {
  return request('/api/departmenttenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function getRolesByCompany(payload) {
  return request('/api/roletenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function setupComplete() {
  return request('/api/company/setup-complete', {
    method: 'POST',
  });
}
