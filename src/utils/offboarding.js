export const OFFBOARDING_STATUS = {
  IN_PROGRESS: 'IN-PROGRESS',
  ON_HOLD: 'ON-HOLD',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

export const OFFBOARDING_TABS = [
  {
    id: OFFBOARDING_STATUS.IN_PROGRESS,
    label: 'In Progress',
  },
  {
    id: OFFBOARDING_STATUS.ON_HOLD,
    label: 'On Hold',
  },
  {
    id: OFFBOARDING_STATUS.ACCEPTED,
    label: 'Accepted',
  },
  {
    id: OFFBOARDING_STATUS.REJECTED,
    label: 'Rejected',
  },
];

export const getEmployeeName = (generalInfo = {}) => {
  const { legalName = '', firstName = '', lastName = '', middleName = '' } = generalInfo;
  let name = legalName;

  if (!name) {
    name = `${firstName} ${lastName}`;
    if (middleName) {
      name = `${firstName} ${middleName} ${lastName}`;
    }
  }
  return name;
};
