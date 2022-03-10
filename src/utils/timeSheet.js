import moment from 'moment';

const TAB_NAME = {
  MY: 'my',
  REPORTS: 'reports',
  PM_REPORTS: 'pm-reports',
  FINANCE_REPORTS: 'finance-reports',
  HR_REPORTS: 'hr-reports',
  SETTINGS: 'settings',
};

const VIEW_TYPE = {
  D: 'D', // day
  W: 'W', // week
  M: 'M', // month
};
const color = {
  WORKING_HOURS: '#71A82B',
  LUNCH_BREAK: '#315ED2',
  PTO: '#A646C8',
};

const activityName = ['Working hours', 'Lunch Break'];

const activityColor = [
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

const projectColor = ['#A42BA8', '#7BCD00', '#FFBD14', '#F97457', '#1956DA', '#7BCDFF'];
const employeeColor = ['#A459BE', '#6759BE', '#599ABE', '#5BBE59', '#59BE94', '#BE9C59', '#BE5F59'];

// functions
const addTimeForDate = (date, time) => {
  const dateToString = moment(date).format('MM/DD/YYYY').toString();
  const timeToString = moment(time).format('h:mm a').toString();
  return moment(`${dateToString} ${timeToString}`, 'MM/DD/YYYY h:mm a');
};

const rangePickerFormat = 'ddd, MMM D, YYYY';
const dateFormat = 'ddd, MMM Do'; // show in first column
const hourFormat = 'h:mm a';
const minuteStep = 30; // in time picker, only allows minute 0 and 30

// for API
const dateFormatAPI = 'YYYY-MM-DD';
const hourFormatAPI = 'HH:mm';

// MT - MY TIMESHEET SIMPLE VIEW
const MT_MAIN_COL_SPAN = {
  DATE: 3,
  REMAINING: 21,
};

const MT_SECONDARY_COL_SPAN = {
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
const EMP_MT_MAIN_COL_SPAN = {
  DATE_OF_HOURS: 2,
  REMAINING: 22,
};

const EMP_MT_SECONDARY_COL_SPAN = {
  PROJECT: 4,
  TASK: 4,
  DESCRIPTION: 6,
  TIME: 4,
  TOTAL_HOURS: 3,
  ACTIONS: 3,
};

const EMP_ROW_HEIGHT = 72; // px

// MANAGER VIEW
const MNG_MT_MAIN_COL_SPAN = {
  EMPLOYEE: 4,
  REMAINING: 20,
};

const MNG_MT_SECONDARY_COL_SPAN = {
  DESIGNATION: 4,
  DEPARTMENT: 6,
  PROJECT_GROUP: 14,
};

const MNG_MT_THIRD_COL_SPAN = {
  PROJECTS: 7,
  PROJECT_MANAGER: 7,
  TOTAL_HOURS: 5,
  VIEW_DETAIL: 5,
};

// convert milisecond to time HH:mm:ss
// source: https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript
const convertMsToTime = (milliseconds) => {
  let h = Math.floor(milliseconds / 1000 / 60 / 60);
  let m = Math.floor((milliseconds / 1000 / 60 / 60 - h) * 60);
  let s = Math.floor(((milliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);

  if (s < 10) s = `0${s}`;
  else s = `${s}`;
  if (m < 10) m = `0${m}`;
  else m = `${m}`;
  if (h < 10) h = `0${h}`;
  else h = `${h}`;

  return `${h}:${m}:${s}`;
  // return moment.utc(duration).format('HH:mm:ss');
};

const convertMsToHours = (milliseconds) => {
  return milliseconds / 1000 / 60 / 60;
};

// API return time format: '07:00:00.0000'
const parseTimeAPI = (time = '') => {
  return time ? time.slice(0, -5) : '';
};

// WORKING HOURS
const WORKING_HOURS = {
  START: 5,
  END: 24,
};

const TASKS = [
  'Brainstorming',
  'Client Meeting',
  'UI Feedback',
  'UI Presentation to client',
  'UI Support',
  'Feedback changes on WFs',
];

const isTheSameDay = (date1, date2) => {
  return moment(date1).format('MM/DD/YYYY') === moment(date2).format('MM/DD/YYYY');
};

const generateAllWeeks = (fromDate, toDate) => {
  const weeks = [];
  let fd = new Date(fromDate);
  const weekNo = moment(fromDate, 'YYYY-MM-DD').week();
  const td = new Date(toDate);
  let previousWeek;
  while (fd.getTime() < td.getTime()) {
    const weekNumber = moment(fd).week() - weekNo + 1;
    if (weekNumber > 0) {
      previousWeek = weekNumber;
    } else {
      previousWeek += 1;
    }
    const startWeek = moment(fd).startOf('week').toDate();
    const endWeek = moment(fd).endOf('week').toDate();
    const existed = weeks.find((x) => x.compare === weekNumber);
    fd = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate() + 1);
    if (!existed) {
      weeks.push({
        week: previousWeek,
        compare: weekNumber,
        startDate: moment(startWeek).format('YYYY-MM-DD'),
        endDate: moment(endWeek).format('YYYY-MM-DD'),
      });
    }
  }
  return weeks;
};

export {
  TAB_NAME,
  VIEW_TYPE,
  activityName,
  activityColor,
  projectColor,
  employeeColor,
  addTimeForDate,
  rangePickerFormat,
  dateFormat,
  hourFormat,
  minuteStep,
  dateFormatAPI,
  hourFormatAPI,
  MT_MAIN_COL_SPAN,
  MT_SECONDARY_COL_SPAN,
  convertMsToTime,
  convertMsToHours,
  parseTimeAPI,
  WORKING_HOURS,
  // COMPLEX VIEW
  EMP_MT_MAIN_COL_SPAN,
  EMP_MT_SECONDARY_COL_SPAN,
  EMP_ROW_HEIGHT,
  MNG_MT_MAIN_COL_SPAN,
  MNG_MT_SECONDARY_COL_SPAN,
  MNG_MT_THIRD_COL_SPAN,
  TASKS,
  isTheSameDay,
  generateAllWeeks,
};
