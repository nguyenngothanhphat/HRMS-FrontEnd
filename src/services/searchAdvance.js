import request from '@/utils/request';

export async function searchGlobal(payload) {
  return request('/api/searchtenant/global-search', {
    method: 'POST',
    data: payload,
  });
}

export async function searchEmployee(payload) {
  return request('/api/searchtenant/employees-advance-search', {
    method: 'POST',
    data: payload,
  });
}

export async function searchTicket(payload) {
  return request('/api/searchtenant/tickets-advance-search', {
    method: 'POST',
    data: payload,
  });
}
export async function searchDocument(payload) {
  return request('/api/searchtenant/docs-advance-search', {
    method: 'POST',
    data: payload,
  });
}
// get list dèault
export async function getListEmployeeType(payload) {
  return request('/api/employeetype/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getListLocation(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}
export async function getListDepartment(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}
export async function getTitleByCompany(payload) {
  return request('/api/titletenant/list-by-company', {
    method: 'POST',
    data: payload,
  });
}
export async function getTitleByDepartment(payload) {
  return request('/api/titletenant/list-by-department', {
    method: 'POST',
    data: payload,
  });
}
