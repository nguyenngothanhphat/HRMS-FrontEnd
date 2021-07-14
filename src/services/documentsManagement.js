import request from '@/utils/request';

export const getListDocuments = async (payload) => {
  return request('/api/documenttenant/list', {
    method: 'POST',
    data: payload,
  });
};

export const getDocumentDetail = (payload) => {
  return request('/api/documenttenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
};

export async function getCompanyList(payload) {
  return request('/api/companytenant/list', {
    method: 'POST',
    data: payload,
  });
}

// add document
export const getEmployeeByShortId = async (payload) => {
  return request('/api/employeetenant/get-by-employee-id', {
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
  return request('/api/documenttenant/add', {
    method: 'POST',
    data: payload,
  });
};

export const deleteDocument = (payload) => {
  return request('/api/documenttenant/remove', {
    method: 'POST',
    data: payload,
  });
};

export const getEmployeeData = (payload) => {
  return request('/api/employeetenant/get-by-id', {
    method: 'POST',
    data: payload,
  });
};

export const addPassport = async (payload) => {
  return request('/api/passporttenant/add', {
    method: 'POST',
    data: payload,
  });
};

export const addVisa = async (payload) => {
  return request('/api/visatenant/add', {
    method: 'POST',
    data: payload,
  });
};

export const addDocument = async (payload) => {
  return request('/api/documenttenant/add', {
    method: 'POST',
    data: payload,
  });
};

// adhaar card
export const getGeneralInfo = async (payload) => {
  return request('/api/generalinfotenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
};

export const updateGeneralInfo = async (payload) => {
  return request('/api/generalinfotenant/update', {
    method: 'POST',
    data: payload,
  });
};

export const getAdhaarCard = async (payload) => {
  return request('/api/adhaarcardtenant/get-by-employee', {
    method: 'POST',
    data: payload,
  });
};

export const addAdhaarCard = async (payload) => {
  return request('/api/adhaarcardtenant/add', {
    method: 'POST',
    data: payload,
  });
};

export const updateAdhaarCard = async (payload) => {
  return request('/api/adhaarcardtenant/update', {
    method: 'POST',
    data: payload,
  });
};

export const getListDocumentsAccountSetup = (payload) => {
  return request('/api/documentcompany/list-by-company', {
    method: 'POST',
    data: payload,
  });
};

export const addDocumentAccountSetup = (payload) => {
  return request('/api/documentcompany/add', {
    method: 'POST',
    data: payload,
  });
};
