import { MinusOutlined } from '@ant-design/icons';
import { Button, DatePicker } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import PrevIcon from '@/assets/timeSheet/prev.svg';
import NextIcon from '@/assets/timeSheet/next.svg';
import DownloadIcon from '@/assets/timeSheet/download.svg';
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
