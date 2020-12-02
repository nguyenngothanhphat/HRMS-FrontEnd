import request from '@/utils/request';

export default async function listProjectByCompany(payload) {
  return request('/api/project/list-by-company', {
    method: 'POST',
    data: payload, // {company: id}
  });
}
