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
