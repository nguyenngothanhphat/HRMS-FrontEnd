export const CANDIDATE_TASK_LINK = {
  REVIEW_PROFILE: 'review-profile',
  UPLOAD_DOCUMENTS: 'upload-documents',
  SALARY_NEGOTIATION: 'salary-negotiation',
  ACCEPT_OFFER: 'accept-offer',
  REFERENCES: 'references',
  PREJOINING_CHECKLIST: 'prejoining-checklist',
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

const getClassName = (name) => `.${name}`;

export const NEW_COMER_CLASS = {
  DASHBOARD_TAB: 'dashboard-tab',
  MESSAGES_TAB: 'messages-tab',
  APPLICATION_STATUS: 'application-status',
  YOUR_ACTIVITY: 'your-activity',
  PENDING_TASKS: 'pending-tasks',
  COMPANY_PROFILE: 'company-profile',
};

export const NEW_COMER_STEPS = [
  {
    target: getClassName(NEW_COMER_CLASS.DASHBOARD_TAB),
    content:
      'Dashboard shows you all the information related to your application, pending tasks and any upcoming activities',
    placement: 'auto',
    disableBeacon: true,
  },
  {
    target: getClassName(NEW_COMER_CLASS.MESSAGES_TAB),
    content:
      'Please use the Messages tab to communicate with the HR team regarding your application',
    placement: 'auto',
  },
  {
    target: getClassName(NEW_COMER_CLASS.APPLICATION_STATUS),
    content: 'The Application Status widget shows you the current status of your application.',
    placement: 'auto',
  },
  {
    target: getClassName(NEW_COMER_CLASS.YOUR_ACTIVITY),
    content: 'You can find all your Upcoming Events and Next Steps here.',
    placement: 'auto',
  },
  {
    target: getClassName(NEW_COMER_CLASS.PENDING_TASKS),
    content:
      'The Tasks Widget shows all your pending tasks. Please complete all pending tasks ASAP for a quick onboarding experience.',
    placement: 'auto',
  },
  {
    target: getClassName(NEW_COMER_CLASS.COMPANY_PROFILE),
    content: 'This widget shows you more information on our company.',
    placement: 'right',
  },
];
