import { notification } from 'antd';
import moment from 'moment';
import { commonDateFormat } from '@/constants/timeSheet';

// functions
export const addTimeForDate = (date, time) => {
  const dateToString = moment(date).format('MM/DD/YYYY').toString();
  const timeToString = moment(time).format('h:mm a').toString();
  return moment(`${dateToString} ${timeToString}`, 'MM/DD/YYYY h:mm a');
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
