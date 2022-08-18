import moment from 'moment';
import {
  TIMEOFF_12H_FORMAT,
  TIMEOFF_24H_FORMAT,
  TIMEOFF_DATE_HISTORY_FORMAT,
  TIMEOFF_NEW_REQUEST_DAYS,
  TIMEOFF_STATUS,
  TIMEOFF_STATUS_NAME,
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

export const tabType = {
  1: 'A',
  2: 'C',
  3: 'B',
  4: 'D',
};

export const getShortType = (tab = '') => tabType[tab] || '';

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

export const getTypeListByTab = (typeList = [], tab = '') =>
  typeList.filter((x) => x.type === tabType[tab]);

export const formatDateHistory = (date) => {
  if (moment(date).isValid()) return moment(date).locale('en').format(TIMEOFF_DATE_HISTORY_FORMAT);
  return '-';
};

export const convertOperationText = (operation = '') => {
  if (!operation) return '-';
  const dashTxt = operation.replace(/-+/g, ' ').toLowerCase();
  const txtArray = dashTxt.split(' ');

  for (let i = 0; i < txtArray.length; i += 1) {
    txtArray[i] = txtArray[i].charAt(0).toUpperCase() + txtArray[i].slice(1);
  }

  return txtArray.join(' ');
};

export const formatHistoryData = (data) => {
  const formattedData = data.map((item) => {
    const { history = {}, changedBy = {}, timeoffType = {}, leaveRequest = {} } = item;
    const {
      date = '-',
      operation = '',
      status = '-',
      duration: numberOfDays = '-',
      currentBalance = '-',
    } = history || {};
    const { generalInfoInfo = {} } = changedBy || {};
    const { legalName = '-' } = generalInfoInfo || {};
    const { name: leaveType = '-' } = timeoffType || {};
    const { fromDate: startDate = '-', toDate: endDate = '-' } = leaveRequest || {};

    return {
      date: formatDateHistory(date),
      operation: convertOperationText(operation),
      leaveType,
      startDate: formatDateHistory(startDate),
      endDate: formatDateHistory(endDate),
      changedBy: legalName,
      status: TIMEOFF_STATUS_NAME[status] || '-',
      numberOfDays,
      currentBalance,
    };
  });

  return formattedData;
};
