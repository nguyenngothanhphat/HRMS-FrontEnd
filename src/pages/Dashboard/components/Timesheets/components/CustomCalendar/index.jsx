import { Calendar, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect, history } from 'umi';
import PlusIcon from '@/assets/dashboard/timesheetPlus.svg';
import DoneIcon from '@/assets/dashboard/timesheetCheck.svg';
import { dateFormatAPI } from '@/utils/timeSheet';
import styles from './index.less';

const dateFormat = 'MM/DD/YYYY';

const mockHoliday = [
  {
    date: moment('10/07/2021', dateFormat),
    name: 'Ganesh Chaturthi',
  },
];
const CustomCalendar = (props) => {
  const { selectedMonth: selectedMonthProp = '', myTimesheet = [] } = props;

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

  const checkIsHoliday = (date) => {
    const find = mockHoliday.find(
      (val) => moment(val.date).format(dateFormat) === moment(date).format(dateFormat),
    );
    return find;
  };

  // to prevent clicking on date of prev/next month to change month
  const disabledDate = (currentDate) => {
    return moment(currentDate).month() !== moment(selectedMonthProp).month();
  };

  const onFillTimesheet = () => {
    history.push('/time-sheet');
  };

  // RENDER
  const renderDateAction = (date, isDisabled, isHoliday) => {
    const done = checkIsDone(date);
    if (isDisabled || isHoliday) return null;
    if (!done)
      return <img className={styles.actionIcon} src={PlusIcon} alt="" onClick={onFillTimesheet} />;
    return <img className={styles.actionIcon} src={DoneIcon} alt="" onClick={onFillTimesheet} />;
  };

  const dateCellRender = (value) => {
    const isDone = checkIsDone(value);
    const date = moment(value).date();
    const isDisabled = checkDisabled(value);
    const disabledClassName = isDisabled ? styles.disabledDate : '';
    // const isHoliday = checkIsHoliday(value);
    const isHoliday = false;

    if (isHoliday) {
      return (
        <Tooltip title={isHoliday.name} placement="bottomLeft">
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
        }`}
      >
        <span>{date}</span>
        {renderDateAction(value, isDisabled, isHoliday)}
      </div>
    );
  };

  // MAIN
  return (
    <Calendar
      className={styles.CustomCalendar}
      dateCellRender={dateCellRender}
      value={selectedMonthProp}
      disabledDate={disabledDate}
    />
  );
};

export default connect(() => ({}))(CustomCalendar);
