import request from '@/utils/request';
import { API_KEYS } from '../../config/proxy.js';

export async function getOffAllTicketList(payload) {
  return request(
    '/api-ticket/tickettenant/list',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
export async function deleteTicketAll(payload) {
  return request(
    '/api-ticket/tickettenant/delete-all',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
export async function getTicketById(payload) {
  return request(
    `/api-ticket/tickettenant/get-by-id`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
export async function addTicket(payload) {
  return request(
    `/api-ticket/tickettenant/add`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
export async function updateTicket(payload) {
  return request(
    `/api-ticket/tickettenant/update`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
export async function addChat(payload) {
  return request(
    `/api-ticket/tickettenant/chat`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
export async function getOffToTalList(payload) {
  return request(
    `/api-ticket/tickettenant/summary-priority`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
export async function uploadFile(data) {
  return request('/api/attachments/upload', {
    method: 'POST',
    data,
  });
}
export async function getListEmployee(payload) {
  return request('/api/employeetenant/list-by-single-company', {
    method: 'POST',
    data: payload,
  });
}
export async function getListMyTeam(payload) {
  return request('/api/employeetenant/list-myteam', {
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

export async function getSupportTeamList(payload) {
  return request('/api/settingtickettenant/list', {
    method: 'GET',
    params: payload,
  });
}

export async function deleteOneTicket(payload) {
  return request(
    '/api-ticket/tickettenant/delete-one',
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.TICKET_API,
  );
}
