import { Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import DoneIcon from '@/assets/dashboard/timesheetCheck.svg';
import PlusIcon from '@/assets/dashboard/timesheetPlus.svg';
import CalendarImage from '@/assets/homePage/calendarImage.png';
import { TIMESHEET_DATE_FORMAT } from '@/constants/dashboard';
import { dateFormatAPI } from '@/constants/timeSheet';
import { getCurrentCompany } from '@/utils/authority';
import styles from './index.less';

const TimeSheet = (props) => {
  const {
    myTimesheet = [],
    dispatch,
    currentUser: { employee: { _id: employeeId = '' } = {} } = {},
  } = props;
  const [dateList, setDateList] = useState([]);

  const getCurrentWeekDays = () => {
    const weekStart = moment().startOf('week');

    const days = [];
    for (let i = 0; i <= 6; i += 1) {
      const temp = moment(weekStart).add(i, 'days');
      if (moment(temp).weekday() !== 0 && moment(temp).weekday() !== 6) {
        days.push(temp);
      }
    }

    return days;
  };

  // FUNCTION
  const checkDisabled = (date) => {
    const checkIfWeekend = moment(date).weekday() === 0 || moment(date).weekday() === 6;
    const checkIfFuture = moment(date) > moment();
    return checkIfWeekend || checkIfFuture;
  };

  const checkIsDone = (date) => {
    const find = myTimesheet.find(
      (ts) =>
        moment(ts.date, dateFormatAPI).format(dateFormatAPI) === moment(date).format(dateFormatAPI),
    );
    if (!find) return false;
    if (find.timesheet.length > 0) {
      return true;
    }
    return false;
  };

  const onFillTimesheet = (selectedDate) => {
    history.push({
      pathname: `/time-sheet/my`,
      state: { currentDateProp: moment(selectedDate).format(TIMESHEET_DATE_FORMAT) },
    });
  };

  const isTheSameDay = (date1, date2) => {
    return moment(date1).format('MM/DD') === moment(date2).format('MM/DD');
  };

  useEffect(() => {
    const weekDays = getCurrentWeekDays();
    setDateList(weekDays);
  }, []);

  // USE EFFECT
  useEffect(() => {
    if (dateList.length > 0) {
      const startDate = dateList[0];
      const endDate = dateList[dateList.length - 1];
      if (startDate && endDate) {
        dispatch({
          type: 'dashboard/fetchMyTimesheetEffect',
          payload: {
            companyId: getCurrentCompany(),
            employeeId,
            fromDate: moment(startDate).format(dateFormatAPI),
            toDate: moment(endDate).format(dateFormatAPI),
          },
        });
      }
    }
  }, [JSON.stringify(dateList)]);

  // RENDER
  const renderDateAction = (date, isDisabled, isHoliday) => {
    const done = checkIsDone(date);
    if (isDisabled || isHoliday) return null;
    if (!done)
      return (
        <img
          className={styles.actionIcon}
          src={PlusIcon}
          alt=""
          onClick={() => onFillTimesheet(date)}
        />
      );
    return (
      <img
        className={styles.actionIcon}
        src={DoneIcon}
        alt=""
        onClick={() => onFillTimesheet(date)}
      />
    );
  };

  const renderDate = (value) => {
    const isDone = checkIsDone(value);
    const date = moment(value).date();
    const isDisabled = checkDisabled(value);
    const disabledClassName = isDisabled ? styles.disabledDate : '';
    // const isHoliday = checkIsHoliday(value);
    const isHoliday = false;
    const isToday = isTheSameDay(moment(), moment(value));

    if (isHoliday) {
      return (
        <Tooltip title={isHoliday.name} placement="bottomLeft" key={value}>
          <div className={`${styles.dateRender} ${styles.disabledDate}`}>
            <span>{date}</span>
            {renderDateAction(value, isDisabled, isHoliday)}
          </div>
        </Tooltip>
      );
    }

    return (
      <div
        className={`${styles.dateRender} ${disabledClassName} ${
          !isDone && !isDisabled ? styles.blueBorder : ''
        } ${isToday ? styles.today : ''}`}
        key={value}
      >
        <span>{date}</span>
        {renderDateAction(value, isDisabled, isHoliday)}
      </div>
    );
  };

  return (
    <div className={styles.TimeSheet}>
      <div className={styles.above}>
        <div className={styles.header}>
          <img src={CalendarImage} alt="" />
          <span className={styles.titleText}>Do not forget to fill in your timesheet!</span>
        </div>
        <p className={styles.description}>Have you filled in your Timesheet yet?</p>
      </div>
      <div className={styles.weekDays}>{dateList.map((date) => renderDate(date))}</div>
    </div>
  );
};

export default connect(
  ({ user: { currentUser = {} } = {}, dashboard: { myTimesheet = [] } = {} }) => ({
    myTimesheet,
    currentUser,
  }),
)(TimeSheet);
