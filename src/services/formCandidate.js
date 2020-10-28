import request from '@/utils/request';

export async function getRookieInfo(params) {
  return request('/api/candidate/add-new-member', {
    method: 'POST',
  });
}

export async function sentForApproval(payload) {
  console.log(payload);
  return request('/api/candidate/sent-for-approval', {
    method: 'POST',
    data: payload,
  });
}

export async function approveFinalOffer(payload) {
  console.log(payload);
  return request('/api/candidate/approve-final-offer', {
    method: 'POST',
    data: payload,
  });
}

export async function getTemplates() {
  return request('/api/template/list', {
    method: 'POST',
  });
}
