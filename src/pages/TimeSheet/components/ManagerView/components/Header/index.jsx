import { MinusOutlined } from '@ant-design/icons';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import { rangePickerFormat } from '@/utils/timeSheet';

import styles from './index.less';

const { RangePicker } = DatePicker;

const Header = (props) => {
  const { startDate, endDate, setStartDate = () => {}, setEndDate = () => {} } = props;

  // HEADER AREA
  const onPrevWeekClick = () => {
    const lastSunday = moment(startDate).add(-1, 'weeks');
    const currentSunday = moment(startDate).add(-1, 'weeks').weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
  };

  const onNextWeekClick = () => {
    const nextSunday = moment(startDate).add(1, 'weeks');
    const currentSunday = moment(startDate).add(1, 'weeks').weekday(7);
    setStartDate(nextSunday);
    setEndDate(currentSunday);
  };

  const onStartDateChange = (value) => {
    setStartDate(value);
  };

  const onEndDateChange = (value) => {
    setEndDate(value);
  };
  // MAIN AREA
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <div className={styles.prevWeek} onClick={onPrevWeekClick}>
          <img src={PrevIcon} alt="" />
        </div>
        <div className={styles.rangePicker}>
          <DatePicker
            format={rangePickerFormat}
            value={startDate}
            onChange={onStartDateChange}
            allowClear={false}
            suffixIcon={
              <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
            }
            className={styles.startDate}
            placeholder="Start Date"
          />
          <DatePicker
            format={rangePickerFormat}
            value={endDate}
            onChange={onEndDateChange}
            allowClear={false}
            suffixIcon={
              <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
            }
            placeholder="End Date"
          />
        </div>
        <div className={styles.nextWeek} onClick={onNextWeekClick}>
          <img src={NextIcon} alt="" />
        </div>
      </div>
      <div className={styles.Header__right}>
        <Button className={styles.exportBtn} icon={<img src={DownloadIcon} alt="" />}>
          Export
        </Button>
        <div className={styles.totalHours}>
          Total hours: <span className={styles.hours}>40:40:00</span>
        </div>
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
