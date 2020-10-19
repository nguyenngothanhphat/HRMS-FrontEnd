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

// add document
export const getEmployeeByShortId = async (payload) => {
  return request('/api/employee/get-by-employee-id', {
    method: 'POST',
    data: payload,
  });
};

export const getCountryList = async () => {
  return request('/api/country/list', {
    method: 'POST',
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

export const addPassport = async (payload) => {
  return request('/api/passport/add', {
    method: 'POST',
    data: payload,
  });
};

export const addVisa = async (payload) => {
  return request('/api/visa/add', {
    method: 'POST',
    data: payload,
  });
};

export const addDocument = async (payload) => {
  return request('/api/document/add', {
    method: 'POST',
    data: payload,
  });
};
