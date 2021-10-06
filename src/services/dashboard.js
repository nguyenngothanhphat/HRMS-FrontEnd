import { request } from '@/utils/request';

export async function getListTicket(payload) {
  return request('/api/approvaltenant/get-list-ticket', {
    method: 'POST',
    data: payload,
  });
}
export async function aprovalLeaveRequest(payload) {
  return request('/api/leaverequesttenant/reporting-manager-approve', {
    method: 'POST',
    data: payload,
  });
}
export async function rejectLeaveRequest(payload) {
  return request('/api/leaverequesttenant/reporting-manager-reject', {
    method: 'POST',
    data: payload,
  });
}
export async function aprovalCompoffRequest(payload) {
  return request('/api/compoffrequesttenant/approve-compoff-request', {
    method: 'POST',
    data: payload,
  });
}
export async function rejectCompoffRequest(payload) {
  return request('/api/compoffrequesttenant/reject-compoff-request', {
    method: 'POST',
    data: payload,
  });
}
