import { request } from '@/utils/request';
// audit trail

export async function getAuditTrail1(payload) {
  return request(`/api-project/audittrailtenant/list`, {
    method: 'POST',
    data: payload,
  });
}

export async function getAuditTrail(payload) {
  return request(`/api-project/audittrailtenant/list`, {
    method: 'POST',
    data: payload,
  });
}
