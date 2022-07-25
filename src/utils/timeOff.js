import moment from 'moment';
import {
  TIMEOFF_12H_FORMAT,
  TIMEOFF_24H_FORMAT,
  TIMEOFF_NEW_REQUEST_DAYS,
  TIMEOFF_STATUS,
  TIMEOFF_TYPE,
} from '@/constants/timeOff';

export const getHours = (startTime, endTime, format) => {
  const duration = moment.duration(moment(endTime, format).diff(moment(startTime, format)));
  return Math.round(duration.asHours() * 100) / 100;
};

export const convert24To12 = (time) => {
  if (!time) return null;
  return moment(time, TIMEOFF_24H_FORMAT).format(TIMEOFF_12H_FORMAT);
};

export const convert12To24 = (time) => {
  if (!time) return null;
  return moment(time, TIMEOFF_12H_FORMAT).format(TIMEOFF_24H_FORMAT);
};

export const checkNormalTypeTimeoff = (type) => {
  return type !== TIMEOFF_TYPE.C;
};

export const roundNumber = (x) => Math.round(x * 10) / 10;
export const roundNumber2 = (x) => Math.round(x * 100) / 100;

export const convertDaysToHours = (numberHourPerDay, value) => {
  return numberHourPerDay * value;
};

export const convertHoursToDays = (numberHourPerDay, value) => {
  return value / numberHourPerDay;
};

export const isFutureDay = (date) => {
  return moment(date).isAfter(moment());
};

export const getShortType = (tab) => {
  switch (tab) {
    case '1':
      return 'A';
    case '2':
      return 'C';
    case '3':
      return 'B';
    case '4':
      return 'D';
    default:
      return '';
  }
};

export const isNewRequest = (status, onDate) => {
  const createdDate = moment(onDate).format('YYYY/MM/DD');
  const nowDate = moment().format('YYYY/MM/DD');
  return (
    status === TIMEOFF_STATUS.IN_PROGRESS &&
    moment(nowDate).subtract(TIMEOFF_NEW_REQUEST_DAYS, 'days').isSameOrBefore(moment(createdDate))
  );
};

export const isUpdatedRequest = (status, updated = false) => {
  return status === TIMEOFF_STATUS.IN_PROGRESS && updated;
};
