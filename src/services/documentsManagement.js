import request from '@/utils/request';

export const getListDocuments = async () => {
  return request('/api/document/list', {
    method: 'POST',
  });
};

export const getDocumentDetail = (payload) => {
  return request('/api/document/get-by-id', {
    method: 'POST',
    data: payload,
  });
};

export const uploadDocument = (payload) => {
  return request('/api/document/add', {
    method: 'POST',
    data: payload,
  });
};

export const getEmployeeData = (payload) => {
  return request('/api/employee/get-by-id', {
    method: 'POST',
    data: payload,
  });
};
