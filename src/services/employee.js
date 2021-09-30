import { request } from '@/utils/request';

export async function getFilterList(payload) {
  return request('/api/companytenant/list-filter-parent', {
    method: 'POST',
    data: payload,
  });
}

export async function LocationFilter(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function LocationOwnerFilter(payload) {
  return request('/api/locationtenant/list-by-company-parent', {
    method: 'POST',
    data: payload,
  });
}

export async function EmployeeTypeFilter(payload) {
  return request('/api/employeetype/list', {
    method: 'POST',
    data: payload,
  });
}

export async function DepartmentFilter(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getListEmployee(payload) {
  return request('/api/employeetenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getListExportEmployees(payload) {
  return request('/api/employeetenant/export-csv', {
    method: 'POST',
    data: payload,
  });
}

export async function getDataOrgChart(payload) {
  return request('/api/employeetenant/get-chart-organisation', {
    method: 'POST',
    data: payload,
  });
}

export async function getListAdministrator(payload) {
  return request('/api/employee/list-administrator', {
    method: 'POST',
    data: payload,
  });
}
