import { Card, Col, Row } from 'antd';
import React from 'react';
import WarningIcon from '@/assets/timeOff/warning_icon.svg';
import styles from './index.less';

const TimeOffHistory = (props) => {
  const { data: { historyEmployee = [], message = '' } = {} } = props;
  return (
    <Card className={styles.TimeOffHistory} title={null}>
      {message && (
        <div className={styles.note}>
          <img src={WarningIcon} alt="" />
          <div className={styles.note__title}>{message}</div>
        </div>
      )}
      <div className={styles.title}>Timeoff History</div>
      <div className={styles.container__table}>
        <Row className={styles.header}>
          <Col span={9}>Leave type</Col>
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
        {historyEmployee.map((parentType) => (
          <div className={styles.body}>
            {(parentType.childTypes || []).map((type) => (
              <Row className={styles.row} key={type._id}>
                <Col span={9}>{type.name}</Col>
                <Col className={styles.center} span={5}>
                  {type.in30Days}
                </Col>
                <Col className={styles.center} span={5}>
                  {type.in90Days}
                </Col>
                <Col className={styles.center} span={5}>
                  {type.in180Days}
                </Col>
              </Row>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TimeOffHistory;
