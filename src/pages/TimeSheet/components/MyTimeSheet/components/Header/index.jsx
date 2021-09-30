import { MinusOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import styles from './index.less';
import { rangePickerFormat } from '@/utils/timeSheet';

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

  const onDatePickerChange = (dates = []) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
  };

  // MAIN AREA
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <div className={styles.prevWeek} onClick={onPrevWeekClick}>
          <img src={PrevIcon} alt="" />
        </div>
        <div className={styles.rangePicker}>
          <RangePicker
            format={rangePickerFormat}
            separator={<MinusOutlined className={styles.minusSeparator} />}
            value={[startDate, endDate]}
            onChange={onDatePickerChange}
            allowClear={false}
          />
        </div>
        <div className={styles.nextWeek} onClick={onNextWeekClick}>
          <img src={NextIcon} alt="" />
        </div>
      </div>
      <div className={styles.Header__right}>
        Total hours: <span className={styles.hours}>40:40:00</span>
      </div>
    </div>
  );
};

export default connect(() => ({}))(Header);
