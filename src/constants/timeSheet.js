import { DATE_FORMAT_MDY, DATE_FORMAT_YMD } from './dateFormat';

export const hourList = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
];

export const TAB_NAME = {
  MY: 'my',
  REPORTS: 'reports',
  PM_REPORTS: 'pm-reports',
  FINANCE_REPORTS: 'finance-reports',
  HR_REPORTS: 'hr-reports',
  SETTINGS: 'settings',
  MY_REQUESTS: 'my-requests',
};

export const VIEW_TYPE = {
  D: 'D', // day
  W: 'W', // week
  M: 'M', // month
};
export const color = {
  WORKING_HOURS: '#71A82B',
  LUNCH_BREAK: '#315ED2',
  PTO: '#A646C8',
};

export const activityName = ['Working hours', 'Lunch Break'];

export const activityColor = [
  {
    name: 'Working hours',
    color: color.WORKING_HOURS,
  },
  {
    name: 'Lunch Break',
    color: color.LUNCH_BREAK,
  },
  {
    name: 'PTO',
    color: color.PTO,
  },
];

export const projectColor = ['#A42BA8', '#7BCD00', '#FFBD14', '#F97457', '#1956DA', '#7BCDFF'];
export const employeeColor = [
  '#A459BE',
  '#6759BE',
  '#599ABE',
  '#5BBE59',
  '#59BE94',
  '#BE9C59',
  '#BE5F59',
];

export const rangePickerFormat = 'ddd, MMM D, YYYY';
export const commonDateFormat = DATE_FORMAT_MDY;
export const dateFormat = 'ddd, MMM Do'; // show in first column
export const dateFormatImport = 'DD-MM-YYYY'; // show in first column

export const hourFormat = 'h:mm a';
export const minuteStep = 30; // in time picker, only allows minute 0 and 30

// for API
export const dateFormatAPI = DATE_FORMAT_YMD;
export const hourFormatAPI = 'HH:mm';

// MT - MY TIMESHEET SIMPLE VIEW
export const MT_MAIN_COL_SPAN = {
  DATE: 3,
  REMAINING: 21,
};

export const MT_SECONDARY_COL_SPAN = {
  ACTIVITY: 4,
  START_TIME: 3,
  END_TIME: 3,
  NIGHT_SHIFT: 3,
  TOTAL_HOURS: 3,
  NOTES: 5,
  ACTIONS: 3,
};

// MT - MY TIMESHEET COMPLEX VIEW
// EMPLOYEE VIEW
export const EMP_MT_MAIN_COL_SPAN = {
  DATE_OF_HOURS: 2,
  REMAINING: 22,
};

export const EMP_MT_SECONDARY_COL_SPAN = {
  PROJECT: 4,
  TASK: 4,
  DESCRIPTION: 6,
  TIME: 4,
  TOTAL_HOURS: 3,
  ACTIONS: 3,
};

export const EMP_ROW_HEIGHT = 82; // px
// this value must be equal to
// pages/TimeSheet/components/ComplexView/components/MyTimeSheet/components/DailyTable/components/ActivityList/index.less

// MANAGER VIEW
export const MNG_MT_MAIN_COL_SPAN = {
  EMPLOYEE: 4,
  REMAINING: 20,
};

export const MNG_MT_SECONDARY_COL_SPAN = {
  DESIGNATION: 4,
  DEPARTMENT: 4,
  PROJECT_GROUP: 16,
};

export const MNG_MT_THIRD_COL_SPAN = {
  PROJECTS: 7,
  PROJECT_MANAGER: 7,
  TOTAL_HOURS: 5,
  VIEW_DETAIL: 5,
};

// WORKING HOURS
export const WORKING_HOURS = {
  START: 0,
  END: 24,
};

export const TIME_DEFAULT = {
  START_TIME: '8:00 am',
  END_TIME: '5:00 pm',
  TIME_WORK_LATE: '4:00 pm',
};

export const DEFAULT_TOP_HOUR = 16; // HOUR

export const TASKS = [
  'Brainstorming',
  'Client Meeting',
  'UI Feedback',
  'UI Presentation to client',
  'UI Support',
  'Feedback changes on WFs',
];

export const TIMESHEET_ADD_TASK_ALERT = {
  DEFAULT: {
    type: 'info',
    content: 'The same tasks will be updated for the selected date range',
  },
  WARNING: {
    type: 'warning',
    content: 'You are allowed to select only one date if you have multiple tasks',
  },
};
