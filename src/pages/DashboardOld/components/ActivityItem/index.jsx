import React from 'react';
import { ReactComponent as MyIcon } from '@/assets/dashboard_launch.svg';
import { Row, Col } from 'antd';

import s from './index.less';

const ActivityItem = (props) => {
  const { day = '', month = '', info = '' } = props;
  return (
    <Row className={s.container}>
      <Col span={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={s.date}>
          <span>{day}</span>
          <span>{month}</span>
        </div>
      </Col>
      <Col span={16}>
        <div className={s.description}>{info}</div>
      </Col>
      <Col span={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MyIcon />
      </Col>
    </Row>
  );
};

export default ActivityItem;
