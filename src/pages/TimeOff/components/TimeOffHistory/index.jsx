import { Card, Col, Row } from 'antd';
import React from 'react';
import WarningIcon from '@/assets/timeOff/warning_icon.svg';
import styles from './index.less';

const TimeOffHistory = () => {

  const data = [
    {
      key: '1',
      leaveType: 'Sick Leave',
      days30: 0,
      days90: 3,
      days180: 1,
    },
    {
      key: '2',
      leaveType: 'Casual Leave',
      days30: 0,
      days90: 0,
      days180: 0,
    },
    {
      key: '3',
      leaveType: 'Maternity Leave',
      days30: 0,
      days90: 1,
      days180: 0,
    },
    {
      key: '3',
      leaveType: 'Parental Leave',
      days30: 0,
      days90: 1,
      days180: 2,
    },
    {
      key: '4',
      leaveType: 'Wedding Leave',
      days30: 1,
      days90: 1,
      days180: 0,
    },
    {
      key: '5',
      leaveType: 'Work From Home',
      days30: 5,
      days90: 12,
      days180: 24,
    },
    {
      key: '5',
      leaveType: 'Work From Client Place',
      days30: 1,
      days90: 3,
      days180: 7,
    },
  ];

  return (
    <Card className={styles.TimeOffHistory} title={null}>
      <div className={styles.note}>
        <img src={WarningIcon} alt="" />
        <div className={styles.note__title}>
          Excess Timeoff Warning - 5 days of timeoff in the last 30 days.{' '}
        </div>
      </div>
      <div className={styles.title}>Timeoff History</div>
      <div className={styles.container__table}>
        <Row className={styles.row}>
          <Col span={9}> Leave type</Col>
          <Col className={styles.center} span={5}>
            30 days
          </Col>
          <Col className={styles.center} span={5}>
            90 days
          </Col>
          <Col className={styles.center} span={5}>
            180 days
          </Col>
        </Row>
        {data.map((item, index) => {
          return (
            <Row className={styles.col} key={`${index + 1}`}>
              <Col span={9}>{item.leaveType}</Col>
              <Col className={styles.center} span={5}>
                {item.days30}
              </Col>
              <Col className={styles.center} span={5}>
                {item.days90}
              </Col>
              <Col className={styles.center} span={5}>
                {item.days180}
              </Col>
            </Row>
          );
        })}
      </div>
    </Card>
  );
};

export default TimeOffHistory;
