import request from '@/utils/request';
import { API_KEYS } from '../../config/proxy';

export default async function getCustomerInfo(payload) {
  return request(
    `/api-customer/customertenant/get-customer-info`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function getAuditTrail(payload) {
  return request(
    `/api-customer/audittrailtenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function getDocument(payload) {
  return request(
    `/api-customer/documenttenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function uploadDocument(payload) {
  return request(`/api/attachments/upload`, {
    method: 'POST',
    data: payload,
  });
}

export async function addDocument(payload) {
  return request(
    `/api-customer/documenttenant/add`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function filterDocument(payload) {
  return request(
    `/api-customer/documenttenant/filter`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function removeDocument(payload) {
  return request(
    `/api-customer/documenttenant/remove`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function getDocumentType() {
  return request(
    `/api-customer/documenttenant/list-doc-types`,
    {
      method: 'GET',
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function getDivisions(payload) {
  return request(
    `/api-customer/divisiontenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function getDivisionsId(payload) {
  return request(
    `/api-customer/divisiontenant/gen-division-id`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function addDivision(payload) {
  return request(
    `/api-customer/divisiontenant/add`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function updateDivision(payload) {
  return request(
    `/api-customer/divisiontenant/update`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function getNotes(payload) {
  return request(
    `/api-customer/notetenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function filterNotes(payload) {
  return request(
    `/api-customer/notetenant/filter`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function addNotes(payload) {
  return request(
    `/api-customer/notetenant/add`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

// export async function getTagList(payload) {
//   return request(`/api-customer/tagtenant/list`, {
//     method: 'POST',
//     data: payload,
//   });
// }

export async function getTagList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function updateContactInfo(payload) {
  return request(
    `/api-customer/customertenant/update-contact-info`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

// project tab
export async function getProjectList(payload) {
  return request(
    `/api-project/projecttenant/list`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.PROJECT_API,
  );
}
