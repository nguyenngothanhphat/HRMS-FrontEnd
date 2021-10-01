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

// MT - MY TIMESHEET
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

// convert milisecond to time HH:mm:ss
const convertMsToTime = (milliseconds) => {
  // Get hours from milliseconds
  const hours = milliseconds / (1000 * 60 * 60);
  const absoluteHours = Math.floor(hours);
  const h = absoluteHours > 9 ? absoluteHours : `0${absoluteHours}`;

  // Get remainder from hours and convert to minutes
  const minutes = (hours - absoluteHours) * 60;
  const absoluteMinutes = Math.floor(minutes);
  const m = absoluteMinutes > 9 ? absoluteMinutes : `0${absoluteMinutes}`;

  // Get remainder from minutes and convert to seconds
  const seconds = (minutes - absoluteMinutes) * 60;
  const absoluteSeconds = Math.floor(seconds);
  const s = absoluteSeconds > 9 ? absoluteSeconds : `0${absoluteSeconds}`;

  return `${h}:${m}:${s}`;
  // return moment.utc(duration).format('HH:mm:ss');
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
};
