import { MinusOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import CalendarIcon from '@/assets/timeSheet/calendar.svg';
import FilterIcon from '@/assets/timeSheet/filter.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import { rangePickerFormat } from '@/utils/timeSheet';
import styles from './index.less';

const { RangePicker } = DatePicker;

const Header = (props) => {
  const { startDate, endDate, setStartDate = () => {}, setEndDate = () => {} } = props;

  // HEADER AREA
  // HEADER AREA FOR MONTH
  const onPrevClick = () => {
    const lastSunday = moment(startDate).add(-1, 'weeks');
    const currentSunday = moment(startDate).add(-1, 'weeks').weekday(7);
    setStartDate(lastSunday);
    setEndDate(currentSunday);
  };

  const onNextClick = () => {
    const nextSunday = moment(startDate).add(1, 'weeks');
    const currentSunday = moment(startDate).add(1, 'weeks').weekday(7);
    setStartDate(nextSunday);
    setEndDate(currentSunday);
  };

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
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
        <div className={styles.prevWeek} onClick={onPrevClick}>
          <img src={PrevIcon} alt="" />
        </div>
        <div className={styles.rangePicker}>
          <RangePicker
            format={rangePickerFormat}
            separator={<MinusOutlined className={styles.minusSeparator} />}
            value={[startDate, endDate]}
            onChange={onDatePickerChange}
            allowClear={false}
            disabled
            suffixIcon={
              <img alt="calendar-icon" src={CalendarIcon} className={styles.calendarIcon} />
            }
          />
        </div>
        <div className={styles.nextWeek} onClick={onNextClick}>
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
