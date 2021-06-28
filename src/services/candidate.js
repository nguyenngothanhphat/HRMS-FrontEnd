import request from '@/utils/request';

export function getCandidate(payload) {
  return request('/api/candidatetenant/get-by-ticket', {
    method: 'POST',
    data: payload,
  });
}

export function getDocumentByCandidate(payload) {
  return request('/api/documenttenant/get-by-candidate', {
    method: 'POST',
    data: payload,
  });
}

export function getById(params) {
  return request('/api/candidatetenant/get-by-id', {
    method: 'POST',
    data: params,
  });
}

export function updateByCandidate(params) {
  return request('/api/candidatetenant/update-by-candidate', {
    method: 'POST',
    data: params,
  });
}

export function addAttachmentService(params) {
  return request('/api/candidatetenant/add-attachment-candidate', {
    method: 'POST',
    data: params,
  });
}

export function getWorkHistory(params) {
  return request('/api/workhistorytenant/get-by-candidate', {
    method: 'POST',
    data: params,
  });
}

export function updateWorkHistory(params) {
  return request('/api/workhistorytenant/update', {
    method: 'POST',
    data: params,
  });
}

export function sendEmailByCandidateModel(params) {
  return request('/api/candidatetenant/phase-one-candidate', {
    method: 'POST',
    data: params,
  });
}

export function candidateFinalOffer(payload) {
  return request('/api/candidatetenant/candidate-final-offer', {
    method: 'POST',
    data: payload,
  });
}
