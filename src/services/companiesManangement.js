import request from '@/utils/request';

export async function getCompaniesList(payload) {
  return request('/api/company/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getCompanyDetails(payload) {
  return request('/api/company/get-by-id', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationsList(payload) {
  return request('/api/location/get-by-company', {
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
  return request('/api/company/update', {
    method: 'POST',
    data: payload,
  });
}

export async function addLocation(payload) {
  return request('/api/location/add', {
    method: 'POST',
    data: payload,
  });
}

export async function updateLocation(payload) {
  return request('/api/location/update', {
    method: 'POST',
    data: payload,
  });
}

export async function upsertLocationsList(payload) {
  return request('/api/location/upsert', {
    method: 'POST',
    data: payload.locations,
  });
}

export async function removeLocation(payload) {
  return request('/api/location/remove', {
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
