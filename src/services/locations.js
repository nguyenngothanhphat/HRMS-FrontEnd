import request from '@/utils/request';

export default function queryLocation(option) {
  return request('/server/api/api/location/list', {
    method: 'POST',
    data: { ...option },
  });
}

export function updateGeneral(data) {
  return request('/server/api/api/location/update-general', {
    method: 'POST',
    data: {
      ...data,
    },
  });
}

export function updateFinancier(data) {
  return request('/server/api/api/location/update-financier', {
    method: 'POST',
    data: {
      ...data,
    },
  });
}

export function saveLocation(data) {
  return request('/server/api/api/location/add', {
    method: 'POST',
    data: {
      ...data,
    },
  });
}

export function getLocationByID(id) {
  return request('/server/api/api/location/get-by_id', {
    method: 'POST',
    data: { id },
  });
}

export function removeLocationById(id) {
  return request('/server/api/api/location/remove', {
    method: 'POST',
    data: { id },
  });
}

export function getAllCountry() {
  return request('/server/api/api/country/list', {
    method: 'POST',
  });
}
