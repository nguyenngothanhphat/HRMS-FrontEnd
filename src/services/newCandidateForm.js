import request from '@/utils/request';
import { API_KEYS } from '../../config/proxy';

// const jobGradeLevelList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export function getGradeList(params) {
  return request('/api/gradetenant/list', {
    method: 'POST',
    data: params,
  });
}

export function SendEmail(payload) {
  return request('/api/', {
    method: 'POST',
    data: payload,
  });
}

export function getDocumentList() {
  return request('/api/document/list-default-checklist', {
    method: 'POST',
  });
}

export function getDepartmentList(params) {
  return request('/api/departmenttenant/list-by-company', {
    method: 'POST',
    data: params,
  });
}

export async function fetchDepartmentList(payload) {
  return request('/api/departmenttenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getTitleListByDepartment(payload) {
  return request('/api/titletenant/list-by-department', {
    method: 'POST',
    data: payload,
  });
}

export function getLocation() {
  return request('/api/locationtenant/list-all', {
    method: 'POST',
  });
}

export async function getLocationList(payload) {
  return request('/api/locationtenant/list', {
    method: 'POST',
    data: payload,
  });
}

export function getEmployeeTypeList() {
  return request('/api/employeetype/list', {
    method: 'POST',
  });
}

export async function getReportingManagerList(params) {
  return request('/api/employeetenant/list-manager', {
    method: 'POST',
    data: params,
  });
}
export function getListCandidate(params) {
  return request('/api/candidatetenant/list', {
    method: 'POST',
    data: params,
  });
}
export function getCandidateManagerList(params) {
  return request('/api/candidatetenant/get-candidate-manager', {
    method: 'POST',
    data: params,
  });
}

export function addCandidate(params) {
  return request('/api/candidatetenant/add-new-member', {
    method: 'POST',
    data: params,
  });
}

export function updateByHR(params) {
  return request('/api/candidatetenant/update-by-hr', {
    method: 'POST',
    data: params,
  });
}

export function submitBasicInfo(params) {
  return request('/api/candidatetenant/basic-info', {
    method: 'POST',
    data: params,
  });
}

export function getById(params) {
  return request('/api/candidatetenant/get-by-id', {
    method: 'POST',
    data: params,
  });
}

export function getDocumentByCandidate(params) {
  return request('/api/documenttenant/get-by-candidate', {
    method: 'POST',
    data: params,
  });
}

export function submitPhase1(payload) {
  return request('/api/candidatetenant/phase-one-hr', {
    method: 'POST',
    data: payload,
  });
}

export function generateLink(payload) {
  return request('/api/candidatetenant/generate-link', {
    method: 'POST',
    data: payload,
  });
}

export function getLocationListByCompany(params) {
  return request('/api/locationtenant/get-by-company', {
    method: 'POST',
    data: params,
  });
}

export function getSalaryStructureList(payload) {
  return request('/api/salarystructuretenant/get-by-title', {
    method: 'POST',
    data: payload,
  });
}

export function getTitleListByCompany(params) {
  return request('/api/titletenant/list-by-company', {
    method: 'POST',
    data: params,
  });
}

export function getTableDataByGrade(params) {
  // console.log(params);
  return request('/api/salarystructuretenant/get-by-grade', {
    method: 'POST',
    data: params,
  });
}

export function closeCandidate(params) {
  // console.log(params);
  return request('/api/candidatetenant/close-candidate', {
    method: 'POST',
    data: params,
  });
}

export function editSalaryStructure(params) {
  return request('/api/candidatetenant/edit-salarystructure', {
    method: 'POST',
    data: params,
  });
}

export function addManagerSignature(params) {
  // console.log(params);
  return request('/api/candidatetenant/add-manager-signature', {
    method: 'POST',
    data: params,
  });
}

export function addSchedule(params) {
  // console.log(params);
  return request('/api/candidatetenant/schedule', {
    method: 'POST',
    data: params,
  });
}

// extend offer letter
export function extendOfferLetter(params) {
  return request('/api/candidatetenant/extend-offer-date', {
    method: 'POST',
    data: params,
  });
}

export function withdrawOffer(params) {
  return request('/api/candidatetenant/withdraw-ticket', {
    method: 'POST',
    data: params,
  });
}

export async function getDocumentSettingList(payload) {
  return request('/api/documentcompanytenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function getListBenefit(payload) {
  return request('/api/benefittenant/list', {
    method: 'POST',
    data: payload,
  });
}

// references
export function sendNoReferences(payload) {
  return request('/api/referencetenant/number-of-references', {
    method: 'POST',
    data: payload,
  });
}

// new document verification
export async function getDocumentLayoutByCountry(payload) {
  return request('/api/candidatetenant/get-documents-by-country', {
    method: 'POST',
    data: payload,
  });
}

export async function getReferencesByCandidate(params) {
  return request('api/referencetenant/get-by-candidate', {
    method: 'GET',
    params,
  });
}

export async function getLocationCustomer(payload) {
  return request(
    `/api-customer/customertenant/get-location-no-auth`,
    {
      method: 'POST',
      data: payload,
    },
    false,
    API_KEYS.CUSTOMER_API,
  );
}

export async function getDocumentsCheckList(params) {
  return request('api/documenttenant/checklist', {
    method: 'GET',
    params,
  });
}

export async function sendDocumentCheckList(data) {
  return request('api/candidatetenant/add-documents-checklist', {
    method: 'POST',
    data,
  });
}

export async function addTeamMember(payload) {
  return request('/api/candidatetenant/add-new-member', {
    method: 'POST',
    data: payload,
  });
}

export async function sentForApproval(payload) {
  return request('/api/candidatetenant/sent-for-approval', {
    method: 'POST',
    data: payload,
  });
}

export async function approveFinalOffer(payload) {
  return request('/api/candidatetenant/approve-final-offer', {
    method: 'POST',
    data: payload,
  });
}

export async function getTemplates(payload) {
  return request('/api/templatetenant/list', {
    method: 'POST',
    data: payload,
  });
}

export async function removeTemplate(payload) {
  return request('/api/templatetenant/remove', {
    method: 'POST',
    data: payload, // _id
  });
}

export async function getDefaultTemplateList(payload) {
  return request('/api/templatetenant/get-default', {
    method: 'POST',
    data: payload,
  });
}

export async function getCustomTemplateList(payload) {
  return request('/api/templatetenant/get-custom', {
    method: 'POST',
    data: payload,
  });
}

export async function createFinalOffer(payload) {
  return request('/api/templatetenant/offer-letter', {
    method: 'POST',
    data: payload, // offer data
  });
}

export async function checkDocument(payload) {
  return request('/api/candidatetenant/document-check', {
    method: 'POST',
    data: payload, // {candidate: id, document: id, candidateDocumentStatus: 1}
  });
}

export async function verifyAllDocuments(payload) {
  return request('/api/candidatetenant/update-documents-status', {
    method: 'POST',
    data: payload,
  });
}

export async function sendDocumentStatus(payload) {
  return request('/api/candidatetenant/background-check', {
    method: 'POST',
    data: payload, // {candidate: id, options: 1, comments: ''}
  });
}

export async function getAdditionalQuestion() {
  return request('/api/onboardingquestion/list', {
    method: 'POST',
  });
}
