import request from '@/utils/request';

export async function searchLocation(option) {
  return request(`/server/apigoogle/place/autocomplete/json`, {
    params: {
      types: 'geocode',
      key: 'AIzaSyCu3QtdmZaVdtgW9hMPuMLFmp6PqfBLNSI',
      ...option,
    },
  });
}

export async function getDetailPlace(option) {
  return request(`/server/apigoogle/place/details/json`, {
    params: {
      fields: 'geometry',
      key: 'AIzaSyCu3QtdmZaVdtgW9hMPuMLFmp6PqfBLNSI',
      ...option,
    },
  });
}
