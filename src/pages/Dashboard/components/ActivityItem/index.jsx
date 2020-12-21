import React from 'react';
import { ReactComponent as MyIcon } from '@/assets/dashboard_launch.svg';
import { Row, Col } from 'antd';

import s from './index.less';

const ActivityItem = (props) => {
  const { day = '', month = '', info = '' } = props;
  return (
    <div className={s.container}>
      <Row gutter={10}>
        <Col span={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={s.date}>
            <span>{day}</span>
            <span>{month}</span>
          </div>
        </Col>
        <Col span={15}>
          <div className={s.description}>
            <p>{info}</p>
          </div>
        </Col>
        <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <MyIcon />
        </Col>
      </Row>
      {/* <div /> */}
    </div>
  );
};

export default ActivityItem;
