import moment from 'moment';

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

export const TIMEOFF_PERIOD = {
  MORNING: 'MORNING',
  AFTERNOON: 'AFTERNOON',
  WHOLE_DAY: 'WHOLE-DAY',
};

export const TIMEOFF_INPUT_TYPE = {
  PERIOD: 'PERIOD', // MORNING, AFTERNOON, WHOLE_DAY
  HOUR: 'HOUR', // NUMBER
  WHOLE_DAY: 'WHOLE_DAY',
};

export const TIMEOFF_INPUT_TYPE_BY_LOCATION = {
  US: TIMEOFF_INPUT_TYPE.HOUR,
  IN: TIMEOFF_INPUT_TYPE.WHOLE_DAY,
  VN: TIMEOFF_INPUT_TYPE.PERIOD,
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

export const TIMEOFF_COL_SPAN_1 = {
  DATE: 7,
  DAY: 7,
  COUNT: 10,
};
export const TIMEOFF_COL_SPAN_2 = {
  DATE: 4,
  DAY: 4,
  START_TIME: 6,
  END_TIME: 6,
  HOUR: 4,
};

export const MINUTE_STEP = 15;
export const TIMEOFF_MIN_LEAVE_HOUR = 2;
export const TIMEOFF_MAX_LEAVE_HOUR = 8;
export const TIMEOFF_12H_FORMAT = 'H:mm a';
export const TIMEOFF_24H_FORMAT = 'HH:mm';

export const getHours = (startTime, endTime, format) => {
  const duration = moment.duration(moment(endTime, format).diff(moment(startTime, format)));
  return Math.round(duration.asHours() * 100) / 100;
};

export const convert24To12 = (time) => {
  if (!time) return null;
  return moment(time, TIMEOFF_24H_FORMAT).format(TIMEOFF_12H_FORMAT);
};

export const convert12To24 = (time) => {
  if (!time) return null;
  return moment(time, TIMEOFF_12H_FORMAT).format(TIMEOFF_24H_FORMAT);
};
