import { Button, DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/timeSheet/add.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import { rangePickerFormat } from '@/utils/timeSheet';
import styles from './index.less';

const DailyHeader = (props) => {
  const {
    selectedDate,
    setSelectedDate = () => {},
    setSelectedView = () => {},
    viewChangeComponent = '',
  } = props;

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
    <div className={styles.DailyHeader}>
      <div className={styles.DailyHeader__left}>
        <div className={styles.prevWeek} onClick={onPrevDateClick}>
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
        <div className={styles.nextWeek} onClick={onNextDateClick}>
          <img src={NextIcon} alt="" />
        </div>
      </div>
      <div className={styles.DailyHeader__middle}>{viewChangeComponent()}</div>
      <div className={styles.DailyHeader__right}>
        <Button icon={<img src={AddIcon} alt="" />}>Add Task</Button>
        <Button>Import</Button>
      </div>
    </div>
  );
};

export default connect(() => ({}))(DailyHeader);
