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
  return request('/api/titletenant/list', {
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

// get list employee
export async function getEmployeeList(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}

// grades
export async function getListGrade(payload) {
  return request('/api/gradetenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function addGrade(payload) {
  return request('/api/gradetenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateGrade(payload) {
  return request('/api/gradetenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function removeGrade(payload) {
  return request('/api/gradetenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function getGradeByID(payload) {
  return request('/api/gradetenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function setEmailDomain(payload) {
  return request('/api/companytenant/set-email-domain', {
    method: 'POST',
    data: payload,
  });
}

export async function getCompanyById(payload) {
  return request('/api/companytenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

// ticket management
export async function getSettingTicketList(payload) {
  return request('/api/settingtickettenant/list', {
    method: 'GET',
    params: payload,
  });
}

export async function getSettingTicketById(payload) {
  return request('/api/settingtickettenant/get-by-id', {
    method: 'GET',
    params: payload,
  });
}

export async function removeSettingTicket(payload) {
  return request('/api/settingtickettenant/inactive', {
    method: 'POST',
    data: payload,
  });
}

export async function upsertSettingTicket(payload) {
  return request('/api/settingtickettenant/upsert', {
    method: 'POST',
    data: payload,
  });
}

export async function getDomains() {
  return request('/api/domaintenant', {
    method: 'GET',
  });
}

export async function setDomains(payload) {
  return request('/api/domaintenant/multiple', {
    method: 'POST',
    data: payload,
  });
}

export async function removeDomains(params) {
  return request('/api/domaintenant', {
    method: 'DELETE',
    params,
  });
}
