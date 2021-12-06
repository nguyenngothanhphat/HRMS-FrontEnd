import request from '@/utils/request';

export async function getListPage(payload) {
  return request('/api/listpageonboardingtenant/get-by-candidate', {
    method: 'POST',
    data: payload,
  });
}

export async function getQuestionByName(payload) {
  return request('/api/questiononboardingtenant/get-by-name', {
    method: 'POST',
    data: payload,
  });
}

export async function getQuestionById(payload) {
  return request('/api/questiononboardingtenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
}
export async function getQuestionByPage(payload) {
  return request('/api/questiononboardingtenant/get-by-page', {
    method: 'POST',
    data: payload,
  });
}
export async function addQuestion(payload) {
  return request('/api/questiononboardingtenant/add', {
    method: 'POST',
    data: payload,
  });
}
export async function updateQuestionByHr(payload) {
  return request('/api/questiononboardingtenant/update', {
    method: 'POST',
    data: payload,
  });
}
export async function updateQuestionByCandidate(payload) {
  return request('/api/questiononboardingtenant/update-by-candidate', {
    method: 'POST',
    data: payload,
  });
}
export async function removeQuestion(payload) {
  return request('/api/questiononboardingtenant/remove-question-candidate', {
    method: 'POST',
    data: payload,
  });
}
