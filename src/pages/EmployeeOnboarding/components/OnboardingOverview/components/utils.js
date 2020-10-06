const rookieList = [];

const COLUMN_NAME = {
  ID: 'rookieId',
  NAME: 'name',
  POSITION: 'position',
  LOCATION: 'location',
  DATE_SENT: 'date_sent',
  DATE_RECEIVED: 'date_received',
  COMMENT: 'comment',
  DATE_JOIN: 'DATE_JOIN',
  ACTION: 'action',
};

const TABLE_TYPE = {
  PENDING_ELIGIBILITY_CHECKS: 'PENDING_ELIGIBILITY_CHECKS', // Pending eligibility checks
  SENT_ELIGIBILITY_FORMS: 'SENT_ELIGIBILITY_FORMS', // Pending eligibility checks
  RECEIVED_SUBMITTED_DOCUMENTS: 'RECEIVED_SUBMITTED_DOCUMENTS', // Pending eligibility checks
  ELIGIBLE_CANDIDATES: 'ELIGIBLE_CANDIDATE',
  INELIGIBLE_CANDIDATES: 'INELIGIBLE_CANDIDATE',
  PROVISIONAL_OFFERS: 'PROVISIONAL_OFFER', // Provisional offers
  SENT_PROVISIONAL_OFFERS: 'SENT_PROVISIONAL_OFFER', // Provisional offers
  RECEIVED_PROVISIONAL_OFFERS: 'RECEIVED_PROVISIONAL_OFFER', // Provisional offers
  DISCARDED_PROVISIONAL_OFFERS: 'DISCARDED_PROVISIONAL_OFFERS',
  AWAITING_APPROVAL: 'AWAITING_APPROVAL',
  FINAL_OFFERS: 'FINAL_OFFERS',
  FINAL_OFFERS_DRAFTS: 'FINAL_OFFERS_DRAFTS',
  PENDING_APPROVALS: 'PENDING_APPROVALS', // Awaiting approval
  APPROVED_FINAL_OFFERS: 'APPROVED_FINAL_OFFERS', // Awaiting approval
  REJECTED_FINAL_OFFERS: 'REJECTED_FINAL_OFFERS', // Awaiting approval
  SENT_FINAL_OFFERS: 'SENT_FINAL_OFFERS', // Final offers
  ACCEPTED_FINAL_OFFERS: 'ACCEPTED_FINAL_OFFERS', // Final offers
  DISCARDED_FINAL_OFFERS: 'DISCARDED_FINAL_OFFERS',
};

export { rookieList, COLUMN_NAME, TABLE_TYPE };
