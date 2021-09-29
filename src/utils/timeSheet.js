import moment from 'moment';

const color = {
  WORKING_HOURS: '#71A82B',
  LUNCH_BREAK: '#315ED2',
  PTO: '#A646C8',
};

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
  const result = moment(`${dateToString} ${timeToString}`, 'MM/DD/YYYY h:mm a');
  return result;
};

export { activityColor, addTimeForDate };
