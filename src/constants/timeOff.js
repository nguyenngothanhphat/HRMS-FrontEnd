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

export const TIMEOFF_STATUS_NAME = {
  [TIMEOFF_STATUS.IN_PROGRESS]: 'In Progress',
  [TIMEOFF_STATUS.ACCEPTED]: 'Accepted',
  [TIMEOFF_STATUS.ON_HOLD]: 'Withdraw Request',
  [TIMEOFF_STATUS.REJECTED]: 'Rejected',
  [TIMEOFF_STATUS.DELETED]: 'Deleted',
  [TIMEOFF_STATUS.DRAFTS]: 'Drafts',
  [TIMEOFF_STATUS.WITHDRAWN]: 'Withdrawn',
};

export const TIMEOFF_HISTORY_STATUS = {
  APPLIED: 'APPLIED',
  EDITED: 'EDITED',
  WITHDRAW: 'WITHDRAW',
  WAITING: 'WAITING',
  WAITING_WITHDRAW: 'WAITING_WITHDRAW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  WITHDRAW_APPROVED: 'WITHDRAW_APPROVED',
  WITHDRAW_REJECTED: 'WITHDRAW_REJECTED',
  WITHDRAW_ACCEPTED: 'WITHDRAW_ACCEPTED',
};

export const TIMEOFF_LINK_ACTION = {
  EDIT_LEAVE_REQUEST: 'edit',
  NEW_LEAVE_REQUEST: 'new',
  EDIT_COMPOFF_REQUEST: 'edit',
  NEW_COMPOFF_REQUEST: 'new',
  NEW_BEHALF_OF: 'new-behalf-of',
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
  HOUR: 'HOUR',
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
  [TIMEOFF_STATUS.ACCEPTED]: '#00C598',
  [TIMEOFF_STATUS.ON_HOLD]: '#8f34f7',
  [TIMEOFF_STATUS.REJECTED]: '#fd4546',
  [TIMEOFF_STATUS.DELETED]: '#000000',
  [TIMEOFF_STATUS.DRAFTS]: '#13c2c2',
  [TIMEOFF_STATUS.WITHDRAWN]: '#00aebc',
  Holiday: '#6a0dad',
};

export const TIMEOFF_DATE_FORMAT = 'MM/DD/YYYY';
export const TIMEOFF_DATE_FORMAT_API = 'YYYY-MM-DD';

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

export const WORKING_HOURS = {
  START: '08:00',
  END: '17:00',
};

// TIMEOFF SETUP
export const TIME_TEXT = {
  d: 'days',
  h: 'hours',
};

export const FORM_ITEM_NAME = {
  TIMEOFF_TYPE_NAME: 'timeoffTypeName',

  EMPLOYEE_TYPE: 'employeeType',

  ACCRUAL_POLICY: 'accrualPolicy',
  ACCRUAL_METHOD: 'accrualMethod',
  ACCRUAL_RATE: 'accrualRate',
  ACCRUAL_POLICY_ACCRUAL_METHOD: 'accrualPolicy.accrualMethod',
  ACCRUAL_POLICY_ACCRUAL_RATE: 'accrualPolicy.accrualRate',

  ACCRUAL_START: 'accrualStart',
  ACCRUAL_START_VALUE: 'accrualStart.value',
  ACCRUAL_START_UNIT: 'accrualStart.unit',

  MINIMUM_LEAVE_AMOUNT: 'minimumLeaveAmount',
  MINIMUM_LEAVE_AMOUNT_VALUE: 'minimumLeaveAmount.value',

  LEAVE_APPLICATION_START: 'leaveApplicationStart',
  LEAVE_APPLICATION_START_VALUE: 'leaveApplicationStart.value',

  NEGATIVE_LEAVE_BALANCE: 'negativeLeaveBalance',
  NEGATIVE_LEAVE_BALANCE_ALLOWED: 'negativeLeaveBalance.allowed',
  NEGATIVE_LEAVE_BALANCE_MAXIMUM: 'negativeLeaveBalance.maximum',
  NEGATIVE_LEAVE_BALANCE_MAXIMUM_UNIT: 'negativeLeaveBalance.maximum.unit',
  NEGATIVE_LEAVE_BALANCE_MAXIMUM_VALUE: 'negativeLeaveBalance.maximum.value',

  NEW_HIRE_PRORATION_POLICY: 'newHireProrationPolicy',

  LOP_LEAVE_ACCRUAL_POLICY: 'LOPLeaveAccrualPolicy',

  MAXIMUM_BALANCE_ALLOWED: 'maximumBalanceAllowed',
  MAXIMUM_BALANCE_ALLOWED_UNIT: 'maximumBalanceAllowed.unit',
  MAXIMUM_BALANCE_ALLOWED_VALUE: 'maximumBalanceAllowed.value',

  ANNUAL_RESET_POLICY: 'annualResetPolicy',
  ANNUAL_RESET_POLICY_RESET_TYPE: 'annualResetPolicy.resetType',
  ANNUAL_RESET_POLICY_CALENDAR_DATE: 'annualResetPolicy.calendarDate',

  NOTICE_PERIOD_LEAVE_ACCRUAL_POLICY: 'noticePeriodLeaveAccrualPolicy',

  CARRY_FORWARD_POLICY: 'carryForwardPolicy',
  CARRY_FORWARD_CAP: 'carryForwardCap',
  CARRY_FORWARD_CAP_FROM: 'carryForwardCap.from',
  CARRY_FORWARD_CAP_TO: 'carryForwardCap.to',
  CARRY_FORWARD_ALLOWED: 'carryForwardAllowed',
  MAXIMUM_CARRY_FORWARD_VALUE: 'maximumCarryForwardValue',
  MAXIMUM_CARRY_FORWARD_VALUE_VALUE: 'maximumCarryForwardValue.value',
  MAXIMUM_CARRY_FORWARD_VALUE_UNIT: 'maximumCarryForwardValue.unit',

  VALUE: 'value',
  UNIT: 'unit',
  ALLOWED: 'allowed',
  FROM: 'from',
  TO: 'to',
  MAXIMUM: 'maximum',
  RESET_TYPE: 'resetType',
  CALENDAR_DATE: 'calendarDate',
};

export const TIMEOFF_ACCRUAL_METHOD = {
  UNLIMITED: 'unlimited',
  DAYS_OF_YEAR: 'daysOfYear',
  DAYS_OF_QUARTER: 'daysOfQuarter',
  DAYS_OF_MONTH: 'daysOfMonth',
  DAYS_OF_FORTNIGHT: 'daysOfFortnight',
};

export const TIMEOFF_WORK_DAYS = [
  {
    id: 0,
    text: 'SUNDAY',
    name: 'Sun',
  },
  {
    id: 1,
    text: 'MONDAY',
    name: 'Mon',
  },
  {
    id: 2,
    text: 'TUESDAY',
    name: 'Tue',
  },
  {
    id: 3,
    text: 'WEDNESDAY',
    name: 'Wed',
  },
  {
    id: 4,
    text: 'THURSDAY',
    name: 'Thu',
  },
  {
    id: 5,
    text: 'FRIDAY',
    name: 'Fri',
  },
  {
    id: 6,
    name: 'Sat',
    text: 'SATURDAY',
  },
];

export const TIMEOFF_NEW_REQUEST_DAYS = 4;
