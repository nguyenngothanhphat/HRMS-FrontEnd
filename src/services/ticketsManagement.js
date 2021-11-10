import { request } from '@/utils/request';

export async function getOffAllTicketList(payload) {
  return request('/api-ticket/tickettenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function addTicket(payload) {
  return request(`/api-ticket/tickettenant/add`, {
    method: 'POST',
    data: payload,
  });
}
export async function addChat(payload) {
  return request(`/api-ticket/tickettenant/chat`, {
    method: 'POST',
    data: payload,
  });
}
export async function getOffToTalList(payload) {
  return request(`/api-ticket/tickettenant/summary-priority`, {
    method: 'POST',
    data: payload,
  });
}

export async function getListEmployee(payload) {
  return request('/api/employeetenant/list-by-single-company', {
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
export async function getLocationList(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}
