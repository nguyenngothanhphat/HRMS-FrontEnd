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

const COLS = ONBOARDING_COLUMN_NAME;

export const MENU_DATA = [
  {
    id: ONBOARDING_TABLE_TYPE.ALL,
    name: 'All',
    key: 'all',
    component: 'All',
    quantity: 0,
    link: 'all',
    processStatus: [],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.DRAFT,
    name: 'Drafts',
    key: 'drafts',
    component: 'Drafts',
    quantity: 0,
    link: 'drafts',
    processStatus: [NEW_PROCESS_STATUS.DRAFT],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.PROFILE_VERIFICATION,
    name: 'Profile Verification',
    key: 'profileVerification',
    component: 'ProfileVerification',
    quantity: 0,
    link: 'profile-verification',
    processStatus: [NEW_PROCESS_STATUS.PROFILE_VERIFICATION],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.DOCUMENT_VERIFICATION,
    name: 'Document Verification',
    key: 'documentVerification',
    component: 'DocumentVerification',
    quantity: 0,
    link: 'document-verification',
    processStatus: [NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.REFERENCE_VERIFICATION,
    name: 'Reference Verification',
    key: 'referenceVerification',
    component: 'ReferenceVerification',
    quantity: 0,
    link: 'reference-verification',
    processStatus: [NEW_PROCESS_STATUS.REFERENCE_VERIFICATION],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.SALARY_NEGOTIATION,
    name: 'Salary Proposal',
    key: 'salaryNegotiation',
    component: 'SalaryNegotiation',
    quantity: 0,
    link: 'salary-proposal',
    processStatus: [NEW_PROCESS_STATUS.SALARY_NEGOTIATION],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.AWAITING_APPROVALS,
    name: 'Awaiting Approvals',
    key: 'awaitingApprovals',
    component: 'AwaitingApprovals',
    quantity: 0,
    link: 'awaiting-approvals',
    processStatus: [NEW_PROCESS_STATUS.AWAITING_APPROVALS],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.NEEDS_CHANGES,
    name: 'Needs Changes',
    key: 'needsChanges',
    component: 'NeedsChanges',
    quantity: 0,
    link: 'needs-changes',
    processStatus: [NEW_PROCESS_STATUS.NEEDS_CHANGES],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.OFFER_RELEASED,
    name: 'Offer Released',
    key: 'offerReleased',
    component: 'OfferReleased',
    quantity: 0,
    link: 'offer-released',
    processStatus: [NEW_PROCESS_STATUS.OFFER_RELEASED],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.OFFER_ACCEPTED,
    name: 'Offer Accepted',
    key: 'offerAccepted',
    component: 'OfferAccepted',
    quantity: 0,
    link: 'offer-accepted',
    processStatus: [NEW_PROCESS_STATUS.OFFER_ACCEPTED],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.DOCUMENT_CHECKLIST_VERIFICATION,
    name: 'Document Checklist Verification',
    key: 'checkList',
    component: 'DocumentCheckList',
    quantity: 0,
    link: 'document-checklist',
    processStatus: [NEW_PROCESS_STATUS.DOCUMENT_CHECKLIST_VERIFICATION],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.DATE_JOIN,
      COLS.LOCATION,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.JOINED,
    name: 'Joined',
    key: 'joined',
    component: 'Joined',
    quantity: 0,
    link: 'joined',
    processStatus: [NEW_PROCESS_STATUS.JOINED],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.DATE_JOIN,
      COLS.LOCATION,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.OFFER_REJECTED,
    name: 'Rejected Offers',
    key: 'rejectedOffers',
    component: 'RejectedOffers',
    quantity: 0,
    link: 'rejected-offer',
    processStatus: [NEW_PROCESS_STATUS.OFFER_REJECTED],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
  {
    id: ONBOARDING_TABLE_TYPE.OFFER_WITHDRAWN,
    name: 'Withdrawn Offers',
    key: 'withdrawnOffers',
    component: 'WithdrawnOffers',
    quantity: 0,
    link: 'withdrawn-offers',
    processStatus: [NEW_PROCESS_STATUS.OFFER_WITHDRAWN],
    columns: [
      COLS.ID,
      COLS.NAME,
      COLS.POSITION,
      COLS.LOCATION,
      COLS.DATE_JOIN,
      COLS.ASSIGN_TO,
      COLS.ASSIGNEE_MANAGER,
      COLS.PROCESS_STATUS,
      COLS.ACTION,
    ],
  },
];
