import { Button } from 'antd';
import React from 'react';
import { history } from 'umi';
import CalendarImage from '@/assets/homePage/calendarImage.svg';
import styles from './index.less';

const TimeOff = () => {
  const createTimeOff = () => {
    history.push({
      pathname: `/time-off/overview/personal-timeoff/new`,
    });
  };

  return (
    <div className={styles.TimeOff}>
      <div className={styles.above}>
        <div className={styles.header}>
          <img src={CalendarImage} alt="" />
          <span className={styles.titleText}>Apply for Timeoff from Office</span>
        </div>
        <p className={styles.description}>Apply for leaves with/without pay, work from home.</p>
      </div>
      <div className={styles.button}>
        <Button className={styles.applyTimeOffBtn} onClick={createTimeOff}>
          Apply Time Off
        </Button>
      </div>
    </div>
  );
};

export default TimeOff;
