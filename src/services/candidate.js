import request from '@/utils/request';

export function getCandidate(payload) {
  return request('/api/candidate/get-by-ticket', {
    method: 'POST',
    data: payload,
  });
}

export function getDocumentByCandidate(params) {
  return request('/api/document/get-by-candidate', {
    method: 'POST',
    data: params,
  });
}

export function getById(params) {
  return request('/api/candidate/get-by-id', {
    method: 'POST',
    data: params,
  });
}

export function updateByCandidate(params) {
  return request('/api/candidate/update-by-candidate', {
    method: 'POST',
    data: params,
  });
}

export function phaseOneCandidate(payload) {
  return request('/api/candidate/phase-one-candidate', {
    method: 'POST',
    data: payload,
  });
}

export function addAttachmentService(params) {
  return request('/api/candidate/add-attachment-candidate', {
    method: 'POST',
    data: params,
  });
}

export function getWorkHistory(params) {
  return request('/api/workhistory/get-by-candidate', {
    method: 'POST',
    data: params,
  });
}

export function sendEmailByCandidateModel(params) {
  return request('/api/candidate/phase-one-candidate', {
    method: 'POST',
    data: params,
  });
}

export function candidateFinalOffer(payload) {
  return request('/api/candidate/candidate-final-offer', {
    method: 'POST',
    data: payload,
  });
}
