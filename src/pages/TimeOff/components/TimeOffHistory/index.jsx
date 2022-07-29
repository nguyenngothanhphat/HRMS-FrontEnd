import { Card } from 'antd';
import React from 'react';
import WarningIcon from '@/assets/timeOff/warning_icon.svg';
import styles from './index.less';

const TimeOffHistory = () => {
  return (
    <Card className={styles.TimeOffHistory} title={null}>
      <div className={styles.note}>
        <img src={WarningIcon} alt="" />
        <div className={styles.note__title}>
          Excess Timeoff Warning - 5 days of timeoff in the last 30 days.{' '}
        </div>
      </div>
      <div className={styles.title__Header}>Timeoff History</div>
    </Card>
  );
};

export default TimeOffHistory;
