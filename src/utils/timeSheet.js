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

export {
  API_SQL,
  activityName,
  activityColor,
  addTimeForDate,
  rangePickerFormat,
  dateFormat,
  hourFormat,
  minuteStep,
};
