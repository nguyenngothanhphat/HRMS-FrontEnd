import request from '@/utils/request';

export async function addTeamMember() {
  return request('/api/candidate/add-new-member', {
    method: 'POST',
  });
}

export async function sentForApproval(payload) {
  return request('/api/candidate/sent-for-approval', {
    method: 'POST',
    data: payload,
  });
}

export async function approveFinalOffer(payload) {
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

export async function removeTemplate(payload) {
  return request('/api/template/remove', {
    method: 'POST',
    data: payload, // _id
  });
}

export async function createFinalOffer(payload) {
  return request('/api/template/offer-letter', {
    method: 'POST',
    data: payload, // offer data
  });
}

export async function checkDocument(payload) {
  return request('/api/template/document-check', {
    method: 'POST',
    data: payload, // {candidate: id, document: id, candidateDocumentStatus: 1}
  });
}
