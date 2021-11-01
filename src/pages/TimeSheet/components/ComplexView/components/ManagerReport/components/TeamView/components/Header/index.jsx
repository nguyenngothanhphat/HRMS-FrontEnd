import { SearchOutlined } from '@ant-design/icons';
import { DatePicker, Input } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import FilterIcon from '@/assets/timeSheet/filter.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import { rangePickerFormat } from '@/utils/timeSheet';
import styles from './index.less';

const Header = (props) => {
  const { selectedDate, setSelectedDate = () => {} } = props;

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

  const searchPrefix = () => {
    return (
      <SearchOutlined
        style={{
          fontSize: 16,
          color: 'black',
          marginRight: '10px',
        }}
      />
    );
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
      <div className={styles.Header__right}>
        <div className={styles.filterIcon}>
          <img src={FilterIcon} alt="" />
          <span>Filter</span>
        </div>
        <div className={styles.searchBox}>
          <Input
            className={styles.searchInput}
            placeholder="Search by Name, Task..."
            prefix={searchPrefix()}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
