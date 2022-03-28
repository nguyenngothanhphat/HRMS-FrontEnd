export const TIMEOFF_STATUS = {
  IN_PROGRESS: 'IN-PROGRESS',
  IN_PROGRESS_NEXT: 'IN-PROGRESS-NEXT',
  ACCEPTED: 'ACCEPTED',
  ON_HOLD: 'ON-HOLD',
  REJECTED: 'REJECTED',
  DELETED: 'DELETED',
  DRAFTS: 'DRAFTS',
  WITHDRAWN: 'WITHDRAWN',
};
export const TIMEOFF_LINK_ACTION = {
  EDIT_LEAVE_REQUEST: 'edit',
  NEW_LEAVE_REQUEST: 'new',
  EDIT_COMPOFF_REQUEST: 'edit',
  NEW_COMPOFF_REQUEST: 'new',
};
export const MAX_NO_OF_DAYS_TO_SHOW = 5;
export const TIMEOFF_TYPE = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
};

export const TIMEOFF_COLOR = {
  [TIMEOFF_STATUS.IN_PROGRESS]: '#ffa100',
  [TIMEOFF_STATUS.IN_PROGRESS_NEXT]: '#ffa100',
  [TIMEOFF_STATUS.ACCEPTED]: '#ffa100',
  [TIMEOFF_STATUS.ON_HOLD]: '#8f34f7',
  [TIMEOFF_STATUS.REJECTED]: '#fd4546',
  [TIMEOFF_STATUS.DELETED]: '#000000',
  [TIMEOFF_STATUS.DRAFTS]: '#13c2c2',
  [TIMEOFF_STATUS.WITHDRAWN]: '#00aebc',
};

export const addZeroToNumber = (number) => {
  if (number < 10 && number >= 0) return `0${number}`.slice(-2);
  return number;
};

export const TIMEOFF_DATE_FORMAT = 'MM/DD/YYYY';
