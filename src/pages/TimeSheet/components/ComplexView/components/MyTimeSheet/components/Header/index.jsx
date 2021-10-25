import { DatePicker, Button, Radio } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import AddIcon from '@/assets/timeSheet/add.svg';
import { rangePickerFormat } from '@/utils/timeSheet';
import styles from './index.less';

const Header = (props) => {
  const {
    selectedDate,
    setSelectedDate = () => {},
    selectedView = '',
    setSelectedView = () => {},
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

  const onViewChange = (e) => {
    const { target: { value = '' } = {} || {} } = e;
    setSelectedView(value);
  };

  // MAIN AREA
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
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
      <div className={styles.Header__middle}>
        <Radio.Group value={selectedView} onChange={onViewChange} buttonStyle="solid">
          <Radio.Button value="daily">Daily</Radio.Button>
          <Radio.Button value="weekly">Weekly</Radio.Button>
          <Radio.Button value="monthly">Monthly</Radio.Button>
        </Radio.Group>
      </div>
      <div className={styles.Header__right}>
        <Button icon={<img src={AddIcon} alt="" />}>Add Task</Button>
        <Button>Import</Button>
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
