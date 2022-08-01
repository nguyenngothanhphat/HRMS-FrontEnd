import { notification } from 'antd';
import moment from 'moment';

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

// functions
export const addTimeForDate = (date, time) => {
  const dateToString = moment(date).format('MM/DD/YYYY').toString();
  const timeToString = moment(time).format('h:mm a').toString();
  return moment(`${dateToString} ${timeToString}`, 'MM/DD/YYYY h:mm a');
};

export const rangePickerFormat = 'ddd, MMM D, YYYY';
export const commonDateFormat = 'MM/DD/YYYY';
export const dateFormat = 'ddd, MMM Do'; // show in first column
export const dateFormatImport = 'DD-MM-YYYY'; // show in first column

export const hourFormat = 'h:mm a';
export const minuteStep = 30; // in time picker, only allows minute 0 and 30

// for API
export const dateFormatAPI = 'YYYY-MM-DD';
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

// convert milisecond to time HH:mm:ss
// source: https://stackoverflow.com/questions/19700283/how-to-convert-time-in-milliseconds-to-hours-min-sec-format-in-javascript
export const convertMsToTime = (milliseconds) => {
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

export const convertMsToHours = (milliseconds) => {
  return milliseconds / 1000 / 60 / 60;
};

// API return time format: '07:00:00.0000'
export const parseTimeAPI = (time = '') => {
  return time ? time.slice(0, -5) : '';
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

export const isTheSameDay = (date1, date2) => {
  return moment(date1).format('MM/DD/YYYY') === moment(date2).format('MM/DD/YYYY');
};

export const generateAllWeeks = (fromDate, toDate) => {
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

export const checkHoliday = (date, holidays = []) =>
  holidays.some((holiday) => moment(date).isSame(holiday?.date, 'day'));

export const checkDateBetweenRange = (startDate, endDate, date) => {
  return moment(date).isBetween(moment(startDate), moment(endDate), 'day', []);
};

export const checkHolidayInWeek = (startDate, endDate, holidays = []) =>
  holidays.some((holiday) => checkDateBetweenRange(startDate, endDate, holiday.date));

export const getHolidayNameByDate = (date, holidays = []) => {
  const currentDate = holidays.find((holiday) => moment(holiday.date).isSame(moment(date)));
  if (currentDate) return currentDate?.holiday;
  return '';
};

export const sortedDate = (days = []) => days.sort((a, b) => moment(a.date).diff(moment(b.date)));

export const holidayFormatDate = (date) => moment(date).locale('en').format('MMM DD');

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

export const pushSuccess = (errorList = [], text, msg) => {
  if (errorList.length > 0) {
    let datesErr = '';
    for (let i = 0; i < errorList.length; i += 1) {
      datesErr += errorList[i]?.error?.item?.date
        ? moment(errorList[i]?.error.item.date).format(commonDateFormat)
        : moment(errorList[i]?.date).format(commonDateFormat);
      if (i + 1 < errorList.length) datesErr += ', ';
    }

    notification.warning({
      message: `Your timesheet tasks were ${text}. Note: other tasks overlapped`,
      description: datesErr,
      duration: 500,
    });
  }

  if (errorList.length === 0) {
    return notification.success({ message: msg });
  }
  return null;
};
