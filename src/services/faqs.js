import request from '@/utils/request';

export async function addCategory(payload) {
  return request('/api/faqstenant/add-category', {
    method: 'POST',
    data: payload,
  });
}

export async function getListCategory(payload) {
  return request('/api/faqstenant/get-list-category', {
    method: 'POST',
    data: payload,
  });
}

export async function updateCategory(payload) {
  return request('/api/faqstenant/update-category', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteCategory(payload) {
  return request('/api/faqstenant/delete-category', {
    method: 'POST',
    data: payload,
  });
}

export async function addQuestion(payload) {
  return request('/api/faqstenant/add', {
    method: 'POST',
    data: payload,
  });
}

export async function getListFAQ(payload) {
  return request('/api/faqstenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function updateQuestion(payload) {
  return request('/api/faqstenant/update', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteQuestion(payload) {
  return request('/api/faqstenant/delete', {
    method: 'POST',
    data: payload,
  });
}

export async function getLocationListByParentCompany(payload) {
  return request('/api/locationtenant/list-by-company-parent', {
    method: 'POST',
    data: payload,
  });
}
