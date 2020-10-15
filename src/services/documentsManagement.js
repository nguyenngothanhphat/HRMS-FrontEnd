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
