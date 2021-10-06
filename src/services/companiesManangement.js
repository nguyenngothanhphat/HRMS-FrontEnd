import { request } from '@/utils/request';

export async function getCompaniesList(payload) {
  return request('/api/companytenant/list-of-user', {
    method: 'POST',
    data: payload,
  });
}

export async function getCompanyDetails(payload) {
  return request('/api/companytenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationsList(payload) {
  return request('/api/locationtenant/get-by-company', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationsListTenant(payload) {
  return request('/api/locationtenant/get-by-company-tenant', {
    method: 'POST',
    data: payload,
  });
}

export async function updateCompany(payload) {
  return request('/api/companytenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addMultiLocation(payload) {
  return request('/api/locationtenant/add-multi', {
    method: 'POST',
    data: payload,
  });
}

export async function addLocation(payload) {
  return request('/api/locationtenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateLocation(payload) {
  return request('/api/locationtenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function upsertLocationsList(payload) {
  return request('/api/locationtenant/upsert', {
    method: 'POST',
    data: payload.locations,
  });
}

export async function removeLocation(payload) {
  return request('/api/locationtenant/remove', {
    method: 'POST',
    data: payload,
  });
}

export async function addCompanyTenant(payload) {
  return request('/api/companytenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getCompanyTypeList() {
  return request('/api/companytype/list', {
    method: 'POST',
  });
}

export async function getIndustryList() {
  return request('/api/industry/list', {
    method: 'POST',
  });
}
