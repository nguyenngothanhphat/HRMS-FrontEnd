import moment from 'moment';

const API_SQL = 'http://10.20.29.171:8000/api';

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

export {
  API_SQL,
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
};
