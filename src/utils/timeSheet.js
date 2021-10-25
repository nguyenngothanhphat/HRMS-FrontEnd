import moment from 'moment';

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

// API return time format: '07:00:00.0000'
const parseTimeAPI = (time = '') => {
  return time ? time.slice(0, -5) : '';
};

export {
  activityName,
  activityColor,
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
  parseTimeAPI,
  // COMPLEX VIEW
  EMP_MT_MAIN_COL_SPAN,
  EMP_MT_SECONDARY_COL_SPAN,
};
