const rookieList = [];

const COLUMN_NAME = {
  ID: 'rookieId',
  NAME: 'name',
  POSITION: 'position',
  LOCATION: 'location',
  DATE_SENT: 'date_sent',
  DATE_RECEIVED: 'date_received',
  COMMENT: 'comment',
  DATE_JOIN: 'date_join',
  ACTION: 'action',
  EXPIRE: 'expire',
  DOCUMENT: 'document',
  RESUBMIT: 'resubmit',
  CHANGE_REQUEST: 'change_request',
  DATE_REQUEST: 'date_request',
  ASSIGN_TO: 'assign_to',
  ASSIGNEE_MANAGER: 'assignee_manager',
  PROCESS_STATUS: 'process_status',
};

// const TABLE_TYPE = {
//   ALL: 'ALL',
//   PENDING_ELIGIBILITY_CHECKS: 'PENDING_ELIGIBILITY_CHECKS', // Pending eligibility checks
//   SENT_ELIGIBILITY_FORMS: 'SENT_ELIGIBILITY_FORMS', // Pending eligibility checks
//   RECEIVED_SUBMITTED_DOCUMENTS: 'RECEIVED_SUBMITTED_DOCUMENTS', // Pending eligibility checks
//   ELIGIBLE_CANDIDATES: 'ELIGIBLE_CANDIDATE',
//   INELIGIBLE_CANDIDATES: 'INELIGIBLE_CANDIDATE',
//   PROVISIONAL_OFFERS: 'PROVISIONAL_OFFER', // Provisional offers
//   SENT_PROVISIONAL_OFFERS: 'SENT_PROVISIONAL_OFFER', // Provisional offers
//   RECEIVED_PROVISIONAL_OFFERS: 'RECEIVED_PROVISIONAL_OFFER', // Provisional offers
//   DISCARDED_PROVISIONAL_OFFERS: 'DISCARDED_PROVISIONAL_OFFERS',
//   AWAITING_APPROVAL: 'AWAITING_APPROVAL',
//   FINAL_OFFERS: 'FINAL_OFFERS',
//   FINAL_OFFERS_DRAFTS: 'FINAL_OFFERS_DRAFTS',
//   PENDING_APPROVALS: 'PENDING_APPROVALS', // Awaiting approval
//   APPROVED_FINAL_OFFERS: 'APPROVED_FINAL_OFFERS', // Awaiting approval
//   REJECTED_FINAL_OFFERS: 'REJECTED_FINAL_OFFERS', // Awaiting approval
//   SENT_FINAL_OFFERS: 'SENT_FINAL_OFFERS', // Final offers
//   ACCEPTED_FINAL_OFFERS: 'ACCEPTED_FINAL_OFFERS', // Final offers
//   DISCARDED_FINAL_OFFERS: 'DISCARDED_FINAL_OFFERS',
//   // New
//   PROVISIONAL_OFFERS_DRAFTS: 'PROVISIONAL_OFFERS_DRAFTS',
//   // FINAL_OFFERS_DRAFTS: 'FINAL_OFFERS_DRAFTS',

//   // SENT_PROVISIONAL_OFFERS
//   ACCEPTED__PROVISIONAL_OFFERS: 'ACCEPTED__PROVISIONAL_OFFERS',
//   RENEGOTIATE_PROVISIONAL_OFFERS: 'RENEGOTIATE_PROVISIONAL_OFFERS',

//   PENDING: 'PENDING',
//   // ELIGIBLE_CANDIDATES
//   // INELIGIBLE_CANDIDATES

//   SENT_FOR_APPROVALS: 'SENT_FOR_APPROVALS',
//   APPROVED_OFFERS: 'APPROVED_OFFERS',

//   // SENT_FINAL_OFFERS
//   // ACCEPTED_FINAL_OFFERS
//   RENEGOTIATE_FINAL_OFFERS: 'RENEGOTIATE_FINAL_OFFERS',

//   // PROVISIONAL_OFFERS
//   // FINAL_OFFERS
// };

const TABLE_TYPE = {
  ALL: 'ALL',
  DRAFT: 'DRAFT',
  PROFILE_VERIFICATION: 'PROFILE_VERIFICATION',
  DOCUMENT_VERIFICATION: 'DOCUMENT_VERIFICATION',
  SALARY_NEGOTIATION: 'SALARY_NEGOTIATION',
  AWAITING_APPROVALS: 'AWAITING_APPROVALS',
  NEEDS_CHANGES: 'NEEDS_CHANGES',
  OFFER_RELEASED: 'OFFER_RELEASED',
  OFFER_ACCEPTED: 'OFFER_ACCEPTED',
  OFFER_REJECTED: 'OFFER_REJECTED',
  OFFER_WITHDRAWN: 'OFFER_WITHDRAWN',
};

export { rookieList, COLUMN_NAME, TABLE_TYPE };
