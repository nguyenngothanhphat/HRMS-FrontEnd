import request from '@/utils/request';

export async function addTeamMember(payload) {
  return request('/api/candidatetenant/add-new-member', {
    method: 'POST',
    data: payload,
  });
}

export async function sentForApproval(payload) {
  return request('/api/candidatetenant/sent-for-approval', {
    method: 'POST',
    data: payload,
  });
}

export async function approveFinalOffer(payload) {
  return request('/api/candidatetenant/approve-final-offer', {
    method: 'POST',
    data: payload,
  });
}

export async function getTemplates(payload) {
  return request('/api/templatetenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function removeTemplate(payload) {
  return request('/api/templatetenant/remove', {
    method: 'POST',
    data: payload, // _id
  });
}

export async function getDefaultTemplateList(payload) {
  return request('/api/templatetenant/get-default', {
    method: 'POST',
    data: payload,
  });
}

export async function getCustomTemplateList(payload) {
  return request('/api/templatetenant/get-custom', {
    method: 'POST',
    data: payload,
  });
}

export async function createFinalOffer(payload) {
  return request('/api/templatetenant/offer-letter', {
    method: 'POST',
    data: payload, // offer data
  });
}

export async function checkDocument(payload) {
  return request('/api/candidatetenant/document-check', {
    method: 'POST',
    data: payload, // {candidate: id, document: id, candidateDocumentStatus: 1}
  });
}

export async function verifyAllDocuments(payload) {
  return request('/api/candidatetenant/update-documents-status', {
    method: 'POST',
    data: payload,
  });
}

export async function sendDocumentStatus(payload) {
  return request('/api/candidatetenant/background-check', {
    method: 'POST',
    data: payload, // {candidate: id, options: 1, comments: ''}
  });
}

export async function getAdditionalQuestion() {
  return request('/api/onboardingquestion/list', {
    method: 'POST',
  });
}
