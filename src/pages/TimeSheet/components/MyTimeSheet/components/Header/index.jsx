import { MinusOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import styles from './index.less';

const { RangePicker } = DatePicker;
const datePickerFormat = 'ddd, MMM D, YYYY';

const Header = (props) => {
  const {
    firstDateOfWeek,
    endDateOfWeek,
    setFirstDateOfWeek = () => {},
    setEndDateOfWeek = () => {},
  } = props;

  // HEADER AREA
  const onPrevWeekClick = () => {
    const lastSunday = moment(firstDateOfWeek).add(-1, 'weeks');
    const currentSunday = moment(firstDateOfWeek).add(-1, 'weeks').weekday(7);
    setFirstDateOfWeek(lastSunday);
    setEndDateOfWeek(currentSunday);
  };

  const onNextWeekClick = () => {
    const nextSunday = moment(firstDateOfWeek).add(1, 'weeks');
    const currentSunday = moment(firstDateOfWeek).add(1, 'weeks').weekday(7);
    setFirstDateOfWeek(nextSunday);
    setEndDateOfWeek(currentSunday);
  };

  const onDatePickerChange = (dates = []) => {
    setFirstDateOfWeek(dates[0]);
    setEndDateOfWeek(dates[1]);
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
            format={datePickerFormat}
            separator={<MinusOutlined className={styles.minusSeparator} />}
            value={[firstDateOfWeek, endDateOfWeek]}
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
