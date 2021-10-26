import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Row, Col } from 'antd';
import { convertMsToTime, EMP_MT_MAIN_COL_SPAN } from '@/utils/timeSheet';
import styles from './index.less';

const { DATE_OF_HOURS, REMAINING } = EMP_MT_MAIN_COL_SPAN;

const DailyFooter = (props) => {
  const { data = {} } = props;
  const [totalHours, setTotalHours] = useState('');

  const calculateTotalHours = (list) => {
    let duration = 0;
    list.forEach((item) => {
      const { timesheet = [] } = item;
      timesheet.forEach((v) => {
        duration += v.duration;
      });
    });
    return convertMsToTime(duration);
    // return moment.utc(duration).format('HH:mm:ss');
  };

  useEffect(() => {
    const totalHoursTemp = calculateTotalHours(data);
    setTotalHours(totalHoursTemp);
  }, [JSON.stringify(data)]);

  // MAIN AREA
  return (
    <Row align="middle" className={styles.DailyFooter}>
      <Col span={DATE_OF_HOURS}>
        <div className={styles.text}>Total</div>
      </Col>
      <Col span={REMAINING}>
        <div className={styles.value}>{totalHours}</div>
      </Col>
    </Row>
  );
};

export default connect(() => ({}))(DailyFooter);
