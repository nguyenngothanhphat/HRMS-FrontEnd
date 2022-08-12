import moment from 'moment';

export const disabledEndDate = (currentDate, startDate) => {
  return currentDate && currentDate < moment(startDate).add(1, 'days');
};

export const test = '';
