import request from '@/utils/request';

export default function getListRoles() {
  return request('/api/role/list', {
    method: 'POST',
  });
}
