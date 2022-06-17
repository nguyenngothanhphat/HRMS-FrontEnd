export const OFFBOARDING = {
  STEP: {
    INIT_REQUEST: 'INIT_REQUEST',
    SUBMIT_REQUEST: 'SUBMIT_REQUEST',
    VS_MANAGER: 'VS_MANAGER',
    APPROVE: 'APPROVE',
  },
  STATUS: {
    DRAFT: 'DRAFT',
    IN_PROGRESS: 'IN_PROGRESS',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    DELETED: 'DELETED',
  },
  MEETING_STATUS: {
    NOT_START: 'NOT_START',
    EMPLOYEE_PICK_DATE: 'EMPLOYEE_PICK_DATE',
    MANAGER_PICK_DATE: 'MANAGER_PICK_DATE',
    DATE_CONFIRMED: 'DATE_CONFIRMED',
    MANAGER_REJECT_DATE: 'MANAGER_REJECT_DATE',
    DONE: 'DONE',
  },
  UPDATE_ACTION: {
    MANAGER_RESCHEDULE: 'MANAGER_RESCHEDULE',
    EMPLOYEE_RESCHEDULE: 'EMPLOYEE_RESCHEDULE',
    MEETING_DONE: 'MEETING_DONE',
    MANAGER_REJECT: 'MANAGER_REJECT',
    MANAGER_ACCEPT_MEETING: 'MANAGER_ACCEPT_MEETING',
    EMPLOYEE_ACCEPT_MEETING: 'EMPLOYEE_ACCEPT_MEETING',
  },
};

export const OFFBOARDING_MANAGER_TABS = [
  {
    id: OFFBOARDING.STATUS.IN_PROGRESS,
    label: 'In Progress',
  },
  {
    id: OFFBOARDING.STATUS.ACCEPTED,
    label: 'Accepted',
  },
  {
    id: OFFBOARDING.STATUS.REJECTED,
    label: 'Rejected',
  },
];

export const getEmployeeName = (generalInfo = {}) => {
  const { legalName = '', firstName = '', lastName = '', middleName = '' } = generalInfo;
  let name = legalName;

  if (!name && firstName) {
    name = `${firstName} ${lastName}`;
    if (middleName) {
      name = `${firstName} ${middleName} ${lastName}`;
    }
  }
  return name;
};

export const dateFormat = 'MM/DD/YYYY';

export const onJoinMeeting = (meetingId) => {
  window.open(`https://meet.google.com/${meetingId}`, '_blank');
};
