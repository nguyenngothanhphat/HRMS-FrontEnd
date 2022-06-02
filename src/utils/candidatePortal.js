export const CANDIDATE_TASK_LINK = {
  REVIEW_PROFILE: 'review-profile',
  UPLOAD_DOCUMENTS: 'upload-documents',
  SALARY_NEGOTIATION: 'salary-negotiation',
  ACCEPT_OFFER: 'accept-offer',
  REFERENCES: 'references',
};
export const PORTAL_TAB_NAME = {
  DASHBOARD: 'dashboard',
  MESSAGES: 'messages',
  CHANGE_PASSWORD: 'change-password',
};
export const CANDIDATE_TASK_STATUS = {
  IN_PROGRESS: 'IN-PROGRESS', // doing
  DONE: 'DONE', // done
  RE_SUBMIT: 'RE-SUBMIT', // need to submit again
  UPCOMING: 'UPCOMING', // new, no need to do at present
  REJECTED: 'REJECTED', // rejected
  RE_NEGOTIATE: 'RE-NEGOTIATE', // for salary structure
};
export const ADDRESS_VARIABLES = [
  'AddressLine1',
  'AddressLine2',
  'Country',
  'State',
  'City',
  'ZipCode',
];
export const ADDRESS_TYPE = {
  CURRENT: 'current',
  PERMANENT: 'permanent',
};

export const DOCUMENT_TYPES = {
  VERIFYING: 'VERIFYING',
  VERIFIED: 'VERIFIED',

  RESUBMIT_PENDING: 'RESUBMIT-PENDING',
  RE_SUBMITTED: 'RE-SUBMITTED',

  NOT_AVAILABLE_PENDING_HR: 'NOT-AVAILABLE-PENDING-HR',
  NOT_AVAILABLE_ACCEPTED: 'NOT-AVAILABLE-ACCEPTED',
  NOT_AVAILABLE_REJECTED: 'NOT-AVAILABLE-REJECTED',
};
