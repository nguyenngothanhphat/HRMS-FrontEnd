const CANDIDATE_TASK_LINK = {
  REVIEW_PROFILE: 'review-profile',
  UPLOAD_DOCUMENTS: 'upload-documents',
  SALARY_NEGOTIATION: 'salary-negotiation',
  ACCEPT_OFFER: 'accept-offer',
};
const PORTAL_TAB_NAME = {
  DASHBOARD: 'dashboard',
  MESSAGES: 'messages',
  CHANGE_PASSWORD: 'change-password',
};
const CANDIDATE_TASK_STATUS = {
  IN_PROGRESS: 'IN-PROGRESS', // doing
  DONE: 'DONE', // done
  RE_SUBMIT: 'RE-SUBMIT', // need to submit again
  UPCOMING: 'UPCOMING', // new, no need to do at present
  REJECTED: 'REJECTED', // rejected
  RE_NEGOTIATE: 'RE-NEGOTIATE', // for salary structure
};
export { CANDIDATE_TASK_LINK, PORTAL_TAB_NAME, CANDIDATE_TASK_STATUS };
