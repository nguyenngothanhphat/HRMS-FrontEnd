import request from '@/utils/request';

export async function addCategory(payload) {
  return request('/api/faqstenant/category', {
    method: 'POST',
    data: payload,
  });
}

export async function getListCategory(payload) {
  return request('/api/faqstenant/category', {
    method: 'GET',
    params: payload,
  });
}

export async function updateCategory(payload) {
  return request(`/api/faqstenant/category/${payload.id}`, {
    method: 'PATCH',
    data: payload,
  });
}

export async function deleteCategory(payload) {
  return request(`/api/faqstenant/category/${payload.id}`, {
    method: 'DELETE',
  });
}

export async function addQuestion(payload) {
  return request('/api/faqstenant', {
    method: 'POST',
    data: payload,
  });
}

export async function getListFAQ(payload) {
  return request('/api/faqstenant', {
    method: 'GET',
    params: payload,
  });
}

export async function updateQuestion(payload) {
  return request(`/api/faqstenant/${payload.id}`, {
    method: 'PATCH',
    data: payload,
  });
}

export async function deleteQuestion(payload) {
  return request(`/api/faqstenant/${payload.id}`, {
    method: 'DELETE',
  });
}

export async function getListCreator(payload) {
  return request('api/faqstenant/list-users', {
    method: 'GET',
    params: payload,
  });
}
