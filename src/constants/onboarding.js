import { DATE_FORMAT_MDY } from './dateFormat';

export const ONBOARDING_TABS = {
  OVERVIEW: 'list',
  SETTINGS: 'settings',
  NEW_JOINEES: 'new-joinees',
};
export const ONBOARDING_DATE_FORMAT = DATE_FORMAT_MDY;
export const NEW_PROCESS_STATUS = {
  DRAFT: 'DRAFT',
  PROFILE_VERIFICATION: 'PROFILE_VERIFICATION',
  DOCUMENT_VERIFICATION: 'DOCUMENT_VERIFICATION',
  REFERENCE_VERIFICATION: 'REFERENCE_VERIFICATION',
  SALARY_NEGOTIATION: 'SALARY_NEGOTIATION',
  AWAITING_APPROVALS: 'AWAITING_APPROVALS',
  OFFER_RELEASED: 'OFFER_RELEASED',
  NEEDS_CHANGES: 'NEEDS_CHANGES',
  OFFER_ACCEPTED: 'OFFER_ACCEPTED',
  OFFER_REJECTED: 'OFFER_REJECTED',
  OFFER_WITHDRAWN: 'OFFER_WITHDRAWN',
  DOCUMENT_CHECKLIST_VERIFICATION: 'DOCUMENT_CHECKLIST_VERIFICATION',
  JOINED: 'JOINED',
};

export const NEW_PROCESS_STATUS_TABLE_NAME = {
  DRAFT: 'Draft',
  PROFILE_VERIFICATION: 'Profile Verification',
  DOCUMENT_VERIFICATION: 'Document Verification',
  REFERENCE_VERIFICATION: 'Reference Verification',
  SALARY_NEGOTIATION: 'Salary Proposal',
  AWAITING_APPROVALS: 'Awaiting Approvals',
  NEEDS_CHANGES: 'Needs Changes',
  OFFER_RELEASED: 'Offer Released',
  OFFER_ACCEPTED: 'Offer Accepted',
  OFFER_REJECTED: 'Offer Rejected',
  OFFER_WITHDRAWN: 'Offer Withdrawn',
  DOCUMENT_CHECKLIST_VERIFICATION: 'Document Checklist Verification',
  JOINED: 'Joined',
};

export const ONBOARDING_FORM_LINK = {
  BASIC_INFORMATION: 'basic-information',
  JOB_DETAILS: 'job-details',
  DOCUMENT_VERIFICATION: 'document-verification',
  REFERENCES: 'references',
  SALARY_STRUCTURE: 'salary-structure',
  BENEFITS: 'benefits',
  OFFER_DETAILS: 'offer-details',
  OFFER_LETTER: 'offer-letter',
  DOCUMENT_CHECKLIST_VERIFICATION: 'document-checklist',
};

export const ONBOARDING_STEPS = {
  BASIC_INFORMATION: 0,
  JOB_DETAILS: 1,
  DOCUMENT_VERIFICATION: 2,
  REFERENCES: 3,
  SALARY_STRUCTURE: 4,
  BENEFITS: 5,
  OFFER_DETAILS: 6,
  OFFER_LETTER: 7,
  DOCUMENT_CHECKLIST_VERIFICATION: 8,
};

export const ONBOARDING_FORM_STEP_LINK = [
  {
    id: ONBOARDING_STEPS.BASIC_INFORMATION,
    link: ONBOARDING_FORM_LINK.BASIC_INFORMATION,
  },
  {
    id: ONBOARDING_STEPS.JOB_DETAILS,
    link: ONBOARDING_FORM_LINK.JOB_DETAILS,
  },
  {
    id: ONBOARDING_STEPS.DOCUMENT_VERIFICATION,
    link: ONBOARDING_FORM_LINK.DOCUMENT_VERIFICATION,
  },
  {
    id: ONBOARDING_STEPS.REFERENCES,
    link: ONBOARDING_FORM_LINK.REFERENCES,
  },
  {
    id: ONBOARDING_STEPS.SALARY_STRUCTURE,
    link: ONBOARDING_FORM_LINK.SALARY_STRUCTURE,
  },
  {
    id: ONBOARDING_STEPS.BENEFITS,
    link: ONBOARDING_FORM_LINK.BENEFITS,
  },
  {
    id: ONBOARDING_STEPS.OFFER_DETAILS,
    link: ONBOARDING_FORM_LINK.OFFER_DETAILS,
  },
  {
    id: ONBOARDING_STEPS.OFFER_LETTER,
    link: ONBOARDING_FORM_LINK.OFFER_LETTER,
  },
  {
    id: ONBOARDING_STEPS.DOCUMENT_CHECKLIST_VERIFICATION,
    link: ONBOARDING_FORM_LINK.DOCUMENT_CHECKLIST_VERIFICATION,
  },
];

/// ////////////////////////// [END] NEW ONBOARDING /// //////////////////////////

export const PROCESS_STATUS = {
  PROVISIONAL_OFFER_DRAFT: 'DRAFT',
  FINAL_OFFERS_DRAFT: 'FINAL-OFFER-DRAFT',

  SENT_PROVISIONAL_OFFERS: 'SENT-PROVISIONAL-OFFER',
  ACCEPTED_PROVISIONAL_OFFERS: 'ACCEPT-PROVISIONAL-OFFER',
  RENEGOTIATE_PROVISIONAL_OFFERS: 'RENEGOTIATE-PROVISONAL-OFFER',

  PENDING: 'PENDING-BACKGROUND-CHECK',
  ELIGIBLE_CANDIDATES: 'ELIGIBLE-CANDIDATE',
  INELIGIBLE_CANDIDATES: 'INELIGIBLE-CANDIDATE',

  SENT_FOR_APPROVAL: 'PENDING-APPROVAL-FINAL-OFFER',
  APPROVED_OFFERS: 'APPROVED-FINAL-OFFER',

  SENT_FINAL_OFFERS: 'SENT-FINAL-OFFER',
  ACCEPTED_FINAL_OFFERS: 'ACCEPT-FINAL-OFFER',
  RENEGOTIATE_FINAL_OFFERS: 'RENEGOTIATE-FINAL-OFFERS',

  PROVISIONAL_OFFERS: 'DISCARDED-PROVISONAL-OFFER',

  FINAL_OFFERS: 'FINAL-OFFERS',
  FINAL_OFFERS_HR: 'REJECT-FINAL-OFFER-HR',
  FINAL_OFFERS_CANDIDATE: 'REJECT-FINAL-OFFER-CANDIDATE',

  DOCUMENT_CHECKLIST_VERIFICATION: 'DOCUMENT-CHECKLIST-VERIFICATION',

  ALL: [
    'DRAFT',
    'FINAL-OFFER-DRAFT',
    'SENT-PROVISIONAL-OFFER',
    'ACCEPT-PROVISIONAL-OFFER',
    'RENEGOTIATE-PROVISONAL-OFFER',
    'PENDING-BACKGROUND-CHECK',
    'ELIGIBLE-CANDIDATE',
    'INELIGIBLE-CANDIDATE',
    'PENDING-APPROVAL-FINAL-OFFER',
    'APPROVED-FINAL-OFFER',
    'SENT-FINAL-OFFER',
    'ACCEPT-FINAL-OFFER',
    'RENEGOTIATE-FINAL-OFFERS',
    'DISCARDED-PROVISONAL-OFFER',
    'FINAL-OFFERS',
    'REJECT-FINAL-OFFER-HR',
    'REJECT-FINAL-OFFER-CANDIDATE',
    'DOCUMENT-CHECKLIST-VERIFICATION',
  ],
};

export const PROCESS_STATUS_TABLE_NAME = {
  DRAFT: 'Provisional Offer Drafts',
  'FINAL-OFFER-DRAFT': 'Final Offers Draft',

  'SENT-PROVISIONAL-OFFER': 'Sent Provisional Offers',
  'ACCEPT-PROVISIONAL-OFFER': 'Accepted Provisional Offers',
  'RENEGOTIATE-PROVISONAL-OFFER': 'Renegotiate Provisional Offers',

  'PENDING-BACKGROUND-CHECK': 'Pending',
  'ELIGIBLE-CANDIDATE': 'Eligible Candidates',
  'INELIGIBLE-CANDIDATE': 'Ineligible Candidates',

  'PENDING-APPROVAL-FINAL-OFFER': 'Sent For Approval',
  'APPROVED-FINAL-OFFER': 'Approved Offers',

  'SENT-FINAL-OFFER': 'Sent Final Offers',
  'ACCEPT-FINAL-OFFER': 'Accepted Final Offers',

  'DISCARDED-PROVISONAL-OFFER': 'Provisional Offers',

  'RENEGOTIATE-FINAL-OFFERS': 'Re-Negotiate Final Offers',

  'REJECT-FINAL-OFFER-HR': 'Final Offers',
  'REJECT-FINAL-OFFER-CANDIDATE': 'Final Offers',

  'DOCUMENT-CHECKLIST-VERIFICATION': 'Document Checklist Verification',
};

export const MENU_DATA = [
  {
    id: 1,
    name: 'All',
    key: 'all',
    component: 'All',
    quantity: 0,
    link: 'all',
  },
  {
    id: 2,
    name: 'Drafts',
    key: 'drafts',
    component: 'Drafts',
    quantity: 0,
    link: 'drafts',
  },
  {
    id: 3,
    name: 'Profile Verification',
    key: 'profileVerification',
    component: 'ProfileVerification',
    quantity: 0,
    link: 'profile-verification',
  },
  {
    id: 4,
    name: 'Document Verification',
    key: 'documentVerification',
    component: 'DocumentVerification',
    quantity: 0,
    link: 'document-verification',
  },
  {
    id: 5,
    name: 'Reference Verification',
    key: 'referenceVerification',
    component: 'ReferenceVerification',
    quantity: 0,
    link: 'reference-verification',
  },
  {
    id: 6,
    name: 'Salary Proposal',
    key: 'salaryNegotiation',
    component: 'SalaryNegotiation',
    quantity: 0,
    link: 'salary-proposal',
  },
  {
    id: 7,
    name: 'Awaiting Approvals',
    key: 'awaitingApprovals',
    component: 'AwaitingApprovals',
    quantity: 0,
    link: 'awaiting-approvals',
  },
  {
    id: 8,
    name: 'Needs Changes',
    key: 'needsChanges',
    component: 'NeedsChanges',
    quantity: 0,
    link: 'needs-changes',
  },
  {
    id: 9,
    name: 'Offer Released',
    key: 'offerReleased',
    component: 'OfferReleased',
    quantity: 0,
    link: 'offer-released',
  },
  {
    id: 10,
    name: 'Offer Accepted',
    key: 'offerAccepted',
    component: 'OfferAccepted',
    quantity: 0,
    link: 'offer-accepted',
  },
  {
    id: 11,
    name: 'Document Checklist Verification',
    key: 'checkList',
    component: 'DocumentCheckList',
    quantity: 0,
    link: 'document-checklist',
  },
  {
    id: 12,
    name: 'Joined',
    key: 'joined',
    component: 'Joined',
    quantity: 0,
    link: 'joined',
  },
  {
    id: 13,
    name: 'Rejected Offers',
    key: 'rejectedOffers',
    component: 'RejectedOffers',
    quantity: 0,
    link: 'rejected-offer',
  },
  {
    id: 14,
    name: 'Withdrawn Offers',
    key: 'withdrawnOffers',
    component: 'WithdrawnOffers',
    quantity: 0,
    link: 'withdrawn-offers',
  },
];

export const ONBOARDING_TABLE_TYPE = {
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
  DOCUMENT_CHECKLIST_VERIFICATION: 'DOCUMENT_CHECKLIST_VERIFICATION',
  JOINED: 'JOINED',
};

export const ONBOARDING_COLUMN_NAME = {
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
