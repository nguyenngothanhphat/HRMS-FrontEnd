import { DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import { rangePickerFormat } from '@/constants/timeSheet';
import styles from './index.less';

const CustomDatePicker = (props) => {
  const { selectedDate, setSelectedDate = () => {}, disableBtn = false } = props;

  // HEADER AREA
  const onPrevDateClick = () => {
    const prevDate = moment(selectedDate).add(-1, 'days');
    setSelectedDate(prevDate);
  };

  const onNextDateClick = () => {
    const nextDate = moment(selectedDate).add(1, 'days');
    setSelectedDate(nextDate);
  };

  const onDatePickerChange = (date) => {
    setSelectedDate(date);
  };

  // MAIN AREA
  return (
    <div className={styles.CustomDatePicker}>
      <div
        className={styles.prevWeek}
        onClick={onPrevDateClick}
        style={{
          cursor: disableBtn ? 'default' : 'pointer',
          pointerEvents: disableBtn ? 'none' : 'auto',
          opacity: disableBtn ? 0.7 : 1,
        }}
      >
        <img src={PrevIcon} alt="" />
      </div>
      <div className={styles.rangePicker}>
        <DatePicker
          format={rangePickerFormat}
          value={selectedDate}
          onChange={onDatePickerChange}
          allowClear={false}
          suffixIcon={
            <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
          }
        />
      </div>
      <div
        className={styles.nextWeek}
        onClick={onNextDateClick}
        style={{
          cursor: disableBtn ? 'default' : 'pointer',
          pointerEvents: disableBtn ? 'none' : 'auto',
          opacity: disableBtn ? 0.7 : 1,
        }}
      >
        <img src={NextIcon} alt="" />
      </div>
    </div>
  );
};

export default connect(() => ({}))(CustomDatePicker);
